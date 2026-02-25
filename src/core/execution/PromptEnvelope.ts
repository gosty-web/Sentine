import { Task } from '../task/TaskGraph.js';

export class PromptEnvelope {
  public static wrap(task: Task, context: { memory?: string, architecture?: string, policies?: string[] }): string {
    return `
=== SYSTEM POLICY RULES ===
${context.policies?.join('\n') || 'None'}

=== ARCHITECTURE SNAPSHOT ===
${context.architecture || 'Not provided'}

=== MEMORY SNAPSHOT ===
${context.memory || 'No relevant memory'}

=== TASK DEFINITION ===
ID: ${task.id}
Description: ${task.description}
Affected Files: ${task.affectedFiles.join(', ')}
Validation Rules: ${task.validationRules.join(', ')}

=== EXECUTION CONSTRAINTS ===
- NO placeholder logic
- NO TODO comments
- NO skipping tests
- NEVER produce raw user input; always follow structured envelope
- All code must compile and pass validation
- Output MUST be a valid JSON array of objects with "path" and "content" keys.
  Example: [{"path": "src/file.ts", "content": "..."}]

=== USER INPUT ===
Please implement the task defined above.
    `.trim();
  }
}
