import fs from 'fs';
import path from 'path';
import { BaseCommand } from '../BaseCommand.js';
import { DecompositionEngine } from '../../core/task/DecompositionEngine.js';
import { ArtifactGenerator } from '../../core/task/ArtifactGenerator.js';
import { GeminiAdapter } from '../../core/adapter/GeminiAdapter.js';

export class PlanCommand extends BaseCommand {
  getName(): string {
    return 'plan';
  }

  getDescription(): string {
    return 'Generate planning artifacts for a given prompt';
  }

  getOptions() {
    return [
      { flags: '-p, --prompt <text>', description: 'Initial prompt for planning' }
    ];
  }

  async execute(options: any): Promise<void> {
    if (!options.prompt) {
      console.error('Error: --prompt is required');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || 'fake-key';
    const adapter = new GeminiAdapter(apiKey);

    console.log('Generating planning artifacts...');
    const generator = new ArtifactGenerator(adapter);
    await generator.generateArtifacts(options.prompt);

    console.log('Decomposing tasks...');
    const engine = new DecompositionEngine(adapter);
    const graph = await engine.decompose(options.prompt);

    const dotSentinelDir = path.join(process.cwd(), '.sentinel');
    if (!fs.existsSync(dotSentinelDir)) {
      fs.mkdirSync(dotSentinelDir, { recursive: true });
    }

    const graphPath = path.join(dotSentinelDir, 'task_graph.json');
    fs.writeFileSync(graphPath, graph.serialize());

    console.log('Task Graph generated and saved successfully:');
    console.log(graph.serialize());
  }
}
