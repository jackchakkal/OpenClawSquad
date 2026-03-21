/**
 * OpenClawSquad - Global API Keys Manager
 * Stores keys in ~/.openclawsquad/keys.json — no .env editing needed
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const KEYS_DIR = join(homedir(), '.openclawsquad');
const KEYS_FILE = join(KEYS_DIR, 'keys.json');

/**
 * Load all saved API keys from the global config file
 */
export function loadGlobalKeys() {
  if (!existsSync(KEYS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(KEYS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Save a single API key to the global config file
 */
export function saveGlobalKey(envVar, value) {
  mkdirSync(KEYS_DIR, { recursive: true });
  const keys = loadGlobalKeys();
  keys[envVar] = value;
  writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
}

/**
 * Remove a key from the global config file
 */
export function removeGlobalKey(envVar) {
  if (!existsSync(KEYS_FILE)) return;
  const keys = loadGlobalKeys();
  delete keys[envVar];
  writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
}

/**
 * Load all saved keys into process.env (only if not already set)
 */
export function applyGlobalKeys() {
  const keys = loadGlobalKeys();
  for (const [key, value] of Object.entries(keys)) {
    if (value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

/**
 * Return the path where keys are stored (for display purposes)
 */
export function keysFilePath() {
  return KEYS_FILE;
}
