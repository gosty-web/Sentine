import chokidar from 'chokidar';
import fs from 'fs';
import { RollbackSystem } from './RollbackSystem.js';

export class FileGuardian {
  private watcher: chokidar.FSWatcher | null = null;
  private allowedFiles: Set<string> = new Set();
  private rollbackSystem: RollbackSystem;

  constructor(rollbackSystem?: RollbackSystem) {
    this.rollbackSystem = rollbackSystem || new RollbackSystem();
  }

  public setAllowedFiles(files: string[]) {
    this.allowedFiles = new Set(files);
  }

  public start(directory: string = process.cwd()) {
    this.watcher = chokidar.watch(directory, {
      ignored: [/(^|[\/\\])\../, 'node_modules', 'dist'],
      persistent: true
    });

    const handleUnauthorized = (path: string, type: string) => {
      if (!this.allowedFiles.has(path) && !this.isSentinelFile(path)) {
        console.warn(`Unauthorized ${type} detected: ${path}. Rolling back...`);
        this.rollbackSystem.rollback(path);
      }
    };

    this.watcher.on('change', (path) => handleUnauthorized(path, 'modification'));
    this.watcher.on('add', (path) => handleUnauthorized(path, 'addition'));
    this.watcher.on('unlink', (path) => handleUnauthorized(path, 'deletion'));
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
