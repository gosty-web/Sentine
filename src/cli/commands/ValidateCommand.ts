import { BaseCommand } from '../BaseCommand.js';
import { ValidationPipeline } from '../../core/validation/ValidationPipeline.js';
import { TypeScriptValidator } from '../../core/validation/validators/TypeScriptValidator.js';
import { LintValidator } from '../../core/validation/validators/LintValidator.js';

export class ValidateCommand extends BaseCommand {
  getName(): string {
    return 'validate';
  }

  getDescription(): string {
    return 'Run the validation pipeline on the current codebase';
  }

  async execute(): Promise<void> {
    console.log('Running validation pipeline...');
    const pipeline = new ValidationPipeline();
    pipeline.addValidator(new TypeScriptValidator());
    pipeline.addValidator(new LintValidator());

    const result = await pipeline.run();
    if (result.success) {
      console.log('✅ All validations passed!');
    } else {
      console.log('❌ Validation failed:');
      result.errors.forEach(err => {
        console.log(`[${err.type}] ${err.message}`);
      });
      process.exit(1);
    }
  }
}
