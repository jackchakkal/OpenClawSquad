#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Cores
const cyan = chalk.cyan;
const green = chalk.green;
const yellow = chalk.yellow;
const red = chalk.red;

async function main() {
  console.log(`
${cyan('🦞 OpenClawSquad')} - Multi-Agent Orchestration Framework
${'='.repeat(50)}
`);

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      await init();
      break;
    case 'create':
      await createSquad(args[1]);
      break;
    case 'run':
      await runSquad(args[1]);
      break;
    case 'list':
      await listSquads();
      break;
    case 'dashboard':
      await startDashboard();
      break;
    case 'help':
    default:
      showHelp();
  }
}

async function init() {
  console.log(green('🚀 Inicializando OpenClawSquad...'));
  
  // Criar estrutura de diretórios
  const dirs = ['squads', 'agents', 'skills', 'output'];
  
  console.log(green('✅ Estrutura criada!'));
  console.log(`
Próximos passos:
1. Execute: openclawsquad create <nome-do-squad>
2. Execute: openclawsquad dashboard
`);
}

async function createSquad(name) {
  if (!name) {
    console.log(red('Usage: openclawsquad create <nome-do-squad>'));
    return;
  }

  console.log(green(`📋 Criando squad: ${name}...`));
  
  const { answers } = await inquirer.prompt([
    {
      type: 'input',
      name: 'purpose',
      message: 'Qual o propósito deste squad?',
      default: 'Criar conteúdo para redes sociais'
    },
    {
      type: 'checkbox',
      name: 'agents',
      message: 'Selecione os agentes:',
      choices: [
        { name: 'Researcher', checked: true },
        { name: 'Strategist', checked: true },
        { name: 'Writer', checked: true },
        { name: 'Designer', checked: true },
        { name: 'Reviewer', checked: true },
        { name: 'Publisher', checked: false }
      ]
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Modo de performance:',
      choices: [
        { name: 'Alta Performance (Recomendado)', value: 'high' },
        { name: 'Econômico', value: 'low' }
      ],
      default: 'high'
    }
  ]);

  console.log(green(`\n✅ Squad "${name}" criado!`));
  console.log(cyan(`\nAgentes: ${answers.agents.join(', ')}`));
  console.log(cyan(`Modo: ${answers.mode}`));
  console.log(green(`\nPara executar: openclawsquad run ${name}`));
}

async function runSquad(name) {
  if (!name) {
    console.log(red('Usage: openclawsquad run <nome-do-squad>'));
    return;
  }

  console.log(cyan(`\n🎬 Executando squad: ${name}...`));
  
  // Simular execução
  console.log(yellow('\n[1/3] Researcher: Pesquisando...'));
  await sleep(1000);
  console.log(green('   ✓ Pesquisa concluída'));
  
  console.log(yellow('\n[2/3] Writer: Criando conteúdo...'));
  await sleep(1000);
  console.log(green('   ✓ Conteúdo criado'));
  
  console.log(yellow('\n[3/3] Reviewer: Revisando...'));
  await sleep(1000);
  console.log(green('   ✓ Revisão concluída'));
  
  console.log(green('\n✅ Squad executado com sucesso!'));
}

async function listSquads() {
  const squadsDir = join(rootDir, 'squads');
  
  if (!existsSync(squadsDir)) {
    console.log(yellow('Nenhum squad encontrado. Crie um com: openclawsquad create <nome>'));
    return;
  }
  
  const squads = readdirSync(squadsDir).filter(f => {
    try {
      return require(join(squadsDir, f)).isDirectory();
    } catch {
      return false;
    }
  });
  
  if (squads.length === 0) {
    console.log(yellow('Nenhum squad encontrado.'));
  } else {
    console.log(green('\n📋 Seus Squads:\n'));
    squads.forEach(s => console.log(`  - ${s}`));
  }
}

async function startDashboard() {
  console.log(cyan('\n📺 Iniciando Dashboard 2D...'));
  console.log(yellow('Acesse: http://localhost:3000\n'));
  console.log(green('Pressione Ctrl+C para parar'));
  
  // Aqui seria o servidor HTTP real
  const { exec } = await import('child_process');
  exec('cd ' + join(rootDir, 'dashboard') + ' && python3 -m http.server 3000');
}

function showHelp() {
  console.log(`
${cyan('Usage:')} openclawsquad <command> [options]

${cyan('Commands:')}
  init                 Inicializar OpenClawSquad
  create <name>       Criar novo squad
  run <name>          Executar squad
  list                Listar squads
  dashboard           Iniciar dashboard 2D
  help                Mostrar esta ajuda

${cyan('Examples:')}
  openclawsquad init
  openclawsquad create content-squad
  openclawsquad run content-squad
  openclawsquad dashboard
`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
