import fs from 'fs';
import path from 'path';

export class RollbackSystem {
  private backups: Map<string, string> = new Map();

  public backup(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    if (fs.existsSync(resolvedPath) && fs.lstatSync(resolvedPath).isFile()) {
      this.backups.set(resolvedPath, fs.readFileSync(resolvedPath, 'utf-8'));
    }
  }

  public backupProject(root: string, ignore: string[] = []) {
    const files = this.getAllFiles(root, ignore);
    files.forEach(file => this.backup(file));
  }

  private getAllFiles(dir: string, ignore: string[]): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (ignore.some(i => filePath.includes(i))) return;
      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllFiles(filePath, ignore));
      } else {
        results.push(filePath);
      }
    });
    return results;
  }

  public rollback(filePath: string) {
    const resolvedPath = path.resolve(filePath);
    const content = this.backups.get(resolvedPath);
    if (content !== undefined) {
      fs.writeFileSync(resolvedPath, content);
      console.log(`Rolled back ${filePath}`);
    } else {
      // If we don't have a backup and the file exists, it might be an unauthorized addition
      if (fs.existsSync(resolvedPath)) {
        fs.unlinkSync(resolvedPath);
        console.log(`Deleted unauthorized file: ${filePath}`);
      } else {
        console.error(`No backup found for ${filePath}, and file does not exist. Cannot restore!`);
      }
    }
  }

  public clear() {
    this.backups.clear();
  }

  public rollbackAll(filePaths: string[]) {
    filePaths.forEach((path) => this.rollback(path));
  }
}
