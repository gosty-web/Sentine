export interface AdapterResponse {
  content: string;
  raw?: any;
}

export abstract class AgentAdapter {
  protected abstract name: string;

  abstract initialize(): Promise<void>;
  abstract sendPrompt(prompt: string): Promise<AdapterResponse>;
  abstract streamResponse(prompt: string, callback: (chunk: string) => void): Promise<void>;
  abstract healthCheck(): Promise<boolean>;
  abstract interrupt(): Promise<void>;
  abstract resume(): Promise<void>;

  getName(): string {
    return this.name;
  }
}
