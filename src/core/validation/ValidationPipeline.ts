export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: string;
  message: string;
  location?: string;
  suggestedFix?: string;
}

export interface Validator {
  validate(): Promise<ValidationResult>;
}

export class ValidationPipeline {
  private validators: Validator[] = [];

  public addValidator(validator: Validator) {
    this.validators.push(validator);
  }

  public async run(): Promise<ValidationResult> {
    const allErrors: ValidationError[] = [];
    for (const validator of this.validators) {
      const result = await validator.validate();
      if (!result.success) {
        allErrors.push(...result.errors);
      }
    }

    return {
      success: allErrors.length === 0,
      errors: allErrors
    };
  }
}
