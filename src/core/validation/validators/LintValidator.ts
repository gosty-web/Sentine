import { exec } from 'child_process';
import { promisify } from 'util';
import { Validator, ValidationResult } from '../ValidationPipeline.js';

const execAsync = promisify(exec);

export class LintValidator implements Validator {
  async validate(): Promise<ValidationResult> {
    try {
      await execAsync('npx eslint src/**/*.ts');
      return { success: true, errors: [] };
    } catch (e: any) {
      return {
        success: false,
        errors: [{
          type: 'Lint',
          message: e.stdout || e.message
        }]
      };
    }
  }
}
