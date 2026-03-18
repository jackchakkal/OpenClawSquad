/**
 * OpenClawSquad Pipeline Runner
 * Executa squads de forma automática com checkpoints
 */

import chalk from 'chalk';
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const cyan = chalk.cyan;
const green = chalk.green;
const yellow = chalk.yellow;
const red = chalk.red;

export class PipelineRunner {
  constructor(squadName) {
    this.squadName = squadName;
    this.squadDir = join(rootDir, 'squads', squadName);
    this.outputDir = join(this.squadDir, 'output');
    this.pipeline = null;
    this.agents = {};
    this.status = 'idle';
  }

  async load() {
    // Carregar squad.yaml
    const squadFile = join(this.squadDir, 'squad.yaml');
    if (!existsSync(squadFile)) {
      throw new Error(`Squad "${this.squadName}" não encontrado`);
    }

    this.pipeline = this._parseYaml(readFileSync(squadFile, 'utf-8'));
    console.log(cyan(`\n📋 Pipeline carregado: ${this.pipeline.name}`));
    
    // Carregar agentes
    await this._loadAgents();
  }

  async _loadAgents() {
    const agentsDir = join(this.squadDir, 'agents');
    if (!existsSync(agentsDir)) return;

    const files = readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
    
    for (const file of files) {
      const agentId = file.replace('.agent.md', '');
      const content = readFileSync(join(agentsDir, file), 'utf-8');
      
      // Parse agent metadata
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        this.agents[agentId] = this._parseYaml(match[1]);
      }
    }
    
    console.log(green(`✅ ${Object.keys(this.agents).length} agentes carregados`));
  }

  async execute() {
    if (!this.pipeline) {
      await this.load();
    }

    this.status = 'running';
    console.log(cyan('\n🎬 Iniciando execução do pipeline...\n'));

    const steps = this.pipeline.steps || [];
    let currentStep = 0;

    while (currentStep < steps.length) {
      const step = steps[currentStep];
      
      if (step.type === 'checkpoint') {
        // Pausar para aprovação humana
        console.log(yellow(`\n⏸️ CHECKPOINT: ${step.name || 'Aprovação necessária'}`));
        
        if (step.require_approval) {
          const { approved } = await this._askApproval(step);
          if (!approved) {
            console.log(red('❌ Execução cancelada pelo usuário'));
            this.status = 'cancelled';
            return;
          }
        }
      } else {
        // Executar agente
        await this._executeStep(step);
      }

      currentStep++;
    }

    this.status = 'completed';
    console.log(green('\n✅ Pipeline executado com sucesso!'));
  }

  async _executeStep(step) {
    const agent = this.agents[step.agent];
    if (!agent) {
      console.log(red(`❌ Agente não encontrado: ${step.agent}`));
      return;
    }

    console.log(yellow(`\n[${currentStep + 1}/${totalSteps}] ${agent.name}: ${step.description || 'Executando...'}`));

    // Simular execução do agente
    // Em implementação real, chamaria o modelo de AI aqui
    
    console.log(green(`   ✓ Concluído`));
  }

  async _askApproval(step) {
    const inquirer = await import('inquirer');
    
    return await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approved',
        message: `${step.message || 'Aprovar continuar?'}`,
        default: true
      }
    ]);
  }

  _parseYaml(content) {
    // Simple YAML parser para metadata
    const result = {};
    const lines = content.split('\n');
    let currentKey = '';
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        result[match[1]] = match[2].trim();
      }
    }
    
    return result;
  }

  getStatus() {
    return {
      squad: this.squadName,
      status: this.status,
      pipeline: this.pipeline?.name,
      agents: Object.keys(this.agents)
    };
  }
}

export default PipelineRunner;
