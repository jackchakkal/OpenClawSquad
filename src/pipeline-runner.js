/**
 * OpenClawSquad Pipeline Runner
 * Executa squads de forma automatica com checkpoints e chamadas reais ao LLM
 */

import chalk from 'chalk';
import YAML from 'yaml';
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { AgentExecutor, findAgentFile } from './agent-executor.js';
import { getDefaultProvider, listProviders } from './providers/index.js';
import { loadConfig } from './config.js';
import { logEvent, log } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const cyan = chalk.cyan;
const green = chalk.green;
const yellow = chalk.yellow;
const red = chalk.red;
const dim = chalk.dim;

export class PipelineRunner {
  constructor(squadName, targetDir = process.cwd()) {
    this.squadName = squadName;
    this.squadDir = join(rootDir, 'squads', squadName);
    this.outputDir = join(this.squadDir, 'output');
    this.targetDir = targetDir;
    this.pipeline = null;
    this.steps = [];
    this.agents = {};
    this.status = 'idle';
    this.context = {}; // Accumulated context between steps
    this.results = []; // Results of each step
    this.runId = new Date().toISOString().replace(/[:.]/g, '-');
    this.onStatusChange = null; // Callback for dashboard integration
  }

  async load() {
    // Try squad.json first (pre-built squads), then squad.yaml
    const jsonFile = join(this.squadDir, 'squad.json');
    const yamlFile = join(this.squadDir, 'squad.yaml');

    if (existsSync(jsonFile)) {
      const data = JSON.parse(readFileSync(jsonFile, 'utf-8'));
      this.pipeline = data;
      this.steps = data.pipeline || [];
    } else if (existsSync(yamlFile)) {
      const data = YAML.parse(readFileSync(yamlFile, 'utf-8'));
      this.pipeline = data;
      this.steps = data.steps || data.pipeline || [];
    } else {
      throw new Error(`Squad "${this.squadName}" nao encontrado em ${this.squadDir}`);
    }

    console.log(cyan(`\n📋 Pipeline carregado: ${this.pipeline.name || this.squadName}`));
    console.log(dim(`   ${this.steps.length} steps definidos`));

    // Load agents
    await this._loadAgents();

    // Show provider info
    this._showProviderInfo();
  }

  _showProviderInfo() {
    try {
      const provider = getDefaultProvider();
      console.log(green(`🤖 Provider: ${provider.name} (${provider.defaultModel})`));
    } catch (e) {
      console.log(red(`⚠️  ${e.message}`));
    }
  }

  async _loadAgents() {
    // Load from squad-local agents directory
    const agentsDir = join(this.squadDir, 'agents');
    if (existsSync(agentsDir)) {
      const files = readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
      for (const file of files) {
        const agentId = file.replace('.agent.md', '');
        this.agents[agentId] = join(agentsDir, file);
      }
    }

    // Also check which agents from the pipeline exist in global agents/
    const agentIds = this.steps
      .filter(s => s.agent)
      .map(s => s.agent);

    for (const agentId of agentIds) {
      if (!this.agents[agentId]) {
        const globalPath = join(rootDir, 'agents', `${agentId}.agent.md`);
        if (existsSync(globalPath)) {
          this.agents[agentId] = globalPath;
        }
      }
    }

    const count = Object.keys(this.agents).length;
    console.log(green(`✅ ${count} agente(s) carregado(s)`));

    // Warn about missing agents
    for (const agentId of agentIds) {
      if (!this.agents[agentId]) {
        console.log(yellow(`   ⚠️  Agente "${agentId}" nao encontrado`));
      }
    }
  }

  async execute(userInput) {
    if (!this.pipeline) {
      await this.load();
    }

    this.status = 'running';
    this.context.userInput = userInput || '';

    console.log(cyan('\n🎬 Iniciando execucao do pipeline...\n'));

    await logEvent('pipeline_start', {
      squad: this.squadName,
      runId: this.runId,
      steps: this.steps.length
    }, this.targetDir);

    const totalSteps = this.steps.length;

    for (let i = 0; i < totalSteps; i++) {
      const step = this.steps[i];

      if (step.type === 'checkpoint' || step.checkpoint) {
        // Checkpoint - pause for human approval
        const name = step.name || step.action || 'Aprovacao necessaria';
        console.log(yellow(`\n⏸️  CHECKPOINT [${i + 1}/${totalSteps}]: ${name}`));

        if (this.context.lastOutput) {
          console.log(dim('\n--- Ultimo output ---'));
          console.log(dim(this.context.lastOutput.substring(0, 500)));
          if (this.context.lastOutput.length > 500) {
            console.log(dim('... (truncado)'));
          }
          console.log(dim('--- fim ---\n'));
        }

        const { approved, feedback } = await this._askApproval(step);
        if (!approved) {
          console.log(red('❌ Execucao cancelada pelo usuario'));
          this.status = 'cancelled';
          await logEvent('pipeline_cancelled', { squad: this.squadName, step: i }, this.targetDir);
          return this._buildResult();
        }
        if (feedback) {
          this.context.userInput = feedback;
        }
      } else {
        // Execute agent step
        await this._executeStep(step, i, totalSteps);
      }
    }

    this.status = 'completed';
    console.log(green('\n✅ Pipeline executado com sucesso!'));
    console.log(dim(`   Run ID: ${this.runId}`));

    await logEvent('pipeline_complete', {
      squad: this.squadName,
      runId: this.runId,
      totalTokens: this._getTotalTokens()
    }, this.targetDir);

    // Save final summary
    this._saveSummary();

    return this._buildResult();
  }

  async _executeStep(step, stepIndex, totalSteps) {
    const agentId = step.agent;
    const agentFilePath = this.agents[agentId];
    const action = step.action || step.description || 'Executando';

    console.log(yellow(`\n[${stepIndex + 1}/${totalSteps}] 🤖 ${agentId}: ${action}`));

    if (!agentFilePath) {
      console.log(red(`   ❌ Agente "${agentId}" nao encontrado - pulando step`));
      this.results.push({ agentId, status: 'skipped', error: 'Agent not found' });
      return;
    }

    this._emitStatus(agentId, 'running', action);

    try {
      const config = loadConfig(this.targetDir);
      const executor = new AgentExecutor({
        targetDir: this.targetDir,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        onStatus: (id, status, task) => this._emitStatus(id, status, task)
      });

      const taskDescription = this._buildTaskDescription(step);

      const result = await executor.execute(agentFilePath, taskDescription, {
        previousOutput: this.context.lastOutput,
        userInput: this.context.userInput,
        squadInfo: `Squad: ${this.squadName} | Step ${stepIndex + 1}/${totalSteps} | Action: ${action}`,
        model: config.model
      });

      // Update context for next step
      this.context.lastOutput = result.content;
      this.context[`output_${agentId}`] = result.content;

      this.results.push({
        agentId,
        agentName: result.agentName,
        status: 'completed',
        usage: result.usage,
        model: result.model,
        outputPath: result.outputPath
      });

      // Print summary
      const tokens = result.usage
        ? `${result.usage.prompt_tokens || 0}+${result.usage.completion_tokens || 0} tokens`
        : '';
      console.log(green(`   ✓ Concluido ${dim(tokens)}`));

      this._emitStatus(agentId, 'completed', action);
    } catch (error) {
      console.log(red(`   ❌ Erro: ${error.message}`));
      this.results.push({ agentId, status: 'error', error: error.message });
      this._emitStatus(agentId, 'error', error.message);

      // Ask user if they want to continue despite the error
      const { approved } = await this._askApproval({
        message: `Agente "${agentId}" falhou. Continuar mesmo assim?`
      });
      if (!approved) {
        this.status = 'failed';
        throw error;
      }
    }
  }

  _buildTaskDescription(step) {
    const parts = [];

    if (step.action) parts.push(`Acao: ${step.action}`);
    if (step.description) parts.push(`Descricao: ${step.description}`);
    if (step.input) parts.push(`Input esperado de: ${step.input}`);
    if (step.inputFile) parts.push(`Arquivo de input: ${step.inputFile}`);
    if (step.outputFile) parts.push(`Salvar output em: ${step.outputFile}`);

    return parts.join('\n') || 'Execute sua tarefa principal conforme sua persona.';
  }

  async _askApproval(step) {
    const inquirer = (await import('inquirer')).default;

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: step.message || 'Aprovar e continuar?',
        default: true
      }
    ]);

    let feedback = null;
    if (answers.approved) {
      const feedbackAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'feedback',
          message: 'Feedback ou instrucoes adicionais (Enter para pular):',
          default: ''
        }
      ]);
      feedback = feedbackAnswer.feedback || null;
    }

    return { approved: answers.approved, feedback };
  }

  _emitStatus(agentId, status, task) {
    if (this.onStatusChange) {
      this.onStatusChange({
        type: 'agent_status',
        agentId,
        status,
        task,
        squad: this.squadName,
        runId: this.runId
      });
    }
  }

  _getTotalTokens() {
    let total = { prompt_tokens: 0, completion_tokens: 0 };
    for (const r of this.results) {
      if (r.usage) {
        total.prompt_tokens += r.usage.prompt_tokens || 0;
        total.completion_tokens += r.usage.completion_tokens || 0;
      }
    }
    return total;
  }

  _saveSummary() {
    const runsDir = join(this.targetDir, '_openclawsquad', 'runs');
    mkdirSync(runsDir, { recursive: true });

    const summary = {
      runId: this.runId,
      squad: this.squadName,
      status: this.status,
      startedAt: this.runId,
      completedAt: new Date().toISOString(),
      totalTokens: this._getTotalTokens(),
      steps: this.results
    };

    writeFileSync(
      join(runsDir, `${this.runId}-summary.json`),
      JSON.stringify(summary, null, 2),
      'utf-8'
    );
  }

  _buildResult() {
    return {
      squad: this.squadName,
      runId: this.runId,
      status: this.status,
      results: this.results,
      totalTokens: this._getTotalTokens(),
      lastOutput: this.context.lastOutput
    };
  }

  getStatus() {
    return {
      squad: this.squadName,
      status: this.status,
      runId: this.runId,
      pipeline: this.pipeline?.name,
      agents: Object.keys(this.agents),
      completedSteps: this.results.length,
      totalSteps: this.steps.length
    };
  }
}

export default PipelineRunner;

export async function runPipeline(squadName, targetDir) {
  if (!squadName) {
    console.log('  Usage: openclawsquad run <squad-name>\n');
    console.log('  Available squads:');
    const squadsDir = join(rootDir, 'squads');
    if (existsSync(squadsDir)) {
      const squads = readdirSync(squadsDir).filter(f => {
        const dir = join(squadsDir, f);
        return existsSync(join(dir, 'squad.json')) || existsSync(join(dir, 'squad.yaml'));
      });
      for (const s of squads) {
        console.log(`    - ${s}`);
      }
    }
    console.log('');
    return;
  }

  // Load .env if dotenv is available
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch {
    // dotenv not installed, env vars must be set externally
  }

  const runner = new PipelineRunner(squadName, targetDir);

  try {
    await runner.load();

    // Ask for initial input
    const inquirer = (await import('inquirer')).default;
    const { userInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userInput',
        message: '📝 Descreva o objetivo desta execucao:',
        default: ''
      }
    ]);

    const result = await runner.execute(userInput);

    if (result.status === 'completed') {
      const tokens = result.totalTokens;
      console.log(dim(`\n📊 Total: ${tokens.prompt_tokens + tokens.completion_tokens} tokens usados`));
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}\n`);
  }
}
