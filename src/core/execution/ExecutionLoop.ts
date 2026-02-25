import fs from 'fs';
import path from 'path';
import { StateMachine, ExecutionState } from './StateMachine.js';
import { TaskGraph, Task } from '../task/TaskGraph.js';
import { AgentAdapter } from '../adapter/AgentAdapter.js';
import { PromptEnvelope } from './PromptEnvelope.js';
import { RetryHandler } from './RetryHandler.js';
import { RollbackSystem } from '../guardian/RollbackSystem.js';
import { FileGuardian } from '../guardian/FileGuardian.js';
import { ContextService } from '../memory/ContextService.js';
import { HookManager, HookType } from '../plugin/HookManager.js';
import { ValidationPipeline } from '../validation/ValidationPipeline.js';
import { TypeScriptValidator } from '../validation/validators/TypeScriptValidator.js';
import { LintValidator } from '../validation/validators/LintValidator.js';
import { PlaceholderValidator } from '../validation/validators/PlaceholderValidator.js';

export class ExecutionLoop {
  private stateMachine: StateMachine;
  private taskGraph: TaskGraph;
  private adapter: AgentAdapter;
  private retryHandler: RetryHandler;
  private rollbackSystem: RollbackSystem;
  private fileGuardian: FileGuardian;
  private contextService?: ContextService;
  private hookManager: HookManager;

  constructor(
    taskGraph: TaskGraph,
    adapter: AgentAdapter,
    contextService?: ContextService,
    hookManager?: HookManager
  ) {
    this.stateMachine = new StateMachine();
    this.taskGraph = taskGraph;
    this.adapter = adapter;
    this.retryHandler = new RetryHandler();
    this.rollbackSystem = new RollbackSystem();
    this.fileGuardian = new FileGuardian(this.rollbackSystem);
    this.contextService = contextService;
    this.hookManager = hookManager || new HookManager();
  }

  async start() {
    this.stateMachine.transitionTo(ExecutionState.EXECUTING);

    // Backup project before starting the loop to ensure full rollback capability
    this.rollbackSystem.backupProject(process.cwd(), ['node_modules', 'dist', '.git', '.sentinel']);

    this.fileGuardian.start();

    try {
      while (true) {
        const readyTasks = this.taskGraph.getReadyTasks();
        if (readyTasks.length === 0) {
          const allTasks = this.taskGraph.getAllTasks();
          const failedTasks = allTasks.filter(t => t.status === 'failed');
          if (failedTasks.length > 0) {
             this.stateMachine.transitionTo(ExecutionState.FAILED);
             break;
          }
          this.stateMachine.transitionTo(ExecutionState.COMPLETED);
          break;
        }

        for (const task of readyTasks) {
          await this.executeTask(task);
        }
      }
    } finally {
      this.fileGuardian.stop();
    }
  }

  private async executeTask(task: Task) {
    console.log(`Executing task: ${task.id} - ${task.description}`);
    this.taskGraph.updateTaskStatus(task.id, 'in-progress');
    this.fileGuardian.setAllowedFiles(task.affectedFiles);

    // Backup files before execution
    task.affectedFiles.forEach(file => this.rollbackSystem.backup(file));

    try {
      await this.hookManager.trigger(HookType.ON_BEFORE_EXECUTION, task);

      const memory = this.contextService?.getContextForPrompt(task.id);
      const architecture = this.contextService?.getArchitectureSnapshot();

      const prompt = PromptEnvelope.wrap(task, {
          policies: ['No placeholders'],
          architecture: architecture,
          memory: memory
      });

      const response = await this.adapter.sendPrompt(prompt);

      // Parse agent output and apply changes
      this.applyChanges(response.content);

      this.stateMachine.transitionTo(ExecutionState.VALIDATING);
      const validationResult = await this.validateTask(task);
      await this.hookManager.trigger(HookType.ON_VALIDATION, validationResult);

      if (validationResult.success) {
        this.taskGraph.updateTaskStatus(task.id, 'completed');
        await this.hookManager.trigger(HookType.ON_AFTER_EXECUTION, task);
        this.stateMachine.transitionTo(ExecutionState.EXECUTING);
      } else {
        console.warn(`Validation failed for task ${task.id}:`, validationResult.errors);
        this.rollbackSystem.rollbackAll(task.affectedFiles);

        if (this.retryHandler.shouldRetry(task.id)) {
          this.retryHandler.incrementRetry(task.id);
          this.stateMachine.transitionTo(ExecutionState.RETRYING);
          console.log(`Retrying task ${task.id} (Attempt ${this.retryHandler.getRetryCount(task.id)})`);
          await this.executeTask(task);
        } else {
          this.taskGraph.updateTaskStatus(task.id, 'failed');
        }
      }
    } catch (e) {
      console.error(`Error executing task ${task.id}:`, e);
      this.rollbackSystem.rollbackAll(task.affectedFiles);
      this.taskGraph.updateTaskStatus(task.id, 'failed');
    }
  }

  private applyChanges(content: string) {
    try {
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json/, '').replace(/```$/, '').trim();
      }
      const changes = JSON.parse(jsonContent);
      if (Array.isArray(changes)) {
        changes.forEach(change => {
          const absolutePath = path.resolve(process.cwd(), change.path);
          if (!absolutePath.startsWith(process.cwd())) {
            throw new Error(`Path traversal attempt detected: ${change.path}`);
          }
          const dir = path.dirname(absolutePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(absolutePath, change.content);
          console.log(`Applied changes to ${change.path}`);
        });
      }
    } catch (e) {
      console.error('Failed to parse changes from agent output. Output was:', content);
      throw new Error('Invalid agent output for file changes');
    }
  }

  private async validateTask(task: Task) {
    const pipeline = new ValidationPipeline();
    pipeline.addValidator(new TypeScriptValidator());
    pipeline.addValidator(new LintValidator());
    pipeline.addValidator(new PlaceholderValidator(task.affectedFiles));

    return await pipeline.run();
  }
}
