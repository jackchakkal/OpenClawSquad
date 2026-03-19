/**
 * OpenClawSquad - Initializer
 * Sets up a new OpenClawSquad project with IDE integrations
 */

import { cp, mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createPrompt } from './prompt.js';
import { loadLocale, t } from './i18n.js';
import { listAvailable, installSkill } from './skills.js';
import { logEvent } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

const LANGUAGES = [
  { label: 'Português (Brasil)', value: 'pt-BR' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];

const IDES = [
  { label: 'Claude Code', value: 'claude-code', checked: true },
  { label: 'Codex (OpenAI)', value: 'codex' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'VS Code + Copilot', value: 'vscode-copilot' },
  { label: 'Windsurf', value: 'windsurf' },
  { label: ' Zed', value: 'zed' },
  { label: 'Jan', value: 'jan' },
];

export async function init(targetDir, options = {}) {
  // Check if already initialized
  let isReInit = false;
  try {
    await stat(join(targetDir, '_openclawsquad'));
    isReInit = true;
  } catch {
    // Not initialized yet
  }

  console.log(isReInit 
    ? '\n  🔄 OpenClawSquad — Re-configure\n' 
    : '\n  🦷 OpenClawSquad — Setup\n');
  
  console.log('  The open-source alternative to opensquad — now with MORE features!\n');

  // Guided installation
  let language = options._language || 'en';
  let ides = options._ides ?? ['claude-code'];
  let userName = '';

  if (!options._skipPrompts) {
    const prompt = createPrompt();

    try {
      // Language selection
      const langChoice = await prompt.choose('What language do you prefer for outputs?', LANGUAGES);
      language = langChoice.value;

      // Load locale
      await loadLocale(language);

      console.log(`\n  ${t('welcome')}\n`);
      console.log('  ✨ Features:');
      console.log('    • WebSocket real-time dashboard');
      console.log('    • IDE integrations (Claude Code, Codex, Cursor, Windsurf, Zed, Jan)');
      console.log('    • 27+ pre-built agents');
      console.log('    • Dynamic squad creation');
      console.log('    • Pipeline runner with handoffs\n');

      userName = (await prompt.ask(`  ${t('askName')}`)).trim();

      ides = await prompt.multiChoose(t('chooseIdes'), IDES);
    } finally {
      prompt.close();
    }
  } else {
    await loadLocale(language);
  }

  // Copy template files
  await copyCommonTemplates(targetDir);
  await copyIdeTemplates(ides, targetDir);
  await installAllSkills(targetDir);
  
  if (!options._skipPrompts) {
    await installDependencies(targetDir);
  }
  
  await writeProjectReadme(targetDir, language);

  // Write user preferences
  const prefsPath = join(targetDir, '_openclawsquad', '_memory', 'preferences.md');
  await mkdir(dirname(prefsPath), { recursive: true });
  const prefsContent = `# OpenClawSquad Preferences

- **User Name:** ${userName}
- **Output Language:** ${language}
- **IDEs:** ${ides.join(', ')}
- **Date Format:** YYYY-MM-DD
- **Version:** 1.0.0

## Features Enabled

${ides.includes('claude-code') ? '- ✅ Claude Code integration' : '- ❌ Claude Code integration'}
${ides.includes('codex') ? '- ✅ Codex integration' : '- ❌ Codex integration'}
${ides.includes('cursor') ? '- ✅ Cursor integration' : '- ❌ Cursor integration'}
${ides.includes('windsurf') ? '- ✅ Windsurf integration' : '- ❌ Windsurf integration'}
${ides.includes('zed') ? '- ✅ Zed integration' : '- ❌ Zed integration'}
${ides.includes('jan') ? '- ✅ Jan local AI integration' : '- ❌ Jan local AI integration'}
`;
  await writeFile(prefsPath, prefsContent, 'utf-8');

  await logEvent('init', { language, ides: ides.join(',') }, targetDir);

  console.log(`\n  ${t('success')}\n`);
  console.log('  🚀 Next steps:');
  
  for (const ide of ides) {
    if (ide === 'claude-code') {
      console.log('\n  📟 Claude Code:');
      console.log('    1. Run: claude');
      console.log('    2. The agent will automatically load OpenClawSquad');
      console.log('    3. Type: "create my-squad" to build a new team');
    } else if (ide === 'codex') {
      console.log('\n  📟 Codex:');
      console.log('    1. Run: codex');
      console.log('    2. The AGENTS.md will be loaded automatically');
    } else if (ide === 'cursor') {
      console.log('\n  📟 Cursor:');
      console.log('    1. Open this folder in Cursor');
      console.log('    2. The .cursor/rules will be loaded');
    } else if (ide === 'windsurf') {
      console.log('\n  📟 Windsurf:');
      console.log('    1. Open this folder in Windsurf');
      console.log('    2. Rules will be loaded automatically');
    } else if (ide === 'zed') {
      console.log('\n  📟 Zed:');
      console.log('    1. Open this folder in Zed');
      console.log('    2. OpenClawSquad config will be loaded');
    } else if (ide === 'jan') {
      console.log('\n  📟 Jan (Local AI):');
      console.log('    1. Open Jan app');
      console.log('    2. Connect to this workspace');
    }
  }
  
  console.log('\n  📊 Dashboard:');
  console.log('    npx openclawsquad dashboard');
  console.log('    (Real-time squad visualization)\n');
}

export async function loadSavedLocale(targetDir) {
  try {
    const prefsPath = join(targetDir, '_openclawsquad', '_memory', 'preferences.md');
    const content = await readFile(prefsPath, 'utf-8');
    const match = content.match(/\*\*Output Language:\*\*\s*(.+)/);
    if (match) {
      await loadLocale(match[1].trim());
      return;
    }
  } catch {
    // No preferences
  }
  await loadLocale('en');
}

async function installAllSkills(targetDir) {
  const available = await listAvailable();
  console.log(`\n  📦 Installing ${available.length} skills...`);
  for (const id of available) {
    await installSkill(id, targetDir);
    console.log(`  ✓ ${id}`);
  }
}

async function installDependencies(targetDir) {
  console.log('\n  📚 Installing dependencies...');
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    console.log('  ✓ npm dependencies installed');
  } catch (e) {
    console.log('  ⚠️  npm install failed (may need manual install)');
  }
  
  // Install dashboard dependencies
  const dashboardDir = join(targetDir, 'dashboard');
  try {
    await stat(dashboardDir);
    console.log('  📊 Installing dashboard dependencies...');
    execSync('npm install', { cwd: dashboardDir, stdio: 'inherit' });
    console.log('  ✓ dashboard dependencies installed');
  } catch {
    // No dashboard
  }
  
  // Install Playwright
  console.log('  🌐 Installing Playwright browsers...');
  try {
    execSync('npx playwright install chromium', { cwd: targetDir, stdio: 'inherit' });
    console.log('  ✓ Playwright installed');
  } catch (e) {
    console.log('  ⚠️  Playwright install failed (optional)');
  }
}

async function writeProjectReadme(targetDir, language) {
  const readmeContent = `# OpenClawSquad Project

Welcome to your OpenClawSquad workspace!

## Quick Start

\`\`\`bash
# Create a new squad
npx openclawsquad create my-team

# Run a squad
npx openclawsquad run my-team

# Start dashboard
npx openclawsquad dashboard
\`\`\`

## Available Agents

- Coordinator - Orchestrates squad workflows
- Researcher - Search and gather information
- Writer - Create content
- Copywriter - Marketing copy
- Reviewer - Quality assurance
- And 20+ more!

## IDE Integrations

This project is configured for: Claude Code, Codex, Cursor, Windsurf, Zed, and Jan.

## Documentation

See docs/ for full documentation.

---
Generated by OpenClawSquad
`;

  await writeFile(join(targetDir, 'README.md'), readmeContent, 'utf-8');
}

async function copyCommonTemplates(targetDir) {
  const entries = await getTemplateEntries(TEMPLATES_DIR);

  for (const entry of entries) {
    // Skip IDE templates - handled separately
    if (entry.replace(/\\/g, '/').includes('/ide-templates/')) continue;
    if (entry.replace(/\\/g, '/').includes('/dashboard/')) continue;

    const relativePath = entry.slice(TEMPLATES_DIR.length + 1);
    const destPath = join(targetDir, relativePath);
    const destDir = dirname(destPath);
    await mkdir(destDir, { recursive: true });
    
    try {
      await stat(destPath);
      continue; // file exists
    } catch {
      // doesn't exist - copy it
    }
    
    await cp(entry, destPath);
    console.log(`  ${t('createdFile', { path: relativePath })}`);
  }
}

async function copyIdeTemplates(ides, targetDir) {
  const ideTemplatesDir = join(TEMPLATES_DIR, 'ide-templates');
  const writtenPaths = new Set();

  for (const ide of ides) {
    const ideSrcDir = join(ideTemplatesDir, ide);
    let entries;
    try {
      entries = await getTemplateEntries(ideSrcDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const relativePath = entry.slice(ideSrcDir.length + 1);
      if (writtenPaths.has(relativePath)) continue;
      writtenPaths.add(relativePath);

      const destPath = join(targetDir, relativePath);
      const destDir = dirname(destPath);
      await mkdir(destDir, { recursive: true });
      await cp(entry, destPath);
      console.log(`  ${t('createdFile', { path: relativePath })}`);
    }
  }
}

export async function getTemplateEntries(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await getTemplateEntries(fullPath));
      } else {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results;
}
