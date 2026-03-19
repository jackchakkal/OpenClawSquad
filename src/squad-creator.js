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
    const name = this.squadName || 'meu-squad';
    const squadDir = join(rootDir, 'squads', name);
    mkdirSync(join(squadDir, 'agents'), { recursive: true });
    mkdirSync(join(squadDir, 'output'), { recursive: true });

    // Generate squad.json (compatible with pipeline-runner)
    const squadJson = this._generateSquadJson(design);
    writeFileSync(join(squadDir, 'squad.json'), JSON.stringify(squadJson, null, 2));

    // Create agent .md files
    for (const agent of design.agents) {
      const agentMd = this._generateAgentMd(agent);
      writeFileSync(join(squadDir, 'agents', `${agent.id}.agent.md`), agentMd);
    }

    console.log(green(`\n✅ Squad criado com sucesso em: ${squadDir}`));
    console.log(`   Execute com: npx openclawsquad run ${name}`);
  }

  _generateSquadJson(design) {
    const name = this.squadName || 'meu-squad';
    return {
      name,
      description: this.purpose,
      audience: this.audience,
      mode: design.mode,
      platforms: design.platforms,
      agents: design.agents.map(a => a.id),
      pipeline: design.pipeline.map((step, i) => {
        if (step.type === 'checkpoint') {
          return {
            checkpoint: true,
            name: step.name,
            message: step.description
          };
        }
        const prevAgent = design.pipeline.slice(0, i).reverse().find(s => s.agent);
        return {
          agent: step.agent,
          action: step.description,
          input: prevAgent?.agent || 'user'
        };
      })
    };
  }

  _generateAgentMd(agent) {
    const name = this.squadName || 'meu-squad';
    return `---
id: squads/${name}/agents/${agent.id}
name: ${agent.name}
title: ${agent.role}
icon: 🤖
squad: ${name}
execution: subagent
tasks:
${agent.tasks.map(t => `  - ${t}`).join('\n')}
---

# ${agent.name}

## Persona

### Role
${agent.role}

### Objetivo do Squad
${this.purpose}

### Publico-alvo
${this.audience}

## Principles
1. Executar tarefa com excelencia
2. Seguir guidelines do squad
3. Reportar progresso de forma clara
4. Solicitar ajuda quando necessario
5. Manter consistencia com o publico-alvo

## Tasks
${agent.tasks.join(', ')}

## Output Format
- Estruturado em markdown
- Claro e acionavel
- Pronto para o proximo agente consumir

## Integration
- Depends on: previous step
- Output: output/${agent.id}.md
`;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const creator = new SquadCreator();
  creator.squadName = process.argv[2] || 'meu-squad';
  creator.create();
}

export async function createSquad(squadName, targetDir, options = {}) {
  const creator = new SquadCreator();
  creator.squadName = squadName || 'meu-squad';
  
  if (options._skipPrompts) {
    // Quick mode - create a basic squad
    creator.purpose = 'General purpose squad';
    creator.audience = 'General';
    creator.mode = 'high';
    creator.platforms = ['Instagram', 'LinkedIn'];
    
    const design = await creator._design();
    await creator._build(design);
  } else {
    await creator.create();
  }
}
