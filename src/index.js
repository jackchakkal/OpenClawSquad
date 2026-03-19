#!/usr/bin/env node

/**
 * OpenClawSquad - Main Entry Point (npm start)
 * Launches the interactive setup wizard on first run,
 * or resumes in the previously configured mode.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env early
try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch {
  // dotenv not installed or no .env file
}

const targetDir = process.cwd();

// Check if setup was already completed
const { isSetupComplete, loadSetupConfig, startSetup } = await import('./setup.js');

if (!isSetupComplete(targetDir)) {
  // First run — launch the setup wizard
  await startSetup(targetDir);
} else {
  // Already set up — check saved mode preference
  const config = loadSetupConfig(targetDir);

  if (config && config.mode === 'dashboard') {
    console.log('\n  Resuming in Dashboard mode...\n');
    console.log('  (Run "openclawsquad start" to reconfigure)\n');
    const { startDashboard } = await import('./dashboard-server.js');
    await startDashboard(targetDir);
  } else {
    // Terminal mode — show status and available commands
    const { listProviders } = await import('./providers/index.js');
    const providers = listProviders();
    const active = providers.filter(p => p.configured);

    console.log(`
╔══════════════════════════════════════════════════════════╗
║       OpenClawSquad - Multi-Agent Orchestration          ║
╚══════════════════════════════════════════════════════════╝

  Status: Ready
  Mode: Terminal
  Providers: ${active.length > 0 ? active.map(p => p.label).join(', ') : 'None configured'}
  IDEs: ${config?.ides?.join(', ') || 'None'}

  Commands:
    openclawsquad create <name>    Create a new squad
    openclawsquad run <squad>      Execute a squad pipeline
    openclawsquad dashboard        Open visual dashboard
    openclawsquad start            Re-run setup wizard
    openclawsquad config           View configuration
    openclawsquad agents           List available agents
    `);
  }
}
