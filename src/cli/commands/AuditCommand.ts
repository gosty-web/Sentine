import { BaseCommand } from '../BaseCommand.js';
import { MemoryEngine } from '../../core/memory/MemoryEngine.js';

export class AuditCommand extends BaseCommand {
  getName(): string {
    return 'audit';
  }

  getDescription(): string {
    return 'Show audit logs from Sentinel memory';
  }

  async execute(): Promise<void> {
    const memory = new MemoryEngine();
    const logs = memory.query();

    console.log('=== Sentinel Audit Logs ===');
    logs.forEach(log => {
      console.log(`[${log.timestamp}] ${log.type}: ${log.content}`);
    });
    memory.close();
  }
}
