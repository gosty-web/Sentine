import { Command } from 'commander';
import { BaseCommand } from './BaseCommand.js';

export class Router {
  private program: Command;
  private commands: Map<string, BaseCommand>;

  constructor() {
    this.program = new Command();
    this.commands = new Map();
    this.setupBase();
  }

  private setupBase() {
    this.program
      .name('sentinel')
      .description('Sentinel Kernel: Deterministic execution governance for AI agents')
      .version('1.0.0');

    this.program.addHelpText('after', `
Slash Commands:
  /Sentinel-help    Show this help
  /Sentinel-run     Execute the task loop
  /Sentinel-plan    Generate planning artifacts
  /Sentinel-status  Show current status
  /Sentinel-validate Run validation pipeline
  /Sentinel-audit   Show audit logs
    `);
  }

  public registerCommand(command: BaseCommand) {
    const name = command.getName();
    this.commands.set(name, command);

    const cmd = this.program.command(name).description(command.getDescription());

    command.getOptions().forEach(opt => {
        cmd.option(opt.flags, opt.description, opt.defaultValue);
    });

    cmd.action(async (options) => {
      try {
        await command.execute(options);
      } catch (error) {
        console.error(`Error executing command ${name}:`, error);
        process.exit(1);
      }
    });
  }

  public async run(args: string[]) {
    const processedArgs = this.preprocessSlashCommands(args);
    await this.program.parseAsync(processedArgs);
  }

  private preprocessSlashCommands(args: string[]): string[] {
    return args.map(arg => {
      if (arg.startsWith('/Sentinel-')) {
        const cmd = arg.replace('/Sentinel-', '').toLowerCase();
        return cmd;
      }
      return arg;
    });
  }
}
