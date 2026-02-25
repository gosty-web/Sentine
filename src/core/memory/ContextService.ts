import { MemoryEngine } from './MemoryEngine.js';

export class ContextService {
  private memoryEngine: MemoryEngine;

  constructor(memoryEngine: MemoryEngine) {
    this.memoryEngine = memoryEngine;
  }

  public getContextForPrompt(taskId: string): string {
    const memories = this.memoryEngine.query();
    const relevant = memories.slice(0, 10);

    return relevant.map(m => `[${m.type}] ${m.content}`).join('\n');
  }

  public getArchitectureSnapshot(): string {
    const arch = this.memoryEngine.query('architecture');
    return arch.length > 0 ? arch[0].content : 'No architecture decisions recorded.';
  }
}
