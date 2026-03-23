/**
 * OpenClawSquad Configuration Manager
 * Loads config from: env vars > openclawsquad.config.json > defaults
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEFAULTS = {
  provider: null, // auto-detect
  model: null, // provider default
  temperature: 0.7,
  maxTokens: 4096,
  language: 'pt-BR',
  timeout: 120000, // 2 minutes per step
  dashboardPort: 3001
};

let _config = null;

/**
 * Load configuration, merging sources by priority
 */
export function loadConfig(targetDir = process.cwd()) {
  if (_config) return _config;

  let fileConfig = {};

  // Try to load config file
  const configPath = join(targetDir, 'openclawsquad.config.json');
  if (existsSync(configPath)) {
    try {
      fileConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      // Invalid config file, use defaults
    }
  }

  // Also check project-level _openclawsquad directory
  const projectConfigPath = join(targetDir, '_openclawsquad', 'config.json');
  if (existsSync(projectConfigPath)) {
    try {
      const projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
      fileConfig = { ...fileConfig, ...projectConfig };
    } catch {
      // Invalid config file
    }
  }

  // Merge: defaults < file config < env vars
  _config = {
    ...DEFAULTS,
    ...fileConfig,
    // Env var overrides
    ...(process.env.OPENCLAWSQUAD_PROVIDER && { provider: process.env.OPENCLAWSQUAD_PROVIDER }),
    ...(process.env.OPENCLAWSQUAD_MODEL && { model: process.env.OPENCLAWSQUAD_MODEL }),
    ...(process.env.OPENCLAWSQUAD_TEMPERATURE && { temperature: parseFloat(process.env.OPENCLAWSQUAD_TEMPERATURE) }),
    ...(process.env.OPENCLAWSQUAD_MAX_TOKENS && { maxTokens: parseInt(process.env.OPENCLAWSQUAD_MAX_TOKENS, 10) }),
    ...(process.env.OPENCLAWSQUAD_LANGUAGE && { language: process.env.OPENCLAWSQUAD_LANGUAGE }),
  };

  return _config;
}

/**
 * Reset cached config (useful for testing)
 */
export function resetConfig() {
  _config = null;
}

/**
 * Save configuration to openclawsquad.config.json
 */
export function saveConfig(targetDir, newConfig) {
  const configPath = join(targetDir, 'openclawsquad.config.json');
  let existing = {};
  if (existsSync(configPath)) {
    try {
      existing = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      // Invalid existing config, overwrite
    }
  }
  const merged = { ...existing, ...newConfig };
  writeFileSync(configPath, JSON.stringify(merged, null, 2), 'utf-8');
  resetConfig();
  return merged;
}

/**
 * Get a specific config value
 */
export function getConfig(key, targetDir) {
  const config = loadConfig(targetDir);
  return config[key] ?? DEFAULTS[key];
}
