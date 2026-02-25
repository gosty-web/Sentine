import { HookManager } from './HookManager.js';

export interface SentinelPlugin {
  name: string;
  apply(hookManager: HookManager): void;
}

export class PluginLoader {
  private hookManager: HookManager;

  constructor(hookManager: HookManager) {
    this.hookManager = hookManager;
  }

  public async loadPlugin(plugin: SentinelPlugin) {
    console.log(`Loading plugin: ${plugin.name}`);
    plugin.apply(this.hookManager);
  }
}
