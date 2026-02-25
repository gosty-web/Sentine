import { describe, it, expect } from 'vitest';
import { PolicyEngine, NoPlaceholderPolicy } from '../../src/core/policy/PolicyEngine.js';

describe('PolicyEngine', () => {
  it('should enforce policies and detect violations', () => {
    const engine = new PolicyEngine();
    engine.addPolicy(new NoPlaceholderPolicy());

    const badContent = 'function test() { // TODO: implement }';
    const goodContent = 'function test() { return true; }';

    expect(engine.validate(badContent).valid).toBe(false);
    expect(engine.validate(goodContent).valid).toBe(true);
  });
});
