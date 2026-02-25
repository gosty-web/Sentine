export type HookCallback = (data: any) => Promise<void>;

export enum HookType {
  ON_PLAN = 'onPlan',
  ON_BEFORE_EXECUTION = 'onBeforeExecution',
  ON_AFTER_EXECUTION = 'onAfterExecution',
  ON_VALIDATION = 'onValidation'
}

export class HookManager {
  private hooks: Map<HookType, HookCallback[]> = new Map();

  constructor() {
    Object.values(HookType).forEach(type => this.hooks.set(type, []));
  }

  public register(type: HookType, callback: HookCallback) {
    this.hooks.get(type)?.push(callback);
  }

  public async trigger(type: HookType, data: any) {
    const callbacks = this.hooks.get(type) || [];
    for (const callback of callbacks) {
      await callback(data);
    }
  }
}
