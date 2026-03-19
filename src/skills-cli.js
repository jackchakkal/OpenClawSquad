/**
 * OpenClawSquad - Skills CLI
 */

import { listAvailable, installSkill, removeSkill, listInstalled, updateSkill, getSkillInfo, AVAILABLE_SKILLS } from './skills.js';
import { t } from './i18n.js';

export async function skillsCli(subcommand, args, targetDir) {
  switch (subcommand) {
    case 'list':
    case 'ls':
      return await listSkills(targetDir);
    case 'install':
    case 'add':
      return await installSkillCmd(args, targetDir);
    case 'remove':
    case 'uninstall':
    case 'rm':
      return await removeSkillCmd(args, targetDir);
    case 'update':
    case 'upgrade':
      return await updateSkillCmd(args, targetDir);
    case 'info':
      return await infoSkillCmd(args);
    default:
      console.log(`\n  Usage: openclawsquad skills <command>\n`);
      console.log(`  Commands:`);
      console.log(`    list, ls              List installed skills`);
      console.log(`    install <name>       Install a skill`);
      console.log(`    remove <name>        Remove a skill`);
      console.log(`    update <name>        Update a skill`);
      console.log(`    info <name>          Show skill info\n`);
      return { success: false };
  }
}

async function listSkills(targetDir) {
  const installed = await listInstalled(targetDir);
  const available = await listAvailable();
  const availableSkills = AVAILABLE_SKILLS;
  
  console.log('\n  📦 Installed Skills:\n');
  
  if (installed.length === 0) {
    console.log('    (none)\n');
  } else {
    for (const skillId of installed) {
      const info = await getSkillInfo(skillId);
      console.log(`    ✓ ${skillId}${info ? ` - ${info.description}` : ''}`);
    }
    console.log('');
  }
  
  console.log('  📦 Available Skills:\n');
  for (const skill of availableSkills) {
    const isInstalled = installed.includes(skill.id);
    console.log(`    ${isInstalled ? '✓' : '○'} ${skill.id} - ${skill.description}`);
  }
  console.log('');
  
  return { success: true };
}

async function installSkillCmd(args, targetDir) {
  const skillId = args[0];
  
  if (!skillId) {
    console.log('  Usage: openclawsquad skills install <name>\n');
    return { success: false };
  }
  
  try {
    console.log(`  Installing ${skillId}...`);
    await installSkill(skillId, targetDir);
    console.log(`  ✅ ${skillId} installed successfully!\n`);
    return { success: true };
  } catch (e) {
    console.log(`  ❌ Failed to install ${skillId}: ${e.message}\n`);
    return { success: false };
  }
}

async function removeSkillCmd(args, targetDir) {
  const skillId = args[0];
  
  if (!skillId) {
    console.log('  Usage: openclawsquad skills remove <name>\n');
    return { success: false };
  }
  
  try {
    await removeSkill(skillId, targetDir);
    console.log(`  ✅ ${skillId} removed successfully!\n`);
    return { success: true };
  } catch (e) {
    console.log(`  ❌ Failed to remove ${skillId}: ${e.message}\n`);
    return { success: false };
  }
}

async function updateSkillCmd(args, targetDir) {
  const skillId = args[0];
  
  if (!skillId) {
    console.log('  Usage: openclawsquad skills update <name>\n');
    return { success: false };
  }
  
  try {
    console.log(`  Updating ${skillId}...`);
    await updateSkill(skillId, targetDir);
    console.log(`  ✅ ${skillId} updated successfully!\n`);
    return { success: true };
  } catch (e) {
    console.log(`  ❌ Failed to update ${skillId}: ${e.message}\n`);
    return { success: false };
  }
}

async function infoSkillCmd(args) {
  const skillId = args[0];
  
  if (!skillId) {
    console.log('  Usage: openclawsquad skills info <name>\n');
    return { success: false };
  }
  
  const info = await getSkillInfo(skillId);
  
  if (info) {
    console.log(`\n  📦 ${info.name}\n`);
    console.log(`    ID: ${info.id}`);
    console.log(`    Description: ${info.description}\n`);
    return { success: true };
  } else {
    console.log(`  ❌ Skill ${skillId} not found\n`);
    return { success: false };
  }
}
