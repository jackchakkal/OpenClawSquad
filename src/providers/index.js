/**
 * LLM Provider Registry & Factory
 * Auto-detects available provider based on environment variables.
 * Priority: MINIMAX > OPENAI > ANTHROPIC
 */

import createMinimaxProvider from './minimax.js';
import createOpenAIProvider from './openai.js';
import createAnthropicProvider from './anthropic.js';

const PROVIDERS = {
  anthropic: {
    envVar: 'ANTHROPIC_API_KEY',
    create: (key) => createAnthropicProvider(key),
    label: 'Anthropic Claude'
  },
  openai: {
    envVar: 'OPENAI_API_KEY',
    create: (key) => createOpenAIProvider(key),
    label: 'OpenAI'
  },
  minimax: {
    envVar: 'MINIMAX_API_KEY',
    create: (key) => createMinimaxProvider(key),
    label: 'Minimax M2.7'
  }
};

const PRIORITY = ['anthropic', 'openai', 'minimax'];

/**
 * Get a specific provider by name
 */
export function getProvider(name) {
  const config = PROVIDERS[name];
  if (!config) {
    throw new Error(
      `Unknown provider "${name}". Available: ${Object.keys(PROVIDERS).join(', ')}`
    );
  }
  return config.create(process.env[config.envVar]);
}

/**
 * Auto-detect the best available provider based on env vars.
 * Override with OPENCLAWSQUAD_PROVIDER env var.
 */
export function getDefaultProvider() {
  // Allow explicit override
  const override = process.env.OPENCLAWSQUAD_PROVIDER;
  if (override) {
    if (!PROVIDERS[override]) {
      throw new Error(
        `Provider "${override}" not found. Available: ${Object.keys(PROVIDERS).join(', ')}`
      );
    }
    const config = PROVIDERS[override];
    if (!process.env[config.envVar]) {
      throw new Error(
        `Provider "${override}" selected but ${config.envVar} is not set.`
      );
    }
    return config.create(process.env[config.envVar]);
  }

  // Auto-detect by priority
  for (const name of PRIORITY) {
    const config = PROVIDERS[name];
    if (process.env[config.envVar]) {
      return config.create(process.env[config.envVar]);
    }
  }

  throw new Error(
    'No LLM provider configured. Set one of: ' +
    PRIORITY.map(n => PROVIDERS[n].envVar).join(', ')
  );
}

/**
 * List all available (configured) providers
 */
export function listProviders() {
  return PRIORITY.map(name => {
    const config = PROVIDERS[name];
    return {
      name,
      label: config.label,
      configured: !!process.env[config.envVar],
      envVar: config.envVar
    };
  });
}
