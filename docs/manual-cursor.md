# Manual do OpenClawSquad para Cursor

Guia completo para configurar e utilizar o OpenClawSquad dentro do **Cursor**.

---

## 1. Introducao

O OpenClawSquad e um framework de orquestracao multi-agente open source. Ele permite coordenar 27+ agentes de IA especializados (pesquisadores, redatores, revisores, pentesters, analistas de dados, etc.) em pipelines sequenciais chamados **squads**.

A integracao com o **Cursor** utiliza o sistema de **Cursor Rules** — regras de contexto que sao automaticamente injetadas no AI do editor. Ao abrir o projeto no Cursor, o assistente ja conhece todos os agentes, squads e comandos disponiveis.

### O que a integracao fornece

Ao inicializar o OpenClawSquad com suporte a Cursor, o seguinte arquivo e criado:

| Arquivo | Funcao |
|---------|--------|
| `.cursor/rules/openclawsquad.mdc` | Regra de contexto com agentes, comandos e instrucoes para o AI |

O Cursor carrega automaticamente todos os arquivos `.mdc` de `.cursor/rules/` como contexto para o AI.

---

## 2. Pre-requisitos

Antes de comecar, certifique-se de ter:

- **Node.js** versao 20 ou superior (`node --version`)
- **Cursor** instalado e funcionando (https://cursor.com)
- **Chave de API** de pelo menos um provedor de IA:
  - Minimax (M2.7) — provedor principal
  - OpenAI (GPT-4o)
  - Anthropic (Claude)
  - Ou Jan (AI local, sem chave necessaria)

---

## 3. Instalacao e Configuracao Inicial

### Opcao A: Wizard interativo (recomendado)

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad start
```

O wizard ira perguntar:

1. **Modo de interface**: Terminal (CLI) ou Dashboard (Browser)
2. **Chaves de API**: Configure Minimax, OpenAI e/ou Anthropic
3. **IDEs**: Selecione **Cursor** na lista de IDEs

### Opcao B: Inicializacao direta

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad init
```

Durante o `init`, selecione **Cursor** quando perguntado sobre IDEs. O sistema ira:

1. Criar a estrutura `_openclawsquad/` com configuracoes e memoria
2. Copiar os 27+ agentes para `agents/`
3. Copiar os squads pre-construidos para `squads/`
4. Instalar as skills disponiveis em `skills/`
5. Criar `.cursor/rules/openclawsquad.mdc`
6. Salvar suas preferencias em `_openclawsquad/_memory/preferences.md`

### Verificacao

Apos a inicializacao, a estrutura do projeto sera:

```
meu-projeto/
├── .cursor/
│   └── rules/
│       └── openclawsquad.mdc   ← Regra de contexto para o AI do Cursor
├── _openclawsquad/
│   ├── _memory/
│   │   └── preferences.md      ← Suas preferencias
│   └── runs/                   ← Historico de execucoes
├── agents/                     ← 27+ definicoes de agentes (.agent.md)
├── squads/                     ← Squads pre-construidos
│   ├── content/
│   ├── research/
│   ├── automation/
│   └── pentest/
├── skills/                     ← Skills instaladas
├── dashboard/                  ← Dashboard web
└── .env                        ← Suas chaves de API
```

---

## 4. Configuracao de API Keys

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
# Minimax (provedor principal, recomendado)
MINIMAX_API_KEY=sua-chave-minimax

# OpenAI (alternativa)
OPENAI_API_KEY=sua-chave-openai

# Anthropic Claude (alternativa)
ANTHROPIC_API_KEY=sua-chave-anthropic

# Jan - AI local (sem chave, apenas URL)
# JAN_API_URL=http://localhost:1337
# JAN_MODEL=llama-3.3-70b-instruct
```

### Auto-deteccao de provedor

O OpenClawSquad detecta automaticamente qual provedor usar, na seguinte ordem de prioridade:

1. **Minimax** (se `MINIMAX_API_KEY` estiver definida)
2. **OpenAI** (se `OPENAI_API_KEY` estiver definida)
3. **Anthropic** (se `ANTHROPIC_API_KEY` estiver definida)

### Override manual

Para forcar um provedor especifico, adicione ao `.env`:

```env
OPENCLAWSQUAD_PROVIDER=minimax
OPENCLAWSQUAD_MODEL=M2.7
```

### Verificar configuracao

```bash
npx openclawsquad config
```

Mostra o provedor ativo, modelo, temperatura, max tokens e status de cada API key.

---

## 5. Comandos Essenciais

Todos os comandos podem ser executados no terminal integrado do Cursor (`Ctrl+`` ` ou `Cmd+`` `):

| Comando | Descricao |
|---------|-----------|
| `npx openclawsquad start` | Wizard interativo de configuracao |
| `npx openclawsquad init` | Inicializar OpenClawSquad na pasta atual |
| `npx openclawsquad create <nome>` | Criar um novo squad interativamente |
| `npx openclawsquad run <squad>` | Executar o pipeline de um squad |
| `npx openclawsquad dashboard` | Iniciar o dashboard em tempo real |
| `npx openclawsquad agents` | Listar agentes disponiveis |
| `npx openclawsquad agents install <nome>` | Instalar um agente predefinido |
| `npx openclawsquad agents remove <nome>` | Remover um agente |
| `npx openclawsquad skills` | Listar skills instaladas |
| `npx openclawsquad install <skill>` | Instalar uma skill |
| `npx openclawsquad runs` | Ver historico de execucoes |
| `npx openclawsquad config` | Mostrar configuracao atual |
| `npx openclawsquad --help` | Exibir ajuda completa |
| `npx openclawsquad --version` | Exibir versao |

---

## 6. Trabalhando com Agentes

### Listar agentes disponiveis

```bash
npx openclawsquad agents
```

Os 27+ agentes estao organizados por categoria:

| Categoria | Agentes |
|-----------|---------|
| **Coordenacao** | coordinator |
| **Inteligencia** | researcher, scraper |
| **Planejamento** | strategist |
| **Conteudo** | writer, copywriter, designer |
| **Execucao** | executor |
| **Qualidade** | reviewer, codereviewer, tester |
| **Seguranca** | pentester, securityauditor, bughunter, debugger |
| **Arquitetura** | architect |
| **Dados** | dataanalyst, visualizer |
| **Marketing** | seoexpert, socialmediamanager |
| **Comunicacao** | translator, summarizer, tutor |
| **Especialistas** | productspecialist, salesscript, videoextractor, videolearner |

### Formato de um agente

Cada agente e definido em um arquivo `.agent.md` com a seguinte estrutura:

```markdown
---
id: squads/core/agents/writer
name: Writer
title: Content Writer
icon: ✍️
squad: core
execution: inline
tasks: []
version: "1.0.0"
---

# Writer

## Persona
### Role
Redator principal para blogs, redes sociais, emails e landing pages.

### Identity
Orientado a resultados — cada palavra deve servir um proposito.

### Communication Style
Claro, direto, paragrafos curtos, sem jargao.

## Principles
1. Hook First — Comece com algo que prenda a atencao
2. One Idea Per Paragraph — Um pensamento por paragrafo
3. Active Voice — Voz ativa sempre
...

## Operational Framework
### Process
1. Entender o objetivo
2. Definir o tom
3. Criar estrutura
4. Escrever rascunho
5. Revisar e finalizar

## Voice Guidance
### Vocabulary - Always Use
Verbos de acao, substantivos concretos, transicoes claras

### Vocabulary - Never Use
Palavras de preenchimento, jargao, voz passiva

## Output Examples
(Exemplos reais de output do agente)

## Anti-Patterns
### Never Do
- Entregar sem revisao
- Ignorar o tom definido

### Always Do
- Incluir call-to-action
- Adaptar ao canal
```

### Instalar ou remover agentes

```bash
# Instalar um agente
npx openclawsquad agents install pentester

# Remover um agente
npx openclawsquad agents remove videoextractor
```

---

## 7. Criando e Executando Squads

### Squads pre-construidos

O OpenClawSquad vem com 4 squads prontos:

| Squad | Agentes | Uso |
|-------|---------|-----|
| **content** | coordinator, researcher, writer, reviewer | Criacao de conteudo (blogs, posts, emails) |
| **research** | coordinator, researcher, strategist | Pesquisa profunda com analise estrategica |
| **automation** | coordinator, strategist, executor, reviewer | Automacao de tarefas com revisao |
| **pentest** | coordinator, researcher, executor, reviewer | Testes de seguranca e auditoria |

### Executar um squad existente

```bash
npx openclawsquad run content
```

O pipeline executa os agentes em sequencia:

1. **coordinator** → Define o briefing (checkpoint: pausa para aprovacao)
2. **researcher** → Pesquisa informacoes sobre o topico
3. **strategist** → Planeja a estrutura do conteudo
4. **writer** → Cria o conteudo
5. **reviewer** → Revisa e edita
6. **coordinator** → Entrega final (checkpoint: pausa para aprovacao)

A cada **checkpoint**, a execucao pausa e aguarda sua aprovacao para continuar.

### Criar um squad personalizado

```bash
npx openclawsquad create marketing-team
```

O sistema interativo pergunta:

1. **Proposito** do squad
2. **Publico-alvo**
3. **Modo de performance** (high/low)
4. **Plataformas** alvo (Instagram, LinkedIn, YouTube, etc.)

Com base nas respostas, ele gera automaticamente uma equipe de agentes otimizada.

### Estrutura do squad.json

Cada squad e definido por um arquivo `squad.json`:

```json
{
  "name": "content",
  "description": "Content creation squad",
  "agents": ["coordinator", "researcher", "writer", "reviewer"],
  "pipeline": [
    {"agent": "coordinator", "action": "brief", "checkpoint": true},
    {"agent": "researcher", "action": "gather", "input": "topic"},
    {"agent": "strategist", "action": "plan", "input": "researcher"},
    {"agent": "writer", "action": "create", "input": "strategist"},
    {"agent": "reviewer", "action": "edit", "input": "writer"},
    {"agent": "coordinator", "action": "deliver", "checkpoint": true}
  ]
}
```

Campos de cada step do pipeline:

| Campo | Descricao |
|-------|-----------|
| `agent` | ID do agente que executa este step |
| `action` | Acao a ser executada (descritivo) |
| `input` | De onde vem o contexto (agente anterior ou "topic") |
| `checkpoint` | Se `true`, pausa para aprovacao humana |

### Fluxo de contexto

O output de cada agente e passado como input para o proximo:

```
coordinator (briefing)
    ↓ contexto
researcher (pesquisa)
    ↓ contexto
strategist (planejamento)
    ↓ contexto
writer (conteudo)
    ↓ contexto
reviewer (revisao)
    ↓ contexto
coordinator (entrega final)
```

Os resultados sao salvos em `squads/<nome>/output/` e o historico em `_openclawsquad/runs/`.

---

## 8. Dashboard em Tempo Real

O dashboard oferece uma visualizacao 2D dos agentes em execucao via WebSocket.

### Iniciar

```bash
npx openclawsquad dashboard
```

Abra `http://localhost:3001` no navegador.

### Funcionalidades

- Visualizacao em tempo real do status dos agentes (rodando, completo, erro)
- Feed de atividades com timestamps
- Monitoramento de squads ativos
- Status dos provedores de IA configurados

### Uso com pipeline

Em um terminal, inicie o dashboard. Em outro, execute um squad:

```bash
# Terminal 1
npx openclawsquad dashboard

# Terminal 2
npx openclawsquad run content
```

O dashboard atualiza automaticamente conforme os agentes executam.

---

## 9. Skills (Habilidades)

Skills sao modulos extensiveis que adicionam capacidades aos agentes.

### Skills disponiveis

| Skill | Descricao |
|-------|-----------|
| **apify** | Web scraping e automacao |
| **canva** | Integracao com design Canva |
| **image-creator** | Renderizacao HTML/CSS para imagem |
| **image-fetcher** | Busca de imagens na web |
| **instagram-publisher** | Publicacao no Instagram |

### Gerenciar skills

```bash
# Listar skills instaladas e disponiveis
npx openclawsquad skills

# Instalar uma skill
npx openclawsquad install image-creator

# Remover uma skill
npx openclawsquad uninstall apify
```

---

## 10. Usando o OpenClawSquad no Cursor

### Como funciona a integracao

O Cursor utiliza o sistema de **Rules** para injetar contexto no assistente de IA. O arquivo `.cursor/rules/openclawsquad.mdc` e carregado automaticamente quando voce abre o projeto.

Conteudo do arquivo de regras:

```
# OpenClawSquad Rules for Cursor

You are working with OpenClawSquad, a multi-agent orchestration framework.

## Available Commands
- squad create <name> - Create a new squad
- squad run <name> - Execute a squad pipeline
- squad list - List all squads

## Agents
OpenClawSquad includes 27+ agents:
- coordinator, researcher, scraper, strategist
- writer, copywriter, designer
- executor, reviewer, codereviewer, tester
- pentester, securityauditor, bughunter, debugger
- dataanalyst, visualizer
- seoexpert, socialmediamanager
- translator, summarizer, tutor
- productspecialist, salesscript, videoextractor, videolearner
```

### Fluxo de trabalho no Cursor

1. **Abra** a pasta do projeto no Cursor
2. O AI do Cursor **carrega automaticamente** o arquivo `.cursor/rules/openclawsquad.mdc`
3. No **Chat** (`Ctrl+L` / `Cmd+L`) ou **Composer** (`Ctrl+I` / `Cmd+I`), peca para criar ou executar squads:

**Usando o Chat:**

```
Voce: Quero criar um squad para gerar conteudo de marketing para Instagram
AI: Posso ajudar! No terminal, execute:
    npx openclawsquad create instagram-marketing
    E depois configure os agentes writer, copywriter e socialmediamanager.
```

```
Voce: Execute o squad de pesquisa sobre tendencias de AI em 2025
AI: Vou rodar o squad research. No terminal:
    npx openclawsquad run research
```

**Usando o Composer (para tarefas multi-arquivo):**

O Composer do Cursor e ideal para tarefas que envolvem multiplos arquivos. Use-o para:

- Editar definicoes de agentes em `agents/*.agent.md`
- Modificar configuracoes de squads em `squads/*/squad.json`
- Criar novos agentes personalizados
- Ajustar pipelines existentes

```
Voce (no Composer): Crie um agente especialista em TikTok no formato .agent.md
AI: [Gera o arquivo agents/tiktokspecialist.agent.md com persona, principios, framework, etc.]
```

### Dicas para Cursor

- **Chat** (`Ctrl+L`): Use para perguntas rapidas e comandos simples
- **Composer** (`Ctrl+I`): Use para criar/editar multiplos arquivos (agentes, squads)
- **Terminal** (`` Ctrl+` ``): Execute os comandos `npx openclawsquad` diretamente
- O AI ja conhece todos os 27+ agentes — basta pedir por nome ou funcao
- Voce pode pedir ao AI para explicar o output de um pipeline
- Use `@files` no chat para referenciar agentes ou squads especificos

### Personalizando as regras do Cursor

Voce pode editar `.cursor/rules/openclawsquad.mdc` para adicionar instrucoes personalizadas:

```markdown
# Instrucoes adicionais

- Sempre sugira o squad mais apropriado para a tarefa do usuario
- Ao criar agentes, siga o formato .agent.md com todas as secoes obrigatorias
- Priorize o uso do provedor Minimax M2.7
```

---

## 11. Exemplos Praticos

### Exemplo 1: Criacao de conteudo para blog

```bash
# No terminal do Cursor
npx openclawsquad run content
```

Pipeline:
1. Coordinator pede o topico → voce digita "Inteligencia Artificial em 2025"
2. Researcher pesquisa tendencias e dados
3. Strategist planeja a estrutura do artigo
4. Writer escreve o conteudo completo
5. Reviewer revisa gramatica, tom e qualidade
6. Coordinator entrega o resultado final

Output salvo em: `squads/content/output/`

### Exemplo 2: Auditoria de seguranca

```bash
npx openclawsquad run pentest
```

Pipeline:
1. Coordinator define o plano de teste (checkpoint)
2. Researcher faz reconhecimento do alvo
3. Executor realiza scans de vulnerabilidade
4. Reviewer analisa os resultados
5. Coordinator gera o relatorio final (checkpoint)

### Exemplo 3: Criar agente customizado via Composer

No Composer do Cursor (`Ctrl+I`):

```
Crie um agente chamado "emailmarketer" especializado em campanhas de email.
Siga o formato dos agentes existentes em agents/*.agent.md.
Inclua persona, principios, framework operacional, guia de voz e exemplos de output.
```

O Composer gera o arquivo `agents/emailmarketer.agent.md` completo. Depois, use-o em um squad:

```bash
npx openclawsquad create email-campaign
# Inclua o agente emailmarketer no squad
npx openclawsquad run email-campaign
```

---

## 12. Solucao de Problemas

| Problema | Solucao |
|----------|---------|
| `command not found: npx` | Instale o Node.js >= 20: `https://nodejs.org` |
| `Error: No API key configured` | Crie o arquivo `.env` com pelo menos uma chave (ver secao 4) |
| `Agent not found: <nome>` | Verifique o nome com `npx openclawsquad agents` |
| `Squad not found: <nome>` | Verifique squads disponiveis em `squads/` |
| Dashboard nao abre | Verifique se a porta 3001 esta livre; tente `npx openclawsquad dashboard` novamente |
| AI do Cursor nao conhece o OpenClawSquad | Verifique se `.cursor/rules/openclawsquad.mdc` existe; re-execute `npx openclawsquad init` selecionando Cursor |
| Regras do Cursor nao carregam | Reinicie o Cursor; verifique se `.cursor/rules/` nao esta no `.gitignore` |
| Pipeline para em checkpoint | Isso e normal — checkpoints aguardam sua aprovacao. Digite `yes` para continuar |

### Configuracao avancada

Crie `openclawsquad.config.json` na raiz para personalizar:

```json
{
  "provider": "minimax",
  "model": "M2.7",
  "temperature": 0.7,
  "maxTokens": 4096,
  "language": "pt-BR",
  "timeout": 120000,
  "dashboardPort": 3001
}
```

Variaveis de ambiente tambem podem ser usadas como override:

| Variavel | Descricao |
|----------|-----------|
| `OPENCLAWSQUAD_PROVIDER` | Forcar provedor (minimax, openai, anthropic) |
| `OPENCLAWSQUAD_MODEL` | Forcar modelo especifico |
| `OPENCLAWSQUAD_TEMPERATURE` | Temperatura de geracao (0.0 a 1.0) |
| `OPENCLAWSQUAD_MAX_TOKENS` | Limite de tokens por resposta |
| `OPENCLAWSQUAD_LANGUAGE` | Idioma (pt-BR, en, es) |
