import fs from 'fs';
import path from 'path';
import { AgentAdapter } from '../adapter/AgentAdapter.js';

export class ArtifactGenerator {
  private adapter: AgentAdapter;

  constructor(adapter: AgentAdapter) {
    this.adapter = adapter;
  }

  async generateArtifacts(prompt: string): Promise<void> {
    const artifacts = [
      { name: 'PRD.md', purpose: 'Product Requirements Document' },
      { name: 'ARCHITECTURE.md', purpose: 'Technical Architecture' },
      { name: 'TECH_SPEC.md', purpose: 'Technical Specification' },
      { name: 'PROJECT_OVERVIEW.md', purpose: 'High-level Project Overview' }
    ];

    for (const artifact of artifacts) {
      console.log(`Generating ${artifact.name}...`);
      const systemPrompt = `You are a technical architect. Generate a ${artifact.purpose} (${artifact.name}) based on the user request. Output ONLY markdown content.`;
      const response = await this.adapter.sendPrompt(`${systemPrompt}\n\nUser Request: ${prompt}`);

      fs.writeFileSync(path.join(process.cwd(), artifact.name), response.content);
    }
  }
}
