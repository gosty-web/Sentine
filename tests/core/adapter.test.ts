import { describe, it, expect, vi } from 'vitest';
import { AdapterRegistry } from '../../src/core/adapter/AdapterRegistry.js';
import { GeminiAdapter } from '../../src/core/adapter/GeminiAdapter.js';

// Mock the Google AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => 'Mocked Response'
            }
          })
        })
      };
    })
  };
});

describe('AdapterRegistry', () => {
  it('should register and retrieve adapters', () => {
    const registry = new AdapterRegistry();
    const mockAdapter = {
        getName: () => 'Test',
        initialize: async () => {},
        sendPrompt: async () => ({ content: '' }),
        streamResponse: async () => {},
        healthCheck: async () => true,
        interrupt: async () => {},
        resume: async () => {}
    } as any;

    registry.register(mockAdapter);
    expect(registry.getAdapter('Test')).toBe(mockAdapter);
    expect(registry.listAdapters()).toContain('test');
  });

  it('should throw error if adapter not found', () => {
    const registry = new AdapterRegistry();
    expect(() => registry.getAdapter('None')).toThrow();
  });
});

describe('GeminiAdapter', () => {
  it('should initialize and send prompt', async () => {
    const adapter = new GeminiAdapter('fake-key');
    await adapter.initialize();
    const response = await adapter.sendPrompt('Hello');
    expect(response.content).toBe('Mocked Response');
  });
});
