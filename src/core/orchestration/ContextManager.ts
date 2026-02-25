import { SubAgentRole } from './SubAgentManager.js';

export class ContextManager {
  private roleContexts: Map<SubAgentRole, string> = new Map();

  public setContext(role: SubAgentRole, context: string) {
    this.roleContexts.set(role, context);
  }

  public getContext(role: SubAgentRole): string {
    return this.roleContexts.get(role) || 'Standard Sentinel context.';
  }

  public getIsolatedPrompt(role: SubAgentRole, basePrompt: string): string {
    const context = this.getContext(role);
    return `
=== ISOLATED CONTEXT: ${role} ===
${context}

=== TASK ===
${basePrompt}
    `.trim();
  }
}
