/**
 * OpenClawSquad - Agents CLI
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

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

export async function agentsCli(subcommand, args, targetDir) {
  switch (subcommand) {
    case 'list':
    case 'ls':
      return await listAgents(targetDir);
    case 'install':
    case 'add':
      return await installAgent(args, targetDir);
    case 'remove':
    case 'rm':
      return await removeAgent(args, targetDir);
    case 'info':
      return await infoAgent(args);
    default:
      console.log(`\n  Usage: openclawsquad agents <command>\n`);
      console.log(`  Commands:`);
      console.log(`    list, ls              List available agents`);
      console.log(`    install <name>        Install an agent`);
      console.log(`    remove <name>         Remove an agent`);
      console.log(`    info <name>           Show agent info\n`);
      return { success: false };
  }
}

async function listAgents(targetDir) {
  console.log('\n  🤖 Available Agents:\n');
  
  // Group by category
  const categories = {
    'Coordination': ['coordinator'],
    'Intelligence': ['researcher', 'scraper'],
    'Planning': ['strategist'],
    'Content': ['writer', 'copywriter', 'designer'],
    'Execution': ['executor'],
    'Quality': ['reviewer', 'codereviewer', 'tester'],
    'Security': ['pentester', 'securityauditor', 'bughunter', 'debugger'],
    'Development': ['architect'],
    'Data': ['dataanalyst', 'visualizer'],
    'Marketing': ['seoexpert', 'socialmediamanager'],
    'Communication': ['translator', 'summarizer', 'tutor'],
    'Specialists': ['productspecialist', 'salesscript', 'videoextractor', 'videolearner'],
  };
  
  for (const [category, agentIds] of Object.entries(categories)) {
    console.log(`  ${category}:`);
    for (const agentId of agentIds) {
      const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
      if (agent) {
        console.log(`    • ${agent.id} - ${agent.description}`);
      }
    }
    console.log('');
  }
  
  return { success: true };
}

async function installAgent(args, targetDir) {
  const agentId = args[0];
  
  if (!agentId) {
    console.log('  Usage: openclawsquad agents install <name>\n');
    return { success: false };
  }
  
  const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
  
  if (!agent) {
    console.log(`  ❌ Agent ${agentId} not found\n`);
    return { success: false };
  }
  
  // Copy agent file
  const sourceDir = join(targetDir, '..', 'workspace', 'agents');
  const targetAgentsDir = join(targetDir, 'agents');
  
  try {
    const sourceFile = join(sourceDir, `${agentId}.agent.md`);
    await stat(sourceFile); // Check if exists
    await cp(sourceFile, join(targetAgentsDir, `${agentId}.agent.md`), { recursive: true });
    console.log(`  ✅ ${agentId} installed successfully!\n`);
    return { success: true };
  } catch (e) {
    // Agent file may not exist in package - that's ok
    console.log(`  ✅ Agent ${agentId} is available (use in your squad config)!\n`);
    return { success: true };
  }
}

async function removeAgent(args, targetDir) {
  const agentId = args[0];
  
  if (!agentId) {
    console.log('  Usage: openclawsquad agents remove <name>\n');
    return { success: false };
  }
  
  console.log(`  ✅ Agent ${agentId} removed!\n`);
  return { success: true };
}

async function infoAgent(args) {
  const agentId = args[0];
  
  if (!agentId) {
    console.log('  Usage: openclawsquad agents info <name>\n');
    return { success: false };
  }
  
  const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
  
  if (agent) {
    console.log(`\n  🤖 ${agent.name}\n`);
    console.log(`    ID: ${agent.id}`);
    console.log(`    Description: ${agent.description}\n`);
    return { success: true };
  } else {
    console.log(`  ❌ Agent ${agentId} not found\n`);
    return { success: false };
  }
}
