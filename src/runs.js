/**
 * OpenClawSquad - Runs History
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function listRuns(squadName = null, targetDir) {
  const runsDir = join(targetDir, '_openclawsquad', 'runs');
  
  try {
    await stat(runsDir);
  } catch {
    return [];
  }
  
  const entries = await readdir(runsDir);
  const runs = [];
  
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    
    const runPath = join(runsDir, entry);
    try {
      const content = await readFile(runPath, 'utf-8');
      const run = JSON.parse(content);
      
      if (squadName && run.squad !== squadName) continue;
      
      runs.push(run);
    } catch {
      // Skip invalid files
    }
  }
  
  // Sort by timestamp descending
  runs.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  
  return runs;
}

export function printRuns(runs) {
  if (runs.length === 0) {
    console.log('\n  📊 No runs found\n');
    return;
  }
  
  console.log('\n  📊 Execution History:\n');
  console.log('  ' + '-'.repeat(70));
  console.log('  Squad'.padEnd(20) + 'Status'.padEnd(12) + 'Started'.padEnd(25) + 'Duration');
  console.log('  ' + '-'.repeat(70));
  
  for (const run of runs) {
    const squad = (run.squad || 'unknown').padEnd(20);
    const status = (run.status || 'unknown').padEnd(12);
    const started = new Date(run.startedAt).toLocaleString().padEnd(25);
    const duration = run.duration ? `${run.duration}s` : '-';
    
    const statusIcon = run.status === 'completed' ? '✅' : 
                       run.status === 'failed' ? '❌' : '🔄';
    
    console.log(`  ${statusIcon} ${squad} ${status} ${started} ${duration}`);
  }
  
  console.log('  ' + '-'.repeat(70));
  console.log(`\n  Total: ${runs.length} run(s)\n`);
}

export async function saveRun(run, targetDir) {
  const runsDir = join(targetDir, '_openclawsquad', 'runs');
  await mkdir(runsDir, { recursive: true });
  
  const filename = `${run.squad}-${Date.now()}.json`;
  const runPath = join(runsDir, filename);
  
  await writeFile(runPath, JSON.stringify(run, null, 2), 'utf-8');
  
  return runPath;
}
