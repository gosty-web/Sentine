import { describe, it, expect, vi } from 'vitest';
import { MessageBus } from '../../src/core/orchestration/MessageBus.js';
import { SubAgentManager, SubAgentRole } from '../../src/core/orchestration/SubAgentManager.js';

describe('SubAgentOrchestration', () => {
  it('should route messages between agents via the bus', async () => {
    const bus = new MessageBus();
    const manager = new SubAgentManager(bus);

    const mockAdapter = {
      sendPrompt: vi.fn().mockResolvedValue({ content: 'Acknowledged' })
    } as any;

    manager.registerAgent(SubAgentRole.PLANNER, mockAdapter);
    manager.registerAgent(SubAgentRole.EXECUTOR, mockAdapter);

    const publishSpy = vi.spyOn(bus, 'publish');

    await manager.routeMessage({
      from: SubAgentRole.PLANNER,
      to: SubAgentRole.EXECUTOR,
      content: 'Plan ready',
      timestamp: Date.now()
    });

    expect(mockAdapter.sendPrompt).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });
});
