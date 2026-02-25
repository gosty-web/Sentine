import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ConfigManager } from '../../src/core/config/ConfigManager.js';

describe('ConfigManager', () => {
  const testConfigPath = path.join(process.cwd(), 'test.config.json');

  afterEach(() => {
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
  });

  it('should load default configuration if no file exists', () => {
    const configManager = new ConfigManager(testConfigPath);
    const config = configManager.loadConfig();
    expect(config.executionMode).toBe('strict');
    expect(config.subAgentEnabled).toBe(true);
  });

  it('should merge local config with defaults', () => {
    const localConfig = {
      executionMode: 'safe',
      subAgentCount: 5
    };
    fs.writeFileSync(testConfigPath, JSON.stringify(localConfig));

    const configManager = new ConfigManager(testConfigPath);
    const config = configManager.loadConfig();
    expect(config.executionMode).toBe('safe');
    expect(config.subAgentCount).toBe(5);
    expect(config.subAgentEnabled).toBe(true); // From defaults
  });

  it('should give priority to CLI flags', () => {
    const localConfig = {
      executionMode: 'safe'
    };
    fs.writeFileSync(testConfigPath, JSON.stringify(localConfig));

    const configManager = new ConfigManager(testConfigPath);
    const config = configManager.loadConfig({ executionMode: 'dry' });
    expect(config.executionMode).toBe('dry');
  });
});
