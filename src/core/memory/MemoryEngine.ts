import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SCHEMA } from './Schema.js';

export class MemoryEngine {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const finalPath = dbPath || path.join(process.cwd(), '.sentinel', 'memory.db');
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(finalPath);
    this.initialize();
  }

  private initialize() {
    this.db.exec(SCHEMA);
  }

  public store(type: string, content: string, metadata: any = {}) {
    const stmt = this.db.prepare('INSERT INTO memory (type, content, metadata) VALUES (?, ?, ?)');
    stmt.run(type, content, JSON.stringify(metadata));
  }

  public query(type?: string): any[] {
    if (type) {
      const stmt = this.db.prepare('SELECT * FROM memory WHERE type = ? ORDER BY timestamp DESC');
      return stmt.all(type);
    }
    const stmt = this.db.prepare('SELECT * FROM memory ORDER BY timestamp DESC');
    return stmt.all();
  }

  public storeTask(task: any) {
    const stmt = this.db.prepare('INSERT OR REPLACE INTO tasks (id, description, status, affected_files) VALUES (?, ?, ?, ?)');
    stmt.run(task.id, task.description, task.status, JSON.stringify(task.affectedFiles));
  }

  public close() {
    this.db.close();
  }
}
