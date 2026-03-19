#!/usr/bin/env node

/**
 * OpenClawSquad CLI - Multi-agent orchestration framework
 * Better than opensquad with IDE integrations and more!
 */

import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic imports to avoid loading everything at startup
async function loadCommand(command) {
  switch (command) {
    case 'init':
      return import('../src/init.js');
    case 'update':
      return import('../src/update.js');
    case 'skills':
    case 'install':
    case 'uninstall':
      return import('../src/skills-cli.js');
    case 'agents':
      return import('../src/agents-cli.js');
    case 'runs':
      return import('../src/runs.js');
    case 'create':
      return import('../src/squad-creator.js');
    case 'run':
      return import('../src/pipeline-runner.js');
    case 'dashboard':
      return import('../src/dashboard-server.js');
    default:
      return null;
  }
}

const { positionals, values } = parseArgs({
  allowPositionals: true,
  strict: false,
  options: {
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
    skipPrompts: { type: 'boolean', short: 'y' },
  }
});

const command = positionals[0];

// Show version
if (values.version) {
  const pkg = await import('../package.json', { with: { type: 'json' } });
  console.log(`openclawsquad v${pkg.default.version}`);
  process.exit(0);
}

// Show help
if (values.help || !command) {
  console.log(`
  🤖 OpenClawSquad — Multi-agent orchestration framework

  🚀 Better than opensquad with IDE integrations, WebSocket dashboard, and more!

  Usage:
    npx openclawsquad init                    Initialize OpenClawSquad in current folder
    npx openclawsquad create <name>           Create a new squad interactively
    npx openclawsquad run <squad>             Run a squad pipeline
    npx openclawsquad update                  Update OpenClawSquad core
    npx openclawsquad install <skill>         Install a skill
    npx openclawsquad uninstall <skill>       Remove a skill
    npx openclawsquad update <skill>          Update a specific skill
    npx openclawsquad skills                   List installed skills
    npx openclawsquad agents                   List available agents
    npx openclawsquad agents install <name>   Install a predefined agent
    npx openclawsquad agents remove <name>    Remove an agent
    npx openclawsquad agents update           Update all agents
    npx openclawsquad runs [squad-name]        View execution history
    npx openclawsquad dashboard                Start the real-time dashboard
    npx openclawsquad --version                Show version
    npx openclawsquad --help                   Show this help

  Quick Start:
    mkdir my-squad && cd my-squad
    npx openclawsquad init
    npx openclawsquad create my-team
    npx openclawsquad run my-team

  Learn more: https://github.com/jackchakkal/OpenClawSquad
  `);
  process.exit(command ? 1 : 0);
}

// Execute command
if (command === 'init') {
  const { init } = await import('../src/init.js');
  await init(process.cwd(), {
    _skipPrompts: values.skipPrompts,
    _language: values.language,
    _ides: values.ides?.split(',')
  });
} else if (command === 'install') {
  const { skillsCli } = await import('../src/skills-cli.js');
  const result = await skillsCli('install', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'uninstall') {
  const { skillsCli } = await import('../src/skills-cli.js');
  const result = await skillsCli('remove', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'update') {
  const target = positionals[1];
  if (target) {
    const { skillsCli } = await import('../src/skills-cli.js');
    const result = await skillsCli('update-one', [target], process.cwd());
    if (!result.success) process.exitCode = 1;
  } else {
    const { update } = await import('../src/update.js');
    const result = await update(process.cwd());
    if (!result.success) process.exitCode = 1;
  }
} else if (command === 'skills') {
  const { skillsCli } = await import('../src/skills-cli.js');
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await skillsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'agents') {
  const { agentsCli } = await import('../src/agents-cli.js');
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await agentsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'runs') {
  const { listRuns, printRuns } = await import('../src/runs.js');
  const squadName = positionals[1] || null;
  const runs = await listRuns(squadName, process.cwd());
  printRuns(runs);
} else if (command === 'create') {
  const { createSquad } = await import('../src/squad-creator.js');
  const squadName = positionals[1];
  await createSquad(squadName, process.cwd(), { _skipPrompts: values.skipPrompts });
} else if (command === 'run') {
  const { runPipeline } = await import('../src/pipeline-runner.js');
  const squadName = positionals[1];
  await runPipeline(squadName, process.cwd());
} else if (command === 'dashboard') {
  const { startDashboard } = await import('../src/dashboard-server.js');
  await startDashboard(process.cwd());
} else {
  console.log(`Unknown command: ${command}`);
  console.log('Run --help for usage information');
  process.exit(1);
}
