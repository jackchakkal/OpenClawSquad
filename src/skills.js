/**
 * OpenClawSquad - Skills Management
 */

import { readFile, writeFile, mkdir, cp, stat, readdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Available skills (bundled with the package)
export const AVAILABLE_SKILLS = [
  { id: 'apify', name: 'Apify', description: 'Web scraping and automation' },
  { id: 'canva', name: 'Canva', description: 'Design integration' },
  { id: 'image-creator', name: 'Image Creator', description: 'HTML/CSS to image rendering' },
  { id: 'image-fetcher', name: 'Image Fetcher', description: 'Web image search and capture' },
  { id: 'instagram-publisher', name: 'Instagram Publisher', description: 'Publish to Instagram' },
];

export async function listAvailable() {
  return AVAILABLE_SKILLS.map(s => s.id);
}

export async function getSkillInfo(skillId) {
  return AVAILABLE_SKILLS.find(s => s.id === skillId);
}

export async function installSkill(skillId, targetDir) {
  const skillsDir = join(__dirname, '..', 'skills', skillId);
  const targetSkillsDir = join(targetDir, 'skills');
  
  // Check if skill exists in package
  try {
    await stat(skillsDir);
  } catch {
    throw new Error(`Skill ${skillId} not found`);
  }
  
  // Create skills directory
  await mkdir(targetSkillsDir, { recursive: true });
  
  // Copy skill files
  const targetSkillDir = join(targetSkillsDir, skillId);
  await cp(skillsDir, targetSkillDir, { recursive: true });
  
  return { success: true, skillId };
}

export async function removeSkill(skillId, targetDir) {
  const targetSkillDir = join(targetDir, 'skills', skillId);
  
  try {
    await rm(targetSkillDir, { recursive: true, force: true });
    return { success: true, skillId };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function listInstalled(targetDir) {
  const skillsDir = join(targetDir, 'skills');
  
  try {
    const entries = await readdir(skillsDir);
    return entries.filter(e => !e.endsWith('.md'));
  } catch {
    return [];
  }
}

export async function updateSkill(skillId, targetDir) {
  // Remove and reinstall
  await removeSkill(skillId, targetDir);
  return installSkill(skillId, targetDir);
}
