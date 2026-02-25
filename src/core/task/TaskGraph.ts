export interface Task {
  id: string;
  description: string;
  dependencies: string[];
  affectedFiles: string[];
  validationRules: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export class TaskGraph {
  private tasks: Map<string, Task> = new Map();

  public addTask(task: Task) {
    if (this.tasks.has(task.id)) {
      throw new Error(`Task with id ${task.id} already exists`);
    }
    this.tasks.set(task.id, task);
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public getReadyTasks(): Task[] {
    return this.getAllTasks().filter(task =>
      task.status === 'pending' &&
      task.dependencies.every(depId => this.tasks.get(depId)?.status === 'completed')
    );
  }

  public updateTaskStatus(id: string, status: Task['status']) {
    const task = this.tasks.get(id);
    if (task) {
      task.status = status;
    }
  }

  public hasCycles(): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const check = (id: string): boolean => {
      visited.add(id);
      recStack.add(id);

      const task = this.tasks.get(id);
      if (task) {
        for (const depId of task.dependencies) {
          if (!visited.has(depId) && check(depId)) return true;
          if (recStack.has(depId)) return true;
        }
      }

      recStack.delete(id);
      return false;
    };

    for (const id of this.tasks.keys()) {
      if (!visited.has(id) && check(id)) return true;
    }

    return false;
  }

  public serialize(): string {
    return JSON.stringify(this.getAllTasks(), null, 2);
  }

  public static deserialize(json: string): TaskGraph {
    const tasks: Task[] = JSON.parse(json);
    const graph = new TaskGraph();
    tasks.forEach((t) => graph.addTask(t));
    return graph;
  }
}
