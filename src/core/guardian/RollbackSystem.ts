import fs from 'fs';

export class RollbackSystem {
  private backups: Map<string, string> = new Map();

  public backup(filePath: string) {
    if (fs.existsSync(filePath)) {
      this.backups.set(filePath, fs.readFileSync(filePath, 'utf-8'));
    }
  }

  public rollback(filePath: string) {
    const content = this.backups.get(filePath);
    if (content !== undefined) {
      fs.writeFileSync(filePath, content);
      console.log(`Rolled back ${filePath}`);
    } else {
      console.error(`No backup found for ${filePath}, cannot rollback!`);
    }
  }

  public clear() {
    this.backups.clear();
  }

  public rollbackAll(filePaths: string[]) {
    filePaths.forEach((path) => this.rollback(path));
  }
}
