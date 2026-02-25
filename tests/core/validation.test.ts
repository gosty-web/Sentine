import { describe, it, expect, vi } from 'vitest';
import { ValidationPipeline } from '../../src/core/validation/ValidationPipeline.js';
import { PlaceholderValidator } from '../../src/core/validation/validators/PlaceholderValidator.js';
import fs from 'fs';

describe('ValidationPipeline', () => {
  it('should run multiple validators and collect errors', async () => {
    const pipeline = new ValidationPipeline();

    const mockValidator1 = {
      validate: async () => ({ success: true, errors: [] })
    };
    const mockValidator2 = {
      validate: async () => ({
        success: false,
        errors: [{ type: 'Test', message: 'Err' }]
      })
    };

    pipeline.addValidator(mockValidator1);
    pipeline.addValidator(mockValidator2);

    const result = await pipeline.run();
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
  });
});

describe('PlaceholderValidator', () => {
  it('should detect placeholders in files', async () => {
    const filePath = 'test_placeholder.txt';
    fs.writeFileSync(filePath, 'Some content with TODO');

    const validator = new PlaceholderValidator([filePath]);
    const result = await validator.validate();

    expect(result.success).toBe(false);
    expect(result.errors[0].message).toContain('TODO');

    fs.unlinkSync(filePath);
  });
});
