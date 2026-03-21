/**
 * OpenClawSquad - Interactive Setup Wizard
 * First-run experience: mode selection, API key configuration, IDE association
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createPrompt } from './prompt.js';
import { loadLocale, t } from './i18n.js';
import { listProviders } from './providers/index.js';
import { saveGlobalKey, keysFilePath } from './keys.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BANNER = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║       OpenClawSquad - Multi-Agent Orchestration          ║
║                                                          ║
║   The open-source alternative to opensquad               ║
║   27+ agents | IDE integrations | Real-time dashboard    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`;

const MODE_CHOICES = [
  {
    label: 'Terminal (CLI)',
    value: 'terminal',
    description: 'Continue setup and use OpenClawSquad directly in the terminal'
  },
  {
    label: 'Dashboard (Browser)',
    value: 'dashboard',
    description: 'Open the real-time dashboard in your browser for visual control'
  }
];

const PROVIDER_CHOICES = [
  {
    label: 'Anthropic (Claude)',
    value: 'anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    hint: 'Recommended - https://console.anthropic.com/'
  },
  {
    label: 'OpenAI (GPT)',
    value: 'openai',
    envVar: 'OPENAI_API_KEY',
    hint: 'https://platform.openai.com/'
  },
  {
    label: 'Minimax (M2.7)',
    value: 'minimax',
    envVar: 'MINIMAX_API_KEY',
    hint: 'https://platform.minimax.io/'
  },
  {
    label: 'Skip (configure later)',
    value: 'skip',
    envVar: null,
    hint: 'Run "openclawsquad start" again to configure later'
  }
];

const IDE_CHOICES = [
  { label: 'Cursor', value: 'cursor', checked: true },
  { label: 'OpenClaw', value: 'openclaw' },
  { label: 'Claude Code (CLI)', value: 'claude-code' },
  { label: 'Gemini CLI', value: 'gemini-cli' },
  { label: 'Codex (OpenAI)', value: 'codex' },
  { label: 'VS Code + Copilot', value: 'vscode-copilot' },
  { label: 'Windsurf', value: 'windsurf' },
  { label: 'Zed', value: 'zed' },
  { label: 'Jan', value: 'jan' },
];

/**
 * Run the interactive setup wizard
 */
export async function startSetup(targetDir) {
  console.log(BANNER);

  const prompt = createPrompt();

  try {
    // ── Step 1: Mode Selection ──────────────────────────────────
    console.log('  Step 1/3 — Choose your interface\n');

    const modeChoice = await prompt.choose(
      'How would you like to use OpenClawSquad?',
      MODE_CHOICES
    );
    const mode = modeChoice.value;

    console.log(`\n  Selected: ${modeChoice.label}\n`);

    // ── Step 2: API Key Configuration ───────────────────────────
    console.log('  Step 2/3 — Configure your LLM provider\n');

    // Check for existing keys
    const existingProviders = listProviders().filter(p => p.configured);
    if (existingProviders.length > 0) {
      console.log('  Already configured providers:');
      for (const p of existingProviders) {
        console.log(`    [OK] ${p.label} (${p.envVar})`);
      }
      console.log('');

      const reconfigure = await prompt.confirm(
        'Do you want to add or change an API key?'
      );

      if (reconfigure) {
        await configureApiKey(prompt, targetDir);
      }
    } else {
      console.log('  No LLM API keys detected. You need at least one to run agents.\n');
      await configureApiKey(prompt, targetDir);
    }

    // ── Step 3: IDE Association ─────────────────────────────────
    console.log('\n  Step 3/3 — Associate with your IDE(s)\n');

    const selectedIdes = await prompt.multiChoose(
      'Which IDEs should OpenClawSquad integrate with?',
      IDE_CHOICES
    );

    if (selectedIdes.length === 0) {
      console.log('\n  No IDEs selected. You can configure them later with: openclawsquad init\n');
    } else {
      console.log(`\n  Selected IDEs: ${selectedIdes.join(', ')}\n`);
    }

    // ── Save Setup Config ───────────────────────────────────────
    const setupConfig = {
      mode,
      ides: selectedIdes,
      setupCompleted: true,
      setupDate: new Date().toISOString()
    };

    saveSetupConfig(targetDir, setupConfig);

    // ── Proceed Based on Mode ───────────────────────────────────
    if (mode === 'dashboard') {
      console.log('\n  Starting Dashboard...\n');
      const { startDashboard } = await import('./dashboard-server.js');
      await startDashboard(targetDir);
    } else {
      // Terminal mode - run init with the collected preferences
      console.log('\n  Initializing OpenClawSquad in terminal mode...\n');
      const { init } = await import('./init.js');
      await init(targetDir, {
        _skipPrompts: true,
        _ides: selectedIdes.length > 0 ? selectedIdes : ['cursor']
      });

      printTerminalWelcome(selectedIdes);
    }

  } finally {
    prompt.close();
  }
}

/**
 * Interactive API key configuration
 */
async function configureApiKey(prompt, targetDir) {
  const providerChoice = await prompt.choose(
    'Which LLM provider do you want to configure?',
    PROVIDER_CHOICES.map(p => ({
      label: p.hint ? `${p.label} — ${p.hint}` : p.label,
      value: p.value
    }))
  );

  if (providerChoice.value === 'skip') {
    console.log('\n  Skipped. Run "openclawsquad start" again to configure your API key.\n');
    return;
  }

  const provider = PROVIDER_CHOICES.find(p => p.value === providerChoice.value);

  const apiKey = await prompt.password(
    `Enter your ${provider.label} API key:`
  );

  if (!apiKey || apiKey.trim() === '') {
    console.log('\n  No key provided. Skipping.\n');
    return;
  }

  // Save to global config (~/.openclawsquad/keys.json)
  saveGlobalKey(provider.envVar, apiKey.trim());

  // Set in current process so it takes effect immediately
  process.env[provider.envVar] = apiKey.trim();

  console.log(`\n  [OK] ${provider.label} API key saved to ${keysFilePath()}`);
  console.log(`  Provider will be auto-detected on every run.\n`);

  // Ask if they want to add another
  const addMore = await prompt.confirm('Add another provider API key?');
  if (addMore) {
    await configureApiKey(prompt, targetDir);
  }
}

/**
 * Save setup configuration
 */
function saveSetupConfig(targetDir, config) {
  const configDir = join(targetDir, '_openclawsquad');
  mkdirSync(configDir, { recursive: true });

  const configPath = join(configDir, 'setup.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Check if setup has been completed before
 */
export function isSetupComplete(targetDir) {
  const configPath = join(targetDir, '_openclawsquad', 'setup.json');
  if (!existsSync(configPath)) return false;

  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.setupCompleted === true;
  } catch {
    return false;
  }
}

/**
 * Load saved setup configuration
 */
export function loadSetupConfig(targetDir) {
  const configPath = join(targetDir, '_openclawsquad', 'setup.json');
  if (!existsSync(configPath)) return null;

  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Print welcome message for terminal mode
 */
function printTerminalWelcome(ides) {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   OpenClawSquad is ready!                                ║
╚══════════════════════════════════════════════════════════╝

  Quick commands:

    openclawsquad create <name>    Create a new squad
    openclawsquad run <squad>      Execute a squad pipeline
    openclawsquad dashboard        Open the visual dashboard
    openclawsquad agents           List available agents
    openclawsquad config           View current configuration
  `);

  if (ides.includes('cursor')) {
    console.log('  Cursor: Open this folder in Cursor — rules loaded automatically');
  }
  if (ides.includes('openclaw')) {
    console.log('  OpenClaw: Start OpenClaw in this workspace — config loaded');
  }
  if (ides.includes('claude-code')) {
    console.log('  Claude Code: Run "claude" — skills loaded automatically');
  }
  if (ides.includes('gemini-cli')) {
    console.log('  Gemini CLI: Run "gemini" — context loaded from GEMINI.md');
  }
  if (ides.includes('codex')) {
    console.log('  Codex: Run "codex" — AGENTS.md loaded automatically');
  }
  if (ides.includes('vscode-copilot')) {
    console.log('  VS Code: Open in VS Code — Copilot rules loaded');
  }
  if (ides.includes('windsurf')) {
    console.log('  Windsurf: Open in Windsurf — rules loaded automatically');
  }
  if (ides.includes('zed')) {
    console.log('  Zed: Open in Zed — config loaded automatically');
  }
  if (ides.includes('jan')) {
    console.log('  Jan: Open Jan app and connect to this workspace');
  }

  console.log('');
}
