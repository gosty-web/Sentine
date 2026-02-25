import { describe, it, expect, vi } from 'vitest';
import { TaskGraph } from '../../src/core/task/TaskGraph.js';
import { DecompositionEngine } from '../../src/core/task/DecompositionEngine.js';

describe('TaskGraph', () => {
  it('should manage tasks and dependencies', () => {
    const graph = new TaskGraph();
    graph.addTask({
      id: '1',
      description: 'Task 1',
      dependencies: [],
      affectedFiles: [],
      validationRules: [],
      status: 'pending'
    });
    graph.addTask({
      id: '2',
      description: 'Task 2',
      dependencies: ['1'],
      affectedFiles: [],
      validationRules: [],
      status: 'pending'
    });

    expect(graph.getReadyTasks().length).toBe(1);
    expect(graph.getReadyTasks()[0].id).toBe('1');

    graph.updateTaskStatus('1', 'completed');
    expect(graph.getReadyTasks().length).toBe(1);
    expect(graph.getReadyTasks()[0].id).toBe('2');
  });

  it('should detect cycles', () => {
    const graph = new TaskGraph();
    graph.addTask({ id: '1', description: 'T1', dependencies: ['2'], affectedFiles: [], validationRules: [], status: 'pending' });
    graph.addTask({ id: '2', description: 'T2', dependencies: ['1'], affectedFiles: [], validationRules: [], status: 'pending' });
    expect(graph.hasCycles()).toBe(true);
  });
});

describe('DecompositionEngine', () => {
  it('should parse tasks from adapter response', async () => {
    const mockAdapter = {
      sendPrompt: vi.fn().mockResolvedValue({
        content: JSON.stringify([
          { id: 'task-1', description: 'desc', dependencies: [], affectedFiles: [], validationRules: [] }
        ])
      })
    } as any;

    const engine = new DecompositionEngine(mockAdapter);
    const graph = await engine.decompose('do something');
    expect(graph.getAllTasks().length).toBe(1);
    expect(graph.getTask('task-1')).toBeDefined();
  });
});
