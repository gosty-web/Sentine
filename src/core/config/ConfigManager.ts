import fs from 'fs';
import path from 'path';

export interface SentinelConfig {
  version: string;
  runtimes: string[];
  executionMode: 'strict' | 'safe' | 'dry';
  subAgentEnabled: boolean;
  subAgentCount: number;
  validationSettings: {
    strict: boolean;
    autoFix: boolean;
  };
  memorySettings: {
    storage: 'sqlite' | 'json';
  };
  plugins: string[];
}

export class ConfigManager {
  private config: SentinelConfig | null = null;
  private configPath: string;

  constructor(customPath?: string) {
    this.configPath = customPath || path.join(process.cwd(), 'sentinel.config.json');
  }

  public loadConfig(cliFlags: Partial<SentinelConfig> = {}): SentinelConfig {
    const defaults: SentinelConfig = {
      version: '1.0.0',
      runtimes: [],
      executionMode: 'strict',
      subAgentEnabled: true,
      subAgentCount: 1,
      validationSettings: {
        strict: true,
        autoFix: false
      },
      memorySettings: {
        storage: 'sqlite'
      },
      plugins: []
    };

    let localConfig: Partial<SentinelConfig> = {};
    if (fs.existsSync(this.configPath)) {
      try {
        localConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      } catch (e) {
        console.error('Error parsing sentinel.config.json:', e);
      }
    }

    this.config = {
      ...defaults,
      ...localConfig,
      ...cliFlags,
      validationSettings: {
        ...defaults.validationSettings,
        ...(localConfig.validationSettings || {}),
        ...(cliFlags.validationSettings || {})
      },
      memorySettings: {
        ...defaults.memorySettings,
        ...(localConfig.memorySettings || {}),
        ...(cliFlags.memorySettings || {})
      }
    };

    return this.config;
  }

  public getConfig(): SentinelConfig {
    if (!this.config) {
      return this.loadConfig();
    }
    return this.config;
  }
}
