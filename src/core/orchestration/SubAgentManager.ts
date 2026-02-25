import { AgentAdapter } from '../adapter/AgentAdapter.js';
import { MessageBus, Message } from './MessageBus.js';

export enum SubAgentRole {
  PLANNER = 'Planner',
  EXECUTOR = 'Executor',
  REVIEWER = 'Reviewer',
  SECURITY = 'Security'
}

export class SubAgent {
  constructor(
    public role: SubAgentRole,
    private adapter: AgentAdapter,
    private messageBus: MessageBus
  ) {}

  async process(content: string, from: string) {
    const response = await this.adapter.sendPrompt(`Role: ${this.role}\nInput: ${content}`);
    this.messageBus.publish({
      from: this.role,
      to: from,
      content: response.content,
      timestamp: Date.now()
    });
  }
}

export class SubAgentManager {
  private agents: Map<SubAgentRole, SubAgent> = new Map();
  private messageBus: MessageBus;

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;
  }

  public registerAgent(role: SubAgentRole, adapter: AgentAdapter) {
    const agent = new SubAgent(role, adapter, this.messageBus);
    this.agents.set(role, agent);
  }

  public async routeMessage(message: Message) {
    const targetAgent = this.agents.get(message.to as SubAgentRole);
    if (targetAgent) {
      await targetAgent.process(message.content, message.from);
    } else {
      console.warn(`No agent registered for role: ${message.to}`);
    }
  }
}
