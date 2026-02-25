import { describe, it, expect, vi } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Sentinel CLI E2E', () => {
  it('should initialize and show status', () => {
    // For E2E we can run the built files
    // But since init is interactive, we'll manually create the files it would create

    if (!fs.existsSync('.sentinel')) fs.mkdirSync('.sentinel');
    fs.writeFileSync('sentinel.config.json', JSON.stringify({
      version: '1.0.0',
      executionMode: 'strict',
      runtimes: ['Gemini'],
      subAgentEnabled: true
    }));

    const output = execSync('node dist/index.js status').toString();
    expect(output).toContain('=== Sentinel Kernel Status ===');
    expect(output).toContain('Version: 1.0.0');

    // Cleanup
    fs.unlinkSync('sentinel.config.json');
    if (fs.rmSync) {
      fs.rmSync('.sentinel', { recursive: true });
    } else {
      fs.rmdirSync('.sentinel', { recursive: true });
    }
  });
});
