# OpenClawSquad - Manual do Usuario

> Framework de orquestracao multi-agente para workflows com IA

---

## Indice

1. [O que e o OpenClawSquad?](#o-que-e-o-openclawsquad)
2. [Instalacao](#instalacao)
3. [Inicio Rapido](#inicio-rapido)
4. [Conceitos Fundamentais](#conceitos-fundamentais)
5. [Agentes Disponiveis](#agentes-disponiveis)
6. [Criando Squads](#criando-squads)
7. [Executando Pipelines](#executando-pipelines)
8. [Dashboard](#dashboard)
9. [Provedores de LLM](#provedores-de-llm)
10. [Integracao com Claude Code](#integracao-com-claude-code)
11. [Integracoes com IDEs](#integracoes-com-ides)
12. [Configuracao](#configuracao)
13. [Sistema de Skills](#sistema-de-skills)
14. [Testes e Debug](#testes-e-debug)
15. [Publicacao no npm](#publicacao-no-npm)
16. [FAQ](#faq)

---

## O que e o OpenClawSquad?

OpenClawSquad e um framework open-source de orquestracao multi-agente que permite criar equipes ("squads") de agentes de IA especializados que colaboram em tarefas complexas. Cada agente tem uma persona unica, expertise e papel definido dentro do pipeline do squad.

**Principais Funcionalidades:**
- 27+ agentes pre-construidos (pesquisador, escritor, revisor, pentester, etc.)
- Pipeline runner com checkpoints e aprovacao humana
- Suporte a multiplos provedores de LLM (Anthropic, OpenAI, Minimax)
- Dashboard em tempo real via WebSocket
- Integracoes com IDEs (Claude Code, Cursor, Codex, Windsurf, Zed)
- Sistema extensivel de skills

---

## Instalacao

### Pre-requisitos

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0
- Pelo menos uma chave de API de LLM (Anthropic, OpenAI ou Minimax)

### Instalacao Global

```bash
npm install -g openclawsquad
```

### Ou use com npx (sem instalacao)

```bash
npx openclawsquad init
```

### Verificar Instalacao

```bash
openclawsquad --version
```

---

## Inicio Rapido

### 1. Inicializar um Projeto

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad init
```

Isso vai:
- Perguntar seu idioma preferido
- Configurar integracoes de IDE
- Instalar agentes e skills pre-construidos
- Criar configuracao do projeto

### 2. Configurar Chaves de API

Crie um arquivo `.env` na raiz do projeto:

```bash
# Pelo menos uma e obrigatoria
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
MINIMAX_API_KEY=...
```

### 3. Criar Seu Primeiro Squad

```bash
npx openclawsquad create meu-time
```

Siga o wizard interativo para definir:
- Nome e objetivo do squad
- Quais agentes incluir
- Etapas do pipeline e checkpoints

### 4. Executar o Squad

```bash
npx openclawsquad run meu-time
```

### 5. Acompanhar em Tempo Real

```bash
npx openclawsquad dashboard
```

Abra `http://localhost:3001` no navegador.

---

## Conceitos Fundamentais

### Agentes

Um **agente** e uma persona de IA especializada definida em um arquivo `.agent.md`. Cada agente possui:
- **Persona**: Papel, identidade, estilo de comunicacao
- **Principios**: Regras que o agente segue
- **Framework Operacional**: Processo passo a passo
- **Guia de Voz**: Preferencias de vocabulario
- **Criterios de Qualidade**: Checklist de auto-avaliacao

### Squads

Um **squad** e um time de agentes com um pipeline definido. Squads sao configurados em `squad.json` ou `squad.yaml`:

```json
{
  "name": "conteudo",
  "description": "Squad de criacao de conteudo",
  "agents": ["coordinator", "researcher", "writer", "reviewer"],
  "pipeline": [
    { "agent": "coordinator", "action": "plan" },
    { "agent": "researcher", "action": "research", "input": "topic" },
    { "checkpoint": true, "name": "Revisar pesquisa" },
    { "agent": "writer", "action": "write", "input": "researcher" },
    { "agent": "reviewer", "action": "review", "input": "writer" }
  ]
}
```

### Pipelines

Um **pipeline** e a sequencia ordenada de etapas de um squad. As etapas podem ser:
- **Etapas de agente**: Um agente executa uma tarefa
- **Checkpoints**: Pausa para revisao/aprovacao humana

### Cadeia de Contexto

A saida de cada agente automaticamente se torna contexto para o proximo agente no pipeline. Isso cria uma cadeia de refinamento crescente.

---

## Agentes Disponiveis

### Conteudo e Marketing
| Agente | Icone | Descricao |
|--------|-------|-----------|
| Writer | ✍️ | Cria conteudo longo, artigos, posts de blog |
| Copywriter | 📝 | Copy de marketing, anuncios, landing pages |
| Strategist | 📐 | Estrategia e planejamento de marketing |
| SEO Expert | 🔎 | Otimizacao para mecanismos de busca |
| Social Media Manager | 📱 | Conteudo e estrategia para redes sociais |
| Sales Script | 💰 | Roteiros de vendas e tratamento de objecoes |

### Pesquisa e Analise
| Agente | Icone | Descricao |
|--------|-------|-----------|
| Researcher | 🔍 | Pesquisa profunda com verificacao de fontes |
| Data Analyst | 📊 | Analise de dados e insights |
| Visualizer | 📈 | Recomendacoes de visualizacao de dados |
| Summarizer | 📋 | Condensa conteudo extenso |

### Desenvolvimento e Seguranca
| Agente | Icone | Descricao |
|--------|-------|-----------|
| Architect | 🏗️ | Arquitetura e design de sistemas |
| Executor | ⚡ | Execucao de tarefas e automacao |
| Code Reviewer | 🔍 | Analise de qualidade de codigo |
| Debugger | 🔧 | Identificacao e correcao de bugs |
| Tester | 🧪 | Criacao e execucao de testes |
| Bug Hunter | 🐛 | Descoberta sistematica de bugs |
| Pentester | 🛡️ | Testes de penetracao de seguranca |
| Security Auditor | 🔐 | Auditoria de conformidade de seguranca |

### Educacao e Midia
| Agente | Icone | Descricao |
|--------|-------|-----------|
| Tutor | 🎓 | Ensino e explicacao |
| Translator | 🌐 | Traducao multi-idioma |
| Video Learner | 🎥 | Analise de conteudo em video |
| Video Extractor | 🎬 | Extracao de metadados de video |

### Operacoes
| Agente | Icone | Descricao |
|--------|-------|-----------|
| Coordinator | 🎯 | Orquestracao de pipeline |
| Reviewer | ✅ | Garantia de qualidade |
| Designer | 🎨 | Orientacao de design visual |
| Product Specialist | 🎯 | Analise de produto |
| Scraper | 🕷️ | Extracao de dados da web |

---

## Criando Squads

### Criacao Interativa

```bash
npx openclawsquad create time-marketing
```

### Criacao Manual

Crie um diretorio em `squads/` com um `squad.json`:

```bash
mkdir -p squads/meu-squad
```

```json
{
  "name": "meu-squad",
  "description": "Meu squad personalizado",
  "agents": ["researcher", "writer", "reviewer"],
  "pipeline": [
    { "agent": "researcher", "action": "research", "input": "topic" },
    { "agent": "writer", "action": "write", "input": "researcher" },
    { "checkpoint": true, "name": "Revisar rascunho" },
    { "agent": "reviewer", "action": "review", "input": "writer" }
  ]
}
```

### Squads Pre-construidos

| Squad | Descricao | Agentes |
|-------|-----------|---------|
| `content` | Criacao de conteudo | coordinator, researcher, strategist, writer, reviewer |
| `research` | Pesquisa profunda | coordinator, researcher, strategist |
| `automation` | Automacao de tarefas | coordinator, strategist, executor, reviewer |
| `pentest` | Testes de seguranca | coordinator, researcher, executor, reviewer |

---

## Executando Pipelines

### Execucao Basica

```bash
npx openclawsquad run content
```

Voce sera solicitado a descrever o objetivo. O pipeline ira:
1. Executar cada etapa de agente em ordem
2. Passar contexto entre agentes
3. Pausar nos checkpoints para sua aprovacao
4. Salvar saidas em `_openclawsquad/runs/`

### Fluxo de Execucao

```
Input do Usuario -> Agente 1 -> Agente 2 -> [Checkpoint] -> Agente 3 -> Output
                      |           |                           |
                      v           v                           v
                  output/     output/                     output/
```

### Visualizar Historico de Execucoes

```bash
npx openclawsquad runs              # Todas as execucoes
npx openclawsquad runs content      # Filtrar por squad
```

---

## Dashboard

### Iniciando o Dashboard

```bash
npx openclawsquad dashboard
```

Abre um dashboard WebSocket em tempo real em `http://localhost:3001`.

### Funcionalidades

- **Status dos Agentes**: Veja quais agentes estao ativos, concluidos ou aguardando
- **Feed de Atividades**: Log em tempo real de todas as acoes dos agentes
- **Progresso do Pipeline**: Progresso visual pelo pipeline
- **Notificacoes de Checkpoint**: Aprove/rejeite pelo dashboard

### Endpoints de API

- `GET /api/status` - Estado atual do sistema
- `GET /api/providers` - Provedores de LLM configurados

---

## Provedores de LLM

O OpenClawSquad suporta multiplos provedores de LLM. Configure sua chave de API e o sistema detecta automaticamente o provedor.

### Prioridade dos Provedores (auto-deteccao)

1. **Anthropic Claude** - `ANTHROPIC_API_KEY`
2. **OpenAI** - `OPENAI_API_KEY`
3. **Minimax** - `MINIMAX_API_KEY`

### Selecao Explicita de Provedor

```bash
# No .env
OPENCLAWSQUAD_PROVIDER=anthropic
OPENCLAWSQUAD_MODEL=claude-sonnet-4-20250514
```

### Verificar Configuracao

```bash
npx openclawsquad config
```

---

## Integracao com Claude Code

Esta e a forma recomendada de usar o OpenClawSquad com maximo poder.

### Como Funciona

O Claude Code (CLI da Anthropic) pode interagir diretamente com o OpenClawSquad porque:
1. O OpenClawSquad gera arquivos `CLAUDE.md` durante o `init` que o Claude Code le automaticamente
2. Arquivos de agente (`.agent.md`) servem como system prompts para o Claude Code
3. O pipeline runner pode ser invocado diretamente do terminal do Claude Code

### Configuracao

```bash
# 1. Inicialize o OpenClawSquad com integracao Claude Code
npx openclawsquad init
# Selecione "Claude Code" quando perguntado sobre integracoes de IDE

# 2. Inicie o Claude Code no mesmo diretorio
claude
```

O Claude Code carregara automaticamente o `CLAUDE.md` com o contexto do OpenClawSquad.

### Usando OpenClawSquad a partir do Claude Code

Dentro do Claude Code, voce pode:

```
# Criar um novo squad
> Crie um squad de conteudo para escrever posts sobre IA

# Executar um squad existente
> Execute o squad de pesquisa para analisar tendencias de mercado em veiculos eletricos

# Usar agentes individuais
> Use o agente pesquisador para encontrar dados sobre tendencias de energia renovavel

# Criar workflows personalizados
> Crie um squad com researcher, writer e reviewer para produzir
  um whitepaper tecnico sobre WebAssembly
```

### Comandos CLI Diretos pelo Claude Code

O Claude Code tem acesso ao terminal, entao voce pode pedir:

```
> Execute: npx openclawsquad run content
> Inicie o dashboard: npx openclawsquad dashboard
> Mostre os agentes disponiveis: npx openclawsquad agents
> Crie um novo squad chamado "time-seo": npx openclawsquad create time-seo
```

### Avancado: Agente-para-Agente via Claude Code

Voce pode usar o Claude Code como um meta-orquestrador:

1. Peca ao Claude Code para ler um arquivo de agente
2. O Claude Code adota a persona daquele agente
3. Executa tarefas com as diretrizes daquela persona
4. Encadeia multiplos agentes manualmente com controle total

Exemplo:
```
> Leia o agente researcher e use sua metodologia para pesquisar
  "melhores praticas para arquitetura de microsservicos". Depois leia
  o agente writer e use-o para escrever um guia completo baseado
  na pesquisa.
```

### Dicas para Melhores Resultados

1. **Sempre execute `openclawsquad init`** primeiro para gerar o CLAUDE.md
2. **Use nomes de squad** ao pedir ao Claude Code para executar pipelines
3. **Referencie nomes de agentes** para que o Claude Code use personas especificas
4. **Configure seu `.env`** para que o pipeline runner possa chamar a API do LLM
5. **Use o dashboard** junto com o Claude Code para monitoramento visual

---

## Integracoes com IDEs

### Claude Code
- Carrega automaticamente a configuracao `CLAUDE.md`
- Acesso total ao terminal para comandos CLI
- Adocao de persona de agentes

### Cursor
- Arquivos `.cursor/rules` carregados automaticamente
- Contexto de agentes disponivel no chat de IA

### Codex (OpenAI)
- Arquivo `AGENTS.md` carregado como contexto
- Compativel com Codex CLI

### Windsurf
- Configuracao de regras em `.windsurf/`
- Definicoes de agentes disponiveis

### Zed
- Configuracao em `.zed/`
- Integracao com assistente de IA

---

## Configuracao

### Arquivo de Configuracao

Crie `openclawsquad.config.json` na raiz do projeto:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.7,
  "maxTokens": 4096,
  "language": "pt-BR",
  "dashboardPort": 3001
}
```

### Variaveis de Ambiente

| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `OPENCLAWSQUAD_PROVIDER` | Provedor de LLM | auto-detect |
| `OPENCLAWSQUAD_MODEL` | Nome do modelo | padrao do provedor |
| `OPENCLAWSQUAD_TEMPERATURE` | Temperatura (0-1) | 0.7 |
| `OPENCLAWSQUAD_MAX_TOKENS` | Max tokens por resposta | 4096 |
| `OPENCLAWSQUAD_LANGUAGE` | Idioma de saida | en |

### Ordem de Prioridade

1. Variaveis de ambiente (maior)
2. `openclawsquad.config.json`
3. Valores padrao (menor)

---

## Sistema de Skills

Skills sao extensoes opcionais que adicionam funcionalidades.

### Listar Skills

```bash
npx openclawsquad skills
```

### Instalar uma Skill

```bash
npx openclawsquad install instagram-publisher
```

### Remover uma Skill

```bash
npx openclawsquad uninstall instagram-publisher
```

---

## Testes e Debug

### Verificar Setup

```bash
# Verificar configuracao e status do provedor
npx openclawsquad config

# Listar agentes disponiveis
npx openclawsquad agents

# Listar squads disponiveis
npx openclawsquad run
```

### Problemas Comuns

**"No LLM provider configured"**
- Configure pelo menos uma chave de API no `.env`
- Certifique-se que `dotenv` esta instalado: `npm install dotenv`

**"Squad not found"**
- Verifique se o diretorio do squad existe em `squads/`
- Certifique-se que possui um `squad.json` ou `squad.yaml`

**"Agent not found"**
- Verifique se o ID do agente no `squad.json` corresponde a um arquivo em `agents/`
- Execute `npx openclawsquad agents` para ver agentes disponiveis

**Dashboard nao carrega**
- Verifique se a porta 3001 esta disponivel
- Tente uma porta diferente via configuracao

---

## Publicacao no npm

### Compatibilidade com npm Free Tier

O OpenClawSquad e totalmente compativel com o npm free tier:
- Pacote publico (`publishConfig.access: "public"`)
- Licenca MIT
- Sem requisitos de registry privado
- Todas as dependencias sao pacotes publicos

### Como Publicar

```bash
npm login
npm publish --access public
```

---

## FAQ

**P: Preciso de todas as tres chaves de API?**
R: Nao, apenas uma. O sistema detecta automaticamente qual provedor usar baseado nas chaves disponiveis.

**P: Posso usar LLMs locais?**
R: Ainda nao nativamente, mas voce pode usar qualquer API compativel com OpenAI configurando `OPENAI_API_KEY` e apontando para seu endpoint local.

**P: Quanto custa executar um squad?**
R: Os custos dependem do seu provedor de LLM. Uma execucao tipica de squad de conteudo usa ~5.000-15.000 tokens por etapa de agente.

**P: Posso criar agentes personalizados?**
R: Sim! Crie um arquivo `.agent.md` seguindo a estrutura padrao e coloque-o em `agents/` ou no diretorio `agents/` do seu squad.

**P: Meus dados sao enviados para servicos externos?**
R: Apenas para o provedor de LLM configurado. Nenhuma telemetria ou analitica e coletada.

**P: Os agentes podem executar em paralelo?**
R: Atualmente, os agentes executam sequencialmente no pipeline. Execucao paralela esta planejada para uma versao futura.

---

## Licenca

Licenca MIT - Veja [LICENSE](LICENSE) para detalhes.

## Contribuicao

Contribuicoes sao bem-vindas! Veja o [repositorio no GitHub](https://github.com/jackchakkal/OpenClawSquad) para issues e pull requests.
