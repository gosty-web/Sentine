export interface Policy {
  name: string;
  validate(content: string): { valid: boolean; reason?: string };
}

export class PolicyEngine {
  private policies: Policy[] = [];

  public addPolicy(policy: Policy) {
    this.policies.push(policy);
  }

  public validate(content: string): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    for (const policy of this.policies) {
      const result = policy.validate(content);
      if (!result.valid) {
        violations.push(`${policy.name}: ${result.reason}`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}

export class NoPlaceholderPolicy implements Policy {
  name = 'NoPlaceholder';
  validate(content: string) {
    const placeholders = ['TODO', 'FIXME', '...', 'PLACEHOLDER'];
    for (const p of placeholders) {
      if (content.includes(p)) {
        return { valid: false, reason: `Found prohibited placeholder: ${p}` };
      }
    }
    return { valid: true };
  }
}
