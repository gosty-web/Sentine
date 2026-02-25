export interface CommandOption {
  flags: string;
  description: string;
  defaultValue?: any;
}

export abstract class BaseCommand {
  abstract getName(): string;
  abstract getDescription(): string;
  abstract execute(options: any): Promise<void>;

  getOptions(): CommandOption[] {
    return [];
  }
}
