/**
 * OpenClawSquad - Motor de Orquestração Multi-Agente
 * 
 * Este é o coração do sistema. Permite criar squads de agentes
 * que trabalham juntos para完成 tarefas complexas.
 * 
 * Conceitos:
 * - Agents: Pesquisador, Estrategista, Redator, Executor, Revisor
 * - Squads: Equipes pré-definidas de agentes
 * - Pipeline: Fluxo de execução entre agentes
 * - Checkpoints: Pontos de decisão humana
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Base de agentes disponíveis
export const AGENTS = {
  researcher: {
    name: 'Researcher',
    icon: '🔍',
    role: 'Coleta informações e dados',
    capabilities: ['web_fetch', 'search', 'read']
  },
  strategist: {
    name: 'Strategist', 
    icon: '🎯',
    role: 'Analisa e planeja',
    capabilities: ['analyze', 'plan']
  },
  writer: {
    name: 'Writer',
    icon: '✍️',
    role: 'Produz conteúdo',
    capabilities: ['write', 'edit']
  },
  executor: {
    name: 'Executor',
    icon: '⚡',
    role: 'Executa ações',
    capabilities: ['exec', 'browser', 'write']
  },
  reviewer: {
    name: 'Reviewer',
    icon: '🔎',
    role: 'Garante qualidade',
    capabilities: ['verify', 'audit', 'review']
  },
  coordinator: {
    name: 'Coordinator (Carinha)',
    icon: '🎼',
    role: 'Coordena tudo',
    capabilities: ['all'],
    isMe: true
  }
};

// Squads pré-definidos
export const SQUADS = {
  pentest: {
    name: 'Pentest',
    description: 'Teste de invasão e segurança',
    agents: ['coordinator', 'researcher', 'executor', 'reviewer'],
    checkpointEvery: 2
  },
  content: {
    name: 'Content',
    description: 'Criação de conteúdo',
    agents: ['coordinator', 'researcher', 'writer', 'reviewer'],
    checkpointEvery: 2
  },
  research: {
    name: 'Research',
    description: 'Pesquisa profunda',
    agents: ['coordinator', 'researcher', 'strategist'],
    checkpointEvery: 1
  },
  automation: {
    name: 'Automation',
    description: 'Automação de tarefas',
    agents: ['coordinator', 'strategist', 'executor', 'reviewer'],
    checkpointEvery: 2
  }
};

/**
 * Lista agentes disponíveis
 */
export function listAgents() {
  return Object.entries(AGENTS).map(([id, agent]) => ({
    id,
    ...agent
  }));
}

/**
 * Lista squads disponíveis
 */
export function listSquads() {
  return Object.entries(SQUADS).map(([id, squad]) => ({
    id,
    ...squad
  }));
}

/**
 * Mostra detalhes de um squad específico
 */
export async function getSquadDetails(squadId) {
  const squad = SQUADS[squadId];
  if (!squad) return null;
  
  return {
    ...squad,
    agents: squad.agents.map(id => AGENTS[id])
  };
}

/**
 * Explica como usar o OpenClawSquad
 */
export function getHelp() {
  return `
🎼 **OpenClawSquad** — Sistema de Orquestração Multi-Agente

**Agentes disponíveis:**
${Object.values(AGENTS).map(a => `  ${a.icon} ${a.name}: ${a.role}`).join('\n')}

**Squads pré-definidos:**
${Object.values(SQUADS).map(s => `  • ${s.name}: ${s.description}`).join('\n')}

**Como usar:**

1. **Squad automático:**
   "Faça uma pesquisa sobre X" → Eu coordeno tudo

2. **Squad específico:**
   "Use o squad de pentest no site X"

3. **Múltiplos agentes:**
   "Chame o Researcher e o Writer para fazerem X"

4. **Com checkpoint:**
   "Faça X, mas pause para eu aprovar antes de continuar"

**Exemplo:**
> "Preciso de um relatório sobre segurança do meu site"
→ Eu: Research → Analyze → Write → Review → Apresento

Quer que eu execute algum squad agora? 🎯
`;
}
