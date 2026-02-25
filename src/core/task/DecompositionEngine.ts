import { AgentAdapter } from '../adapter/AgentAdapter.js';
import { TaskGraph, Task } from './TaskGraph.js';

export class DecompositionEngine {
  private adapter: AgentAdapter;

  constructor(adapter: AgentAdapter) {
    this.adapter = adapter;
  }

  async decompose(prompt: string): Promise<TaskGraph> {
    const systemPrompt = `
You are a Task Decomposition Engine for Sentinel Kernel.
Your job is to break down the user's request into a set of discrete, dependent tasks.
Each task must have:
- id: A unique string identifier
- description: Clear explanation of what to do
- dependencies: Array of task ids that must be completed first
- affectedFiles: Array of files that will be modified or created
- validationRules: Array of rules to verify completion

Output MUST be a valid JSON array of tasks.
    `;

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

    const response = await this.adapter.sendPrompt(fullPrompt);
    let tasks: Task[];

    try {
      // Basic extraction if the agent wraps in code blocks
      let content = response.content.trim();
      if (content.startsWith('```json')) {
        content = content.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (content.startsWith('```')) {
         content = content.replace(/^```/, '').replace(/```$/, '').trim();
      }

      tasks = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse tasks from agent response:', response.content);
      throw new Error('Decomposition failed: Invalid agent output format');
    }

    const graph = new TaskGraph();
    tasks.forEach(task => {
      task.status = 'pending';
      graph.addTask(task);
    });

    if (graph.hasCycles()) {
      throw new Error('Decomposition failed: Generated task graph has cycles');
    }

    return graph;
  }
}
