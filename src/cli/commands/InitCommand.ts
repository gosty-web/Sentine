import fs from 'fs';
import path from 'path';
import pkgEnquirer from 'enquirer';
const { prompt } = pkgEnquirer;
import { BaseCommand } from '../BaseCommand.js';
import { showBanner } from '../installer/UI.js';
import { getOS } from '../installer/Env.js';

export class InitCommand extends BaseCommand {
  getName(): string {
    return 'init';
  }

  getDescription(): string {
    return 'Initialize Sentinel Kernel in the current repository';
  }

  async execute(): Promise<void> {
    showBanner();
    console.log(`Detected OS: ${getOS()}\n`);

    const response = await prompt([
      {
        type: 'multiselect',
        name: 'runtimes',
        message: 'Which runtimes do you want to install for?',
        choices: [
          { name: 'Gemini' },
          { name: 'Claude Code' },
          { name: 'OpenCode' }
        ]
      },
      {
        type: 'select',
        name: 'installType',
        message: 'Install Type?',
        choices: ['Local', 'Global']
      }
    ]) as any;

    console.log('\nInitializing...');

    const config = {
      version: '1.0.0',
      runtimes: response.runtimes,
      executionMode: 'strict',
      subAgentEnabled: true,
      subAgentCount: response.runtimes.length > 0 ? 3 : 1,
      validationSettings: {
        strict: true,
        autoFix: false
      },
      memorySettings: {
        storage: 'sqlite'
      },
      plugins: []
    };

    const dotSentinelDir = path.join(process.cwd(), '.sentinel');
    if (!fs.existsSync(dotSentinelDir)) {
      fs.mkdirSync(dotSentinelDir);
    }

    fs.writeFileSync(
      path.join(process.cwd(), 'sentinel.config.json'),
      JSON.stringify(config, null, 2)
    );

    fs.writeFileSync(
      path.join(dotSentinelDir, 'version'),
      '1.0.0'
    );

    console.log('✅ Sentinel Kernel initialized successfully.');
  }
}
