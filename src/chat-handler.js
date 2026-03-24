/**
 * Chat Handler - LLM-powered assistant for the OpenClawSquad Dashboard
 * Handles conversational configuration, squad management, and system diagnostics
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { saveGlobalKey, applyGlobalKeys, loadGlobalKeys } from './keys.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const AVAILABLE_AGENTS = [
  { id: 'architect', name: 'Architect', description: 'Creates squads dynamically' },
  { id: 'coordinator', name: 'Coordinator', description: 'Orchestrates squad workflows' },
  { id: 'researcher', name: 'Researcher', description: 'Search and gather information' },
  { id: 'scraper', name: 'Scraper', description: 'Web scraping specialist' },
  { id: 'strategist', name: 'Strategist', description: 'Planning and strategy' },
  { id: 'writer', name: 'Writer', description: 'Content creation' },
  { id: 'copywriter', name: 'Copywriter', description: 'Marketing copy' },
  { id: 'executor', name: 'Executor', description: 'Execute tasks' },
  { id: 'reviewer', name: 'Reviewer', description: 'Quality assurance' },
  { id: 'codereviewer', name: 'Code Reviewer', description: 'Code quality review' },
  { id: 'tester', name: 'Tester', description: 'Testing specialist' },
  { id: 'pentester', name: 'Pentester', description: 'Security testing' },
  { id: 'securityauditor', name: 'Security Auditor', description: 'Security audit' },
  { id: 'bughunter', name: 'Bug Hunter', description: 'Bug hunting' },
  { id: 'debugger', name: 'Debugger', description: 'Debugging specialist' },
  { id: 'dataanalyst', name: 'Data Analyst', description: 'Data analysis' },
  { id: 'visualizer', name: 'Visualizer', description: 'Data visualization' },
  { id: 'seoexpert', name: 'SEO Expert', description: 'SEO optimization' },
  { id: 'socialmediamanager', name: 'Social Media Manager', description: 'Social media' },
  { id: 'translator', name: 'Translator', description: 'Translation' },
  { id: 'summarizer', name: 'Summarizer', description: 'Summarization' },
  { id: 'tutor', name: 'Tutor', description: 'Teaching' },
  { id: 'productspecialist', name: 'Product Specialist', description: 'Product expertise' },
  { id: 'salesscript', name: 'Sales Script', description: 'Sales scripting' },
  { id: 'videoextractor', name: 'Video Extractor', description: 'Video extraction' },
  { id: 'videolearner', name: 'Video Learner', description: 'Video learning' },
  { id: 'designer', name: 'Designer', description: 'Design specialist' },
];

/**
 * Load all available squads from squads/ directory
 */
function loadSquads() {
  const squadsDir = join(__dirname, '..', 'squads');
  const squads = [];
  if (!existsSync(squadsDir)) return squads;
  try {
    const entries = readdirSync(squadsDir);
    for (const entry of entries) {
      const squadFile = join(squadsDir, entry, 'squad.json');
      if (existsSync(squadFile)) {
        try {
          const data = JSON.parse(readFileSync(squadFile, 'utf-8'));
          squads.push({ name: entry, ...data });
        } catch { /* skip invalid */ }
      }
    }
  } catch { /* ignore */ }
  return squads;
}

/**
 * Write a squad.json file
 */
function writeSquadFile(name, squadData) {
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error('Invalid squad name. Use only letters, numbers, hyphens and underscores.');
  }
  if (!squadData.agents || !Array.isArray(squadData.agents) || squadData.agents.length === 0) {
    throw new Error('Squad must have at least one agent.');
  }
  if (!squadData.pipeline || !Array.isArray(squadData.pipeline) || squadData.pipeline.length === 0) {
    throw new Error('Squad must have at least one pipeline step.');
  }

  const squadsDir = join(__dirname, '..', 'squads');
  const squadDir = join(squadsDir, name);
  if (!existsSync(squadDir)) {
    mkdirSync(squadDir, { recursive: true });
  }
  const filePath = join(squadDir, 'squad.json');
  const toWrite = {
    name,
    description: squadData.description || '',
    agents: squadData.agents,
    pipeline: squadData.pipeline
  };
  writeFileSync(filePath, JSON.stringify(toWrite, null, 2), 'utf-8');
  return filePath;
}

/**
 * Build the system prompt for the assistant with full system context
 */
function buildSystemPrompt(context) {
  const { squads = [], configuredProviders = [], agentCount = 0, squadCount = 0 } = context;

  const agentList = AVAILABLE_AGENTS.map(a => `- **${a.id}**: ${a.description}`).join('\n');
  const squadList = squads.length > 0
    ? squads.map(s => `- **${s.name}**: ${s.description || 'No description'} (agents: ${(s.agents || []).join(', ')})`).join('\n')
    : '- No squads configured yet';
  const providerList = configuredProviders.length > 0
    ? configuredProviders.join(', ')
    : 'None configured';

  return `You are the OpenClawSquad Assistant — the intelligent interface for OpenClawSquad, a multi-agent AI orchestration framework.

## Current System State
- **Configured LLM providers**: ${providerList}
- **Available agents**: ${agentCount} agents loaded
- **Available squads**: ${squadCount} squads

## Available Agents
${agentList}

## Available Squads
${squadList}

## Your Capabilities
You help users configure the system and manage squads through conversation. You can take real actions by embedding JSON commands in \`\`\`action blocks.

### Save an API key:
\`\`\`action
{"action":"save_key","key":"ANTHROPIC_API_KEY","value":"sk-ant-..."}
\`\`\`

### Create a new squad:
\`\`\`action
{"action":"create_squad","name":"my-squad","description":"What this squad does","agents":["researcher","writer"],"pipeline":[{"agent":"researcher","action":"gather","input":"topic"},{"agent":"writer","action":"create","input":"researcher"}]}
\`\`\`

### Run an existing squad:
\`\`\`action
{"action":"run_squad","name":"content","prompt":"Write an article about AI in healthcare"}
\`\`\`

### Delete a squad:
\`\`\`action
{"action":"delete_squad","name":"old-squad"}
\`\`\`

## Guidelines
- When a user provides an API key, always confirm it by showing the last 4 characters before saving
- When creating squads, explain the pipeline you designed step by step
- Be concise, helpful, and proactive — suggest next steps
- If no LLM provider is configured, guide the user to set one up first
- Respond in the **same language as the user**
- After executing an action, tell the user what happened and what they can do next`;
}

/**
 * Parse ```action ... ``` blocks from AI response text
 */
function parseActions(text) {
  const actions = [];
  const regex = /```action\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed.action) {
        actions.push(parsed);
      }
    } catch {
      // skip invalid JSON blocks
    }
  }
  return actions;
}

/**
 * Execute a parsed action command
 */
async function executeAction(action, broadcastFn) {
  switch (action.action) {
    case 'save_key': {
      if (!action.key || !action.value) {
        return { success: false, message: 'Missing key name or value' };
      }
      try {
        saveGlobalKey(action.key, action.value);
        applyGlobalKeys();
        return { success: true, message: `API key ${action.key} saved successfully` };
      } catch (err) {
        return { success: false, message: `Failed to save key: ${err.message}` };
      }
    }

    case 'create_squad': {
      try {
        const filePath = writeSquadFile(action.name, {
          description: action.description,
          agents: action.agents,
          pipeline: action.pipeline
        });
        return { success: true, message: `Squad "${action.name}" created at ${filePath}` };
      } catch (err) {
        return { success: false, message: `Failed to create squad: ${err.message}` };
      }
    }

    case 'run_squad': {
      try {
        const squadsDir = join(__dirname, '..', 'squads');
        const squadFile = join(squadsDir, action.name, 'squad.json');
        if (!existsSync(squadFile)) {
          return { success: false, message: `Squad "${action.name}" not found` };
        }
        // Run in background — import pipeline runner dynamically
        const { PipelineRunner } = await import('./pipeline-runner.js');
        const runner = new PipelineRunner(action.name, process.cwd());
        runner.onStatusChange = (event) => {
          if (broadcastFn) broadcastFn({ type: 'agent_updated', data: event });
        };
        const runId = runner.runId;
        // Fire and forget
        runner.execute(action.prompt || '').catch(err => {
          if (broadcastFn) broadcastFn({ type: 'activity', data: { agent: 'System', message: `Squad run failed: ${err.message}` } });
        });
        return { success: true, message: `Squad "${action.name}" started (ID: ${runId})` };
      } catch (err) {
        return { success: false, message: `Failed to start squad: ${err.message}` };
      }
    }

    case 'delete_squad': {
      try {
        const squadsDir = join(__dirname, '..', 'squads');
        const squadFile = join(squadsDir, action.name, 'squad.json');
        if (!existsSync(squadFile)) {
          return { success: false, message: `Squad "${action.name}" not found` };
        }
        const { unlinkSync } = await import('fs');
        unlinkSync(squadFile);
        return { success: true, message: `Squad "${action.name}" deleted` };
      } catch (err) {
        return { success: false, message: `Failed to delete squad: ${err.message}` };
      }
    }

    default:
      return { success: false, message: `Unknown action: ${action.action}` };
  }
}

/**
 * Onboarding response when no LLM is configured
 */
function buildOnboardingResponse(context) {
  const { squads = [], agentCount = 0 } = context;
  const lines = [];

  lines.push('👋 Welcome to **OpenClawSquad**! I\'m your assistant.');
  lines.push('');
  lines.push('🔍 **System check:**');
  lines.push(`- Agents available: **${agentCount}** agents loaded`);
  lines.push(`- Squads available: **${squads.length}** squads`);
  lines.push('- LLM provider: **❌ Not configured**');
  lines.push('');
  lines.push('⚠️ **No LLM API key is configured yet.** To get started, I need an API key for at least one of:');
  lines.push('- **Anthropic (Claude)** — recommended — get your key at console.anthropic.com');
  lines.push('- **OpenAI (GPT-4)** — get your key at platform.openai.com');
  lines.push('- **Minimax** — get your key at api.minimax.chat');
  lines.push('');
  lines.push('Just type your API key here and I\'ll configure it for you automatically.');
  lines.push('Example: `sk-ant-api03-...` (for Anthropic)');

  return lines.join('\n');
}

/**
 * Main chat handler — processes a message and returns a reply + executed actions
 */
export async function handleChat({ message, history = [], broadcastFn = null }) {
  // Build current system context
  const squads = loadSquads();
  const keys = loadGlobalKeys();
  const configuredProviders = [];
  if (keys['ANTHROPIC_API_KEY'] || process.env['ANTHROPIC_API_KEY']) configuredProviders.push('Anthropic (Claude)');
  if (keys['OPENAI_API_KEY'] || process.env['OPENAI_API_KEY']) configuredProviders.push('OpenAI');
  if (keys['MINIMAX_API_KEY'] || process.env['MINIMAX_API_KEY']) configuredProviders.push('Minimax');

  const agentsDir = join(__dirname, '..', 'agents');
  let agentCount = 0;
  try {
    agentCount = existsSync(agentsDir) ? readdirSync(agentsDir).filter(f => f.endsWith('.agent.md')).length : 0;
  } catch { /* ignore */ }

  const context = {
    squads,
    configuredProviders,
    agentCount,
    squadCount: squads.length
  };

  // If no LLM is configured, return fallback onboarding response
  // (but still check if the message contains an API key to save)
  const apiKeyPatterns = [
    { pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, key: 'ANTHROPIC_API_KEY' },
    { pattern: /\bsk-[A-Za-z0-9]{40,}\b/g, key: 'OPENAI_API_KEY' },
  ];

  if (configuredProviders.length === 0) {
    // Check if user is providing a key directly
    const executed = [];
    for (const { pattern, key } of apiKeyPatterns) {
      const matches = message.match(pattern);
      if (matches) {
        const value = matches[0];
        try {
          saveGlobalKey(key, value);
          applyGlobalKeys();
          configuredProviders.push(key.replace('_API_KEY', ''));
          executed.push({ success: true, action: 'save_key', message: `${key} saved (ends in ...${value.slice(-4)})` });
        } catch (err) {
          executed.push({ success: false, action: 'save_key', message: err.message });
        }
        break;
      }
    }

    if (executed.length > 0 && executed[0].success) {
      return {
        reply: `✅ **API key saved!** (ends in \`...${executed[0].message.match(/\.{3}(.{4})\)/)?.[1] || '????'}\`)\n\nI'm now connected to your LLM provider. You have **${squads.length} squads** and **${agentCount} agents** ready to use!\n\nWhat would you like to do?\n- Type **"show squads"** to see all available squads\n- Type **"run content squad"** to run a squad\n- Type **"create a squad for..."** to build a custom squad`,
        executed
      };
    }

    return {
      reply: buildOnboardingResponse(context),
      executed: []
    };
  }

  // LLM is available — call it
  try {
    const { getDefaultProvider } = await import('./providers/index.js');
    const provider = getDefaultProvider();

    const systemPrompt = buildSystemPrompt(context);

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const response = await provider.chat(messages, {
      max_tokens: 1024,
      temperature: 0.7
    });

    const replyText = response.content || '';

    // Parse and execute any embedded actions
    const actions = parseActions(replyText);
    const executed = [];
    for (const action of actions) {
      const result = await executeAction(action, broadcastFn);
      executed.push({ ...result, action: action.action });
    }

    // Strip action blocks from displayed text
    const cleanReply = replyText.replace(/```action\s*\n[\s\S]*?```/g, '').trim();

    return { reply: cleanReply, executed };

  } catch (err) {
    // LLM call failed
    return {
      reply: `❌ **Error calling LLM**: ${err.message}\n\nPlease check that your API key is valid and you have internet access.`,
      executed: []
    };
  }
}

/**
 * Run a health check on the system
 */
export async function runHealthCheck() {
  const keys = loadGlobalKeys();
  const squads = loadSquads();
  const agentsDir = join(__dirname, '..', 'agents');
  const nodeModulesDir = join(__dirname, '..', 'node_modules');

  let agentCount = 0;
  try {
    agentCount = existsSync(agentsDir) ? readdirSync(agentsDir).filter(f => f.endsWith('.agent.md')).length : 0;
  } catch { /* ignore */ }

  const providers = {};

  for (const [providerName, envVar] of [
    ['anthropic', 'ANTHROPIC_API_KEY'],
    ['openai', 'OPENAI_API_KEY'],
    ['minimax', 'MINIMAX_API_KEY']
  ]) {
    const keyValue = keys[envVar] || process.env[envVar] || '';
    if (!keyValue) {
      providers[providerName] = { status: 'missing', configured: false };
      continue;
    }

    providers[providerName] = { status: 'configured', configured: true };

    // Test connectivity with minimal token request
    try {
      const { getProvider } = await import('./providers/index.js');
      // Temporarily set env var if from keys file
      if (keys[envVar] && !process.env[envVar]) {
        process.env[envVar] = keys[envVar];
      }
      const prov = getProvider(providerName);
      await prov.chat([
        { role: 'user', content: 'hi' }
      ], { max_tokens: 5 });
      providers[providerName] = { status: 'ok', configured: true };
    } catch (err) {
      providers[providerName] = {
        status: 'error',
        configured: true,
        error: err.message?.slice(0, 100)
      };
    }
  }

  const ready = Object.values(providers).some(p => p.status === 'ok');

  return {
    providers,
    agentCount,
    squadCount: squads.length,
    nodeModulesExists: existsSync(nodeModulesDir),
    ready
  };
}
