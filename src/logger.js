/**
 * OpenClawSquad - Logger
 */

import { appendFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export async function logEvent(event, data, targetDir) {
  const logDir = join(targetDir, '_openclawsquad', 'logs');
  const logFile = join(logDir, 'events.log');
  
  try {
    await mkdir(dirname(logFile), { recursive: true });
    
    const timestamp = new Date().toISOString();
    const logLine = JSON.stringify({ timestamp, event, ...data }) + '\n';
    
    await appendFile(logFile, logLine, 'utf-8');
  } catch (e) {
    // Silently fail - logging is not critical
  }
}

export function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️ ',
    warn: '⚠️ ',
    error: '❌ ',
    success: '✅ ',
    debug: '🔍 '
  }[level] || 'ℹ️ ';
  
  console.log(`${prefix} ${message}`);
}
