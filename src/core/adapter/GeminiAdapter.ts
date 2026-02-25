import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentAdapter, AdapterResponse } from './AgentAdapter.js';

export class GeminiAdapter extends AgentAdapter {
  protected name = 'Gemini';
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async initialize(): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async sendPrompt(prompt: string): Promise<AdapterResponse> {
    if (!this.model) await this.initialize();

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      raw: response
    };
  }

  async streamResponse(prompt: string, callback: (chunk: string) => void): Promise<void> {
    if (!this.model) await this.initialize();

    const result = await this.model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      callback(chunkText);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.model) await this.initialize();
      // Simple probe
      await this.model.generateContent('ping');
      return true;
    } catch (e) {
      return false;
    }
  }

  async interrupt(): Promise<void> {
    // No-op for current Gemini SDK implementation
  }

  async resume(): Promise<void> {
    // No-op for current Gemini SDK implementation
  }
}
