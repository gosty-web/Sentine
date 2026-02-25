import { exec } from 'child_process';
import { promisify } from 'util';
import { Validator, ValidationResult } from '../ValidationPipeline.js';

const execAsync = promisify(exec);

export class TypeScriptValidator implements Validator {
  async validate(): Promise<ValidationResult> {
    try {
      await execAsync('npx tsc --noEmit');
      return { success: true, errors: [] };
    } catch (e: any) {
      return {
        success: false,
        errors: [{
          type: 'TypeScript',
          message: e.stdout || e.message
        }]
      };
    }
  }
}
