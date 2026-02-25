import chokidar from 'chokidar';
import fs from 'fs';
import { RollbackSystem } from './RollbackSystem.js';

export class FileGuardian {
  private watcher: chokidar.FSWatcher | null = null;
  private allowedFiles: Set<string> = new Set();
  private rollbackSystem: RollbackSystem;

  constructor() {
    this.rollbackSystem = new RollbackSystem();
  }

  public setAllowedFiles(files: string[]) {
    this.allowedFiles = new Set(files);
  }

  public start(directory: string = process.cwd()) {
    this.watcher = chokidar.watch(directory, {
      ignored: [/(^|[\/\\])\../, 'node_modules', 'dist'],
      persistent: true
    });

    this.watcher.on('change', (path) => {
      if (!this.allowedFiles.has(path) && !this.isSentinelFile(path)) {
        console.warn(`Unauthorized modification detected: ${path}. Rolling back...`);
        this.rollbackSystem.rollback(path);
      }
    });
  }

  public stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  private isSentinelFile(path: string): boolean {
    return path.includes('.sentinel') || path === 'sentinel.config.json';
  }
}
