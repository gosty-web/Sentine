import { BaseCommand } from '../BaseCommand.js';
import fs from 'fs';
import path from 'path';

export class StatusCommand extends BaseCommand {
  getName(): string {
    return 'status';
  }

  getDescription(): string {
    return 'Show current status of Sentinel Kernel';
  }

  async execute(): Promise<void> {
    const configPath = path.join(process.cwd(), 'sentinel.config.json');
    if (!fs.existsSync(configPath)) {
      console.log('Sentinel Kernel is not initialized in this directory.');
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log('=== Sentinel Kernel Status ===');
    console.log(`Version: ${config.version}`);
    console.log(`Mode: ${config.executionMode}`);
    console.log(`Sub-agents: ${config.subAgentEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`Runtimes: ${config.runtimes.join(', ')}`);
  }
}
