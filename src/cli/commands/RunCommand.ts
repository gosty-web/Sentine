import fs from 'fs';
import path from 'path';
import { BaseCommand } from '../BaseCommand.js';
import { ExecutionLoop } from '../../core/execution/ExecutionLoop.js';
import { TaskGraph } from '../../core/task/TaskGraph.js';
import { ConfigManager } from '../../core/config/ConfigManager.js';
import { GeminiAdapter } from '../../core/adapter/GeminiAdapter.js';
import { MemoryEngine } from '../../core/memory/MemoryEngine.js';
import { ContextService } from '../../core/memory/ContextService.js';
import { HookManager } from '../../core/plugin/HookManager.js';

export class RunCommand extends BaseCommand {
  getName(): string {
    return 'run';
  }

  getDescription(): string {
    return 'Execute the task loop for the current project';
  }

  async execute(options: any): Promise<void> {
    const configManager = new ConfigManager();
    const config = configManager.loadConfig();

    const apiKey = process.env.GEMINI_API_KEY || 'fake-key';
    const adapter = new GeminiAdapter(apiKey);

    const graphPath = path.join(process.cwd(), '.sentinel', 'task_graph.json');
    if (!fs.existsSync(graphPath)) {
      console.error('Error: No task graph found. Run "sentinel plan" first.');
      process.exit(1);
    }

    console.log('Loading task graph...');
    const taskGraph = TaskGraph.deserialize(fs.readFileSync(graphPath, 'utf-8'));

    const memoryEngine = new MemoryEngine();
    const contextService = new ContextService(memoryEngine);
    const hookManager = new HookManager();

    console.log('Starting Sentinel execution loop...');
    const loop = new ExecutionLoop(taskGraph, adapter, contextService, hookManager);
    await loop.start();

    // Update graph on disk after execution
    fs.writeFileSync(graphPath, taskGraph.serialize());
  }
}
