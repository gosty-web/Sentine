# Sentinel Kernel

Sentinel Kernel is a deterministic execution governance runtime for AI coding agents. It enforces structure, validation, memory, and strict execution control to ensure that AI agents produce high-quality, production-ready code without placeholders or incomplete logic.

## Features

- **Deterministic Execution Loop**: Strict state machine governing agent actions.
- **Task Decomposition Engine**: Automatically breaks down high-level requests into a dependency-aware Directed Acyclic Graph (DAG).
- **File Guardian System**: Real-time monitoring with automatic rollbacks for unauthorized file modifications.
- **Validation Pipeline**: Pluggable checks including TypeScript types, ESLint, and placeholder detection.
- **Persistent Memory Engine**: SQLite-backed storage for architecture decisions and audit logs.
- **Sub-Agent Orchestration**: Mediate communication between specialized virtual agents (Planner, Executor, Reviewer, etc.).
- **Plugin System**: Hook-based architecture for extending governance logic.
- **Brutal Policy Engine**: Rejects non-compliant agent output (e.g., code with "TODO" or incomplete exports).

## Installation

You can run Sentinel Kernel directly via `npx`:

```bash
npx sentinel-kernel@latest init
```

Or install it globally:

```bash
npm install -g sentinel-kernel
```

## CLI Commands

- `sentinel init`: Initialize a new Sentinel project in the current directory.
- `sentinel plan --prompt "your request"`: Generate planning artifacts and a task graph.
- `sentinel run`: Execute the task loop based on the generated plan.
- `sentinel status`: Show the current status of the task graph and project configuration.
- `sentinel validate`: Run the validation pipeline on the codebase.
- `sentinel audit`: View persistent audit logs from the memory engine.

### Slash Commands

Sentinel also supports slash-style commands for better integration with agent runtimes:

- `/Sentinel-help`
- `/Sentinel-run`
- `/Sentinel-plan`
- `/Sentinel-status`
- `/Sentinel-validate`
- `/Sentinel-audit`

## Project Configuration

Sentinel is configured via `sentinel.config.json` in your project root.

```json
{
  "version": "1.0.0",
  "executionMode": "strict",
  "subAgentEnabled": true,
  "subAgentCount": 3,
  "validationSettings": {
    "strict": true,
    "autoFix": false
  },
  "memorySettings": {
    "storage": "sqlite"
  }
}
```

## Development

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

### Testing

Run the full test suite with Vitest:

```bash
npm test
```

## License

MIT
