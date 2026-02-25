export enum ExecutionState {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  EXECUTING = 'EXECUTING',
  VALIDATING = 'VALIDATING',
  RETRYING = 'RETRYING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED'
}

export class StateMachine {
  private currentState: ExecutionState = ExecutionState.IDLE;
  private listeners: ((state: ExecutionState) => void)[] = [];

  public transitionTo(newState: ExecutionState) {
    console.log(`Transitioning: ${this.currentState} -> ${newState}`);
    this.currentState = newState;
    this.listeners.forEach(l => l(newState));
  }

  public getState(): ExecutionState {
    return this.currentState;
  }

  public onTransition(callback: (state: ExecutionState) => void) {
    this.listeners.push(callback);
  }
}
