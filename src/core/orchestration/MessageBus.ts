export interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export type MessageHandler = (message: Message) => void;

export class MessageBus {
  private handlers: MessageHandler[] = [];

  public subscribe(handler: MessageHandler) {
    this.handlers.push(handler);
  }

  public publish(message: Message) {
    console.log(`[MessageBus] ${message.from} -> ${message.to}: ${message.content.substring(0, 50)}...`);
    this.handlers.forEach(h => h(message));
  }
}
