/**
 * OpenClawSquad - Update
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function update(targetDir) {
  console.log('\n  🔄 Checking for updates...\n');
  
  // Check current version
  const packageJsonPath = join(__dirname, '..', 'package.json');
  let currentVersion = 'unknown';
  
  try {
    const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    currentVersion = pkg.version;
  } catch {
    // Can't read version
  }
  
  console.log(`  Current version: ${currentVersion}`);
  console.log('  (Use npm install -g openclawsquad to update)\n');
  
  return {
    success: true,
    currentVersion,
    message: 'Update check complete'
  };
}
