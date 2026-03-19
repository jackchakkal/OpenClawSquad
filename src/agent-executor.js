/**
 * Agent Executor - Converts .agent.md files into real LLM calls
 * Parses agent persona from markdown, builds messages, calls provider
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import YAML from 'yaml';
import { getDefaultProvider } from './providers/index.js';
import { logEvent } from './logger.js';

export class AgentExecutor {
  constructor(options = {}) {
    this.provider = options.provider || getDefaultProvider();
    this.targetDir = options.targetDir || process.cwd();
    this.onStatus = options.onStatus || (() => {});
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens || 4096;
  }

  /**
   * Parse an .agent.md file into metadata and system prompt
   */
  parseAgentFile(filePath) {
    if (!existsSync(filePath)) {
      throw new Error(`Agent file not found: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    let metadata = {};
    let systemPrompt = content;

    if (frontmatterMatch) {
      try {
        metadata = YAML.parse(frontmatterMatch[1]) || {};
      } catch {
        metadata = {};
      }
      systemPrompt = frontmatterMatch[2].trim();
    }

    return { metadata, systemPrompt };
  }

  /**
   * Execute an agent with a given task and context
   */
  async execute(agentFilePath, task, context = {}) {
    const { metadata, systemPrompt } = this.parseAgentFile(agentFilePath);
    const agentName = metadata.name || 'Agent';
    const agentId = metadata.id || 'unknown';

    this.onStatus(agentId, 'running', task);

    await logEvent('agent_start', {
      agent: agentId,
      name: agentName,
      task
    }, this.targetDir);

    // Build the user message with task and previous context
    let userMessage = `## Task\n${task}`;

    if (context.previousOutput) {
      userMessage += `\n\n## Previous Step Context\n${context.previousOutput}`;
    }

    if (context.userInput) {
      userMessage += `\n\n## User Input\n${context.userInput}`;
    }

    if (context.squadInfo) {
      userMessage += `\n\n## Squad Info\n${context.squadInfo}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const result = await this.provider.chat(messages, {
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        model: context.model
      });

      // Save output
      const outputContent = this._formatOutput(agentName, task, result.content, result.usage);
      const outputPath = this._saveOutput(agentId, outputContent);

      this.onStatus(agentId, 'completed', task);

      await logEvent('agent_complete', {
        agent: agentId,
        name: agentName,
        task,
        tokens: result.usage,
        outputPath
      }, this.targetDir);

      return {
        agentId,
        agentName,
        content: result.content,
        usage: result.usage,
        model: result.model,
        outputPath
      };
    } catch (error) {
      this.onStatus(agentId, 'error', error.message);

      await logEvent('agent_error', {
        agent: agentId,
        name: agentName,
        task,
        error: error.message
      }, this.targetDir);

      throw error;
    }
  }

  _formatOutput(agentName, task, content, usage) {
    const timestamp = new Date().toISOString();
    let output = `# Output: ${agentName}\n`;
    output += `> Generated at: ${timestamp}\n`;
    output += `> Task: ${task}\n`;
    if (usage) {
      output += `> Tokens: ${usage.prompt_tokens || 0} input, ${usage.completion_tokens || 0} output\n`;
    }
    output += `\n---\n\n${content}\n`;
    return output;
  }

  _saveOutput(agentId, content) {
    const runsDir = join(this.targetDir, '_openclawsquad', 'runs');
    const runId = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = join(runsDir, runId);

    mkdirSync(outputDir, { recursive: true });

    const fileName = agentId.replace(/\//g, '_') + '.md';
    const outputPath = join(outputDir, fileName);
    writeFileSync(outputPath, content, 'utf-8');

    return outputPath;
  }
}

/**
 * Find agent file in squad directory or global agents directory
 */
export function findAgentFile(agentId, squadDir, rootDir) {
  // 1. Check squad-local agents directory
  const squadAgent = join(squadDir, 'agents', `${agentId}.agent.md`);
  if (existsSync(squadAgent)) return squadAgent;

  // 2. Check global agents directory
  const globalAgent = join(rootDir, 'agents', `${agentId}.agent.md`);
  if (existsSync(globalAgent)) return globalAgent;

  return null;
}
