import { AgentAdapter } from './AgentAdapter.js';

export class AdapterRegistry {
  private adapters: Map<string, AgentAdapter> = new Map();

  public register(adapter: AgentAdapter) {
    this.adapters.set(adapter.getName().toLowerCase(), adapter);
  }

  public getAdapter(name: string): AgentAdapter {
    const adapter = this.adapters.get(name.toLowerCase());
    if (!adapter) {
      throw new Error(`Adapter ${name} not found in registry.`);
    }
    return adapter;
  }

  public listAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }
}
