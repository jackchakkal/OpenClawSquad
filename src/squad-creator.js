#!/usr/bin/env node

/**
 * Squad Creator - Cria squads dinamicamente
 * Baseado no Architect do opensquad
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const cyan = chalk.cyan;
const green = chalk.green;
const yellow = chalk.yellow;

export class SquadCreator {
  constructor() {
    this.squadName = '';
    this.agents = [];
    this.pipeline = [];
    this.mode = 'high';
  }

  async create() {
    console.log(cyan('\n🧠 Squad Architect - Criando squad personalizado\n'));

    // Fase 1: Descoberta
    await this._discovery();

    // Fase 2: Design
    const design = await this._design();

    // Fase 3: Apresentar
    await this._present(design);

    // Fase 4: Confirmar
    const confirmed = await this._confirm();

    if (confirmed) {
      await this._build(design);
    }
  }

  async _discovery() {
    // Pergunta 1: Propósito
    const purpose = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: '1. Qual o propósito deste squad? O que ele deve fazer?',
        default: 'Criar conteúdo para redes sociais'
      }
    ]);
    this.purpose = purpose.value;

    // Pergunta 2: Público
    const audience = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: '2. Para quem é este conteúdo? (público-alvo)',
        default: 'Profissionais de marketing'
      }
    ]);
    this.audience = audience.value;

    // Pergunta 3: Modo
    const mode = await inquirer.prompt([
      {
        type: 'list',
        name: 'value',
        message: '3. Qual modo de performance?',
        choices: [
          { name: 'Alta Performance - Pipeline completo com análise profunda, múltiplos formatos e revisão completa', value: 'high' },
          { name: 'Econômico - Pipeline enxuto com análise básica e revisão leve', value: 'low' }
        ],
        default: 'high'
      }
    ]);
    this.mode = mode.value;

    // Pergunta 4: Plataformas
    const platforms = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'value',
        message: '4. Quais plataformas?',
        choices: ['Instagram', 'LinkedIn', 'Twitter/X', 'YouTube', 'Blog', 'Email', 'WhatsApp'],
        default: ['Instagram', 'LinkedIn']
      }
    ]);
    this.platforms = platforms.value;
  }

  async _design() {
    console.log(yellow('\n🎨 Definindo agentes...\n'));

    const design = {
      agents: [],
      pipeline: [],
      platforms: this.platforms,
      mode: this.mode
    };

    // Adicionar agentes base
    design.agents.push({
      id: 'researcher',
      name: 'Rodrigo Referencia',
      role: 'Pesquisa informações e tendências',
      tasks: ['find-news.md', 'rank-stories.md']
    });

    design.pipeline.push({
      type: 'checkpoint',
      name: 'Selecionar notícia',
      description: 'Usuário seleciona uma notícia para desenvolver'
    });

    design.agents.push({
      id: 'strategist',
      name: 'Sofia Estratégia',
      role: 'Define abordagem e ângulos',
      tasks: ['generate-angles.md']
    });

    design.pipeline.push({
      type: 'checkpoint',
      name: 'Selecionar ângulo',
      description: 'Usuário seleciona o melhor ângulo'
    });

    // Adicionar criadores por plataforma
    for (const platform of this.platforms) {
      const agentId = `${platform.toLowerCase()}-creator`;
      design.agents.push({
        id: agentId,
        name: this._getCreatorName(platform),
        role: `Cria conteúdo para ${platform}`,
        tasks: this.mode === 'high' 
          ? [`create-${platform.toLowerCase()}.md`, `optimize-${platform.toLowerCase()}.md`]
          : [`create-${platform.toLowerCase()}.md`]
      });

      design.pipeline.push({
        type: 'agent',
        agent: agentId,
        description: `Criar conteúdo para ${platform}`
      });
    }

    // Revisor
    design.agents.push({
      id: 'reviewer',
      name: 'Renata Revisão',
      role: 'Revisa e avalia qualidade',
      tasks: this.mode === 'high' 
        ? ['score-content.md', 'generate-feedback.md']
        : ['review.md']
    });

    design.pipeline.push({
      type: 'checkpoint',
      name: 'Aprovação final',
      description: 'Usuário aprova conteúdo para publicação'
    });

    return design;
  }

  _getCreatorName(platform) {
    const names = {
      'Instagram': 'Ian Instagram',
      'LinkedIn': 'Lucas LinkedIn',
      'Twitter/X': 'Tiago Twitter',
      'YouTube': 'Yuri YouTube',
      'Blog': 'Bruno Blog',
      'Email': 'Erik Email',
      'WhatsApp': 'Wagner WhatsApp'
    };
    return names[platform] || `${platform} Creator`;
  }

  async _present(design) {
    console.log(cyan('\n📋 DESIGN DO SQUAD:\n'));
    console.log(`   Propósito: ${this.purpose}`);
    console.log(`   Público: ${this.audience}`);
    console.log(`   Modo: ${this.mode === 'high' ? 'Alta Performance' : 'Econômico'}`);
    console.log(`   Plataformas: ${design.platforms.join(', ')}`);

    console.log(cyan('\n👥 AGENTES:\n'));
    design.agents.forEach((agent, i) => {
      console.log(`   ${i + 1}. ${agent.name} (${agent.id})`);
      console.log(`      - ${agent.role}`);
      console.log(`      - Tarefas: ${agent.tasks.join(', ')}`);
    });

    console.log(cyan('\n🔄 PIPELINE:\n'));
    design.pipeline.forEach((step, i) => {
      if (step.type === 'checkpoint') {
        console.log(`   ${i + 1}. ⏸️ CHECKPOINT: ${step.name}`);
      } else {
        console.log(`   ${i + 1}. ▶️ ${step.agent}: ${step.description}`);
      }
    });
  }

  async _confirm() {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: '\nEste design está bom? Criar o squad?',
        default: true
      }
    ]);
    return confirmed;
  }

  async _build(design) {
    // Criar diretórios
    const squadDir = join(rootDir, 'squads', this.squadName || 'meu-squad');
    mkdirSync(join(squadDir, 'agents'), { recursive: true });
    mkdirSync(join(squadDir, 'pipeline', 'steps'), { recursive: true });
    mkdirSync(join(squadDir, 'data'), { recursive: true });
    mkdirSync(join(squadDir, 'output'), { recursive: true });

    // Criar squad.yaml
    const squadYaml = this._generateSquadYaml(design);
    writeFileSync(join(squadDir, 'squad.yaml'), squadYaml);

    // Criar agentes
    for (const agent of design.agents) {
      const agentMd = this._generateAgentMd(agent);
      writeFileSync(join(squadDir, 'agents', `${agent.id}.agent.md`), agentMd);
    }

    // Criar pipeline
    const pipelineYaml = this._generatePipelineYaml(design);
    writeFileSync(join(squadDir, 'pipeline', 'pipeline.yaml'), pipelineYaml);

    console.log(green(`\n✅ Squad criado com sucesso em: ${squadDir}`));
  }

  _generateSquadYaml(design) {
    return `
name: ${this.squadName || 'meu-squad'}
description: ${this.purpose}
mode: ${design.mode}
platforms:
${design.platforms.map(p => `  - ${p}`).join('\n')}

agents:
${design.agents.map(a => `  - id: ${a.id}
    name: ${a.name}
    role: ${a.role}`).join('\n')}

pipeline: ${design.pipeline.length} steps
`.trim();
  }

  _generateAgentMd(agent) {
    return `---
id: squads/meu-squad/agents/${agent.id}
name: ${agent.name}
title: ${agent.role}
icon: 🤖
squad: meu-squad
execution: subagent
tasks:
${agent.tasks.map(t => `  - ${t}`).join('\n')}
---

# ${agent.name}

## Persona

### Role
${agent.role}

## Principles
1. Executar tarefa com excelência
2. Seguir guidelines do squad
3. Reportar progresso
4. Solicitar ajuda quando necessário

## Tasks
${agent.tasks.join(', ')}

## Integration
- Depends on: previous step
- Output: output/${agent.id}.md
`;
  }

  _generatePipelineYaml(design) {
    let yaml = 'steps:\n';
    
    design.pipeline.forEach((step, i) => {
      if (step.type === 'checkpoint') {
        yaml += `
- type: checkpoint
  name: ${step.name}
  description: ${step.description}
`;
      } else {
        yaml += `
- type: agent
  agent: ${step.agent}
  description: ${step.description}
  inputFile: output/${design.pipeline[i-1]?.agent || 'start'}.md
  outputFile: output/${step.agent}.md
`;
      }
    });

    return yaml.trim();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const creator = new SquadCreator();
  creator.squadName = process.argv[2] || 'meu-squad';
  creator.create();
}
