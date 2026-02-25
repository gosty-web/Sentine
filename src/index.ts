#!/usr/bin/env node
import { Router } from './cli/router.js';
import { InitCommand } from './cli/commands/InitCommand.js';
import { RunCommand } from './cli/commands/RunCommand.js';
import { PlanCommand } from './cli/commands/PlanCommand.js';
import { StatusCommand } from './cli/commands/StatusCommand.js';
import { ValidateCommand } from './cli/commands/ValidateCommand.js';
import { AuditCommand } from './cli/commands/AuditCommand.js';

async function main() {
  const router = new Router();

  router.registerCommand(new InitCommand());
  router.registerCommand(new RunCommand());
  router.registerCommand(new PlanCommand());
  router.registerCommand(new StatusCommand());
  router.registerCommand(new ValidateCommand());
  router.registerCommand(new AuditCommand());

  try {
    await router.run(process.argv);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
}

main();
