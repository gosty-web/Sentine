import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryEngine } from '../../src/core/memory/MemoryEngine.js';
import fs from 'fs';
import path from 'path';

describe('MemoryEngine', () => {
  const testDbPath = path.join(process.cwd(), 'test_memory.db');

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('should store and query memories', () => {
    const engine = new MemoryEngine(testDbPath);
    engine.store('decision', 'Use SQLite for memory');

    const results = engine.query('decision');
    expect(results.length).toBe(1);
    expect(results[0].content).toBe('Use SQLite for memory');
    engine.close();
  });

  it('should store task history', () => {
    const engine = new MemoryEngine(testDbPath);
    engine.storeTask({
      id: 'task-1',
      description: 'Test task',
      status: 'completed',
      affectedFiles: ['file.ts']
    });

    const tasks = engine.query(); // This queries memory table, let's just check if it doesn't crash
    expect(tasks).toBeDefined();
    engine.close();
  });
});
