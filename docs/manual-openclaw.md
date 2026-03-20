# Manual do OpenClawSquad para OpenClaw

Guia completo para configurar e utilizar o OpenClawSquad dentro do **OpenClaw**.

---

## 1. Introducao

O OpenClawSquad e um framework de orquestracao multi-agente open source. Ele permite coordenar 27+ agentes de IA especializados (pesquisadores, redatores, revisores, pentesters, analistas de dados, etc.) em pipelines sequenciais chamados **squads**.

A integracao com o **OpenClaw** permite que o assistente de IA do editor conheca automaticamente os agentes, squads e comandos disponiveis no seu projeto — bastando abrir a pasta no OpenClaw para comecar a orquestrar tarefas via chat.

### O que a integracao fornece

Ao inicializar o OpenClawSquad com suporte a OpenClaw, dois arquivos sao criados:

| Arquivo | Funcao |
|---------|--------|
| `.openclaw/config.json` | Configuracao do workspace: diretorios de agentes, squads, skills e comandos mapeados |
| `.openclaw/SKILL.md` | Instrucoes para o AI do OpenClaw sobre como usar o OpenClawSquad |

O AI do OpenClaw le esses arquivos automaticamente e passa a entender a estrutura do projeto.

---

## 2. Pre-requisitos

Antes de comecar, certifique-se de ter:

- **Node.js** versao 20 ou superior (`node --version`)
- **OpenClaw** instalado e funcionando
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
3. **IDEs**: Selecione **OpenClaw** na lista de IDEs

### Opcao B: Inicializacao direta

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad init
```

Durante o `init`, selecione **OpenClaw** quando perguntado sobre IDEs. O sistema ira:

1. Criar a estrutura `_openclawsquad/` com configuracoes e memoria
2. Copiar os 27+ agentes para `agents/`
3. Copiar os squads pre-construidos para `squads/`
4. Instalar as skills disponíveis em `skills/`
5. Criar `.openclaw/config.json` e `.openclaw/SKILL.md`
6. Salvar suas preferencias em `_openclawsquad/_memory/preferences.md`

### Verificacao

Apos a inicializacao, a estrutura do projeto sera:

```
meu-projeto/
├── .openclaw/
│   ├── config.json          ← Configuracao do workspace OpenClaw
│   └── SKILL.md             ← Instrucoes para o AI
├── _openclawsquad/
│   ├── _memory/
│   │   └── preferences.md   ← Suas preferencias
│   └── runs/                ← Historico de execucoes
├── agents/                  ← 27+ definicoes de agentes (.agent.md)
├── squads/                  ← Squads pre-construidos
│   ├── content/
│   ├── research/
│   ├── automation/
│   └── pentest/
├── skills/                  ← Skills instaladas
├── dashboard/               ← Dashboard web
└── .env                     ← Suas chaves de API
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

Todos os comandos podem ser executados no terminal integrado do OpenClaw:

| Comando | Descricao |
|---------|-----------|
| `npx openclawsquad start` | Wizard interativo de configuracao |
| `npx openclawsquad init` | Inicializar OpenClawSquad na pasta atual |
| `npx openclawsquad create <nome>` | Criar um novo squad interativamente |
| `npx openclawsquad run <squad>` | Executar o pipeline de um squad |
| `npx openclawsquad dashboard` | Iniciar o dashboard em tempo real |
| `npx openclawsquad agents` | Listar agentes disponíveis |
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

Em um terminal, inicie o dashboard. Em outro terminal, execute um squad:

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

## 10. Usando o OpenClawSquad no OpenClaw

### Como funciona a integracao

Quando voce abre o projeto no OpenClaw, o editor carrega automaticamente:

1. **`.openclaw/config.json`** — Configura o workspace com os diretorios e comandos:

```json
{
  "name": "OpenClawSquad",
  "version": "1.0.0",
  "description": "Multi-agent orchestration workspace powered by OpenClawSquad",
  "agents_dir": "agents",
  "squads_dir": "squads",
  "skills_dir": "skills",
  "commands": {
    "create": "openclawsquad create",
    "run": "openclawsquad run",
    "dashboard": "openclawsquad dashboard",
    "agents": "openclawsquad agents",
    "skills": "openclawsquad skills"
  },
  "context_files": [
    "_openclawsquad/_memory/preferences.md",
    "agents/*.agent.md",
    "squads/*/squad.json"
  ]
}
```

2. **`.openclaw/SKILL.md`** — Instrui o AI sobre os comandos, a estrutura do workspace e como orquestrar agentes.

### Fluxo de trabalho no OpenClaw

1. **Abra** a pasta do projeto no OpenClaw
2. O AI do OpenClaw **le automaticamente** os arquivos `.openclaw/` e entende o contexto
3. No **chat do AI**, peca para criar ou executar squads:

```
Voce: Crie um squad de marketing para Instagram e LinkedIn
AI: Vou criar o squad... [executa npx openclawsquad create marketing-social]
```

```
Voce: Execute o squad de conteudo para escrever um blog sobre IA generativa
AI: Executando o squad content... [executa npx openclawsquad run content]
```

```
Voce: Quais agentes estao disponiveis para seguranca?
AI: Os agentes de seguranca sao: pentester, securityauditor, bughunter, debugger...
```

### Dicas para OpenClaw

- O AI ja conhece todos os 27+ agentes e seus papeis — basta pedir
- Use linguagem natural: "Quero pesquisar sobre X e gerar um relatorio"
- O AI pode sugerir qual squad usar baseado na sua necessidade
- Os arquivos `context_files` no config.json garantem que o AI tem acesso as preferencias e definicoes de agentes

---

## 11. Exemplos Praticos

### Exemplo 1: Criacao de conteudo para blog

```bash
# Executar o squad de conteudo
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
# Executar o squad de pentest
npx openclawsquad run pentest
```

Pipeline:
1. Coordinator define o plano de teste (checkpoint)
2. Researcher faz reconhecimento do alvo
3. Executor realiza scans de vulnerabilidade
4. Reviewer analisa os resultados
5. Coordinator gera o relatorio final (checkpoint)

### Exemplo 3: Squad customizado de marketing digital

```bash
# Criar um squad novo
npx openclawsquad create marketing-digital

# Responda as perguntas:
# - Proposito: Criar campanhas de marketing digital
# - Publico: Pequenas empresas
# - Modo: high
# - Plataformas: Instagram, LinkedIn, Blog

# Executar
npx openclawsquad run marketing-digital
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
| OpenClaw nao reconhece o projeto | Verifique se `.openclaw/config.json` existe; re-execute `npx openclawsquad init` selecionando OpenClaw |
| Pipeline para em checkpoint | Isso e normal — checkpoints aguardam sua aprovacao. Digite `yes` para continuar |
| `ENOENT: no such file or directory` | Execute `npx openclawsquad init` para criar a estrutura do projeto |

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
