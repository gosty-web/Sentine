import fs from 'fs';
import path from 'path';
import { Validator, ValidationResult, ValidationError } from '../ValidationPipeline.js';

export class PlaceholderValidator implements Validator {
  private files: string[];

  constructor(files: string[]) {
    this.files = files;
  }

  async validate(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const placeholders = ['TODO', 'FIXME', '...', 'PLACEHOLDER'];

    for (const file of this.files) {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, 'utf-8');

      for (const placeholder of placeholders) {
        if (content.includes(placeholder)) {
          errors.push({
            type: 'Placeholder',
            message: `Found placeholder "${placeholder}" in ${file}`,
            location: file,
            suggestedFix: 'Replace placeholder with actual implementation.'
          });
        }
      }
    }

    return {
      success: errors.length === 0,
      errors
    };
  }
}
