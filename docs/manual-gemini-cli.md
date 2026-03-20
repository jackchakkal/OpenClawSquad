# Manual do OpenClawSquad para Gemini CLI

Guia completo para configurar e utilizar o OpenClawSquad com o **Gemini CLI**.

---

## 1. Introducao

O OpenClawSquad e um framework de orquestracao multi-agente open source. Ele permite coordenar 27+ agentes de IA especializados (pesquisadores, redatores, revisores, pentesters, analistas de dados, etc.) em pipelines sequenciais chamados **squads**.

A integracao com o **Gemini CLI** utiliza o arquivo `GEMINI.md` na raiz do projeto. O Gemini CLI le este arquivo automaticamente como contexto, fazendo com que o assistente ja conheca todos os agentes, squads e comandos disponiveis.

### O que a integracao fornece

Ao inicializar o OpenClawSquad com suporte a Gemini CLI, o seguinte arquivo e criado:

| Arquivo | Funcao |
|---------|--------|
| `GEMINI.md` | Arquivo de contexto na raiz — o Gemini CLI le automaticamente e entende a estrutura do projeto |

O Gemini CLI procura por `GEMINI.md` no diretorio atual e o utiliza como instrucoes de sistema.

---

## 2. Pre-requisitos

Antes de comecar, certifique-se de ter:

- **Node.js** versao 20 ou superior (`node --version`)
- **Gemini CLI** instalado e funcionando (`gemini --version`)
- **Chave de API** de pelo menos um provedor de IA:
  - Minimax (M2.7) — provedor principal
  - OpenAI (GPT-4o)
  - Anthropic (Claude)
  - Ou Jan (AI local, sem chave necessaria)

### Instalar o Gemini CLI

Se ainda nao tem o Gemini CLI instalado:

```bash
npm install -g @anthropic-ai/gemini-cli
```

Ou use via npx:

```bash
npx gemini
```

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
3. **IDEs**: Selecione **Gemini CLI** na lista de IDEs

### Opcao B: Inicializacao direta

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad init
```

Durante o `init`, selecione **Gemini CLI** quando perguntado sobre IDEs. O sistema ira:

1. Criar a estrutura `_openclawsquad/` com configuracoes e memoria
2. Copiar os 27+ agentes para `agents/`
3. Copiar os squads pre-construidos para `squads/`
4. Instalar as skills disponiveis em `skills/`
5. Criar `GEMINI.md` na raiz do projeto
6. Salvar suas preferencias em `_openclawsquad/_memory/preferences.md`

### Verificacao

Apos a inicializacao, a estrutura do projeto sera:

```
meu-projeto/
├── GEMINI.md                   ← Contexto para o Gemini CLI
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

Todos os comandos podem ser executados no terminal (antes ou depois de iniciar o Gemini CLI):

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

## 10. Usando o OpenClawSquad com o Gemini CLI

### Como funciona a integracao

O Gemini CLI procura automaticamente pelo arquivo `GEMINI.md` na raiz do diretorio atual. Este arquivo contem instrucoes que o Gemini carrega como contexto de sistema, permitindo que ele entenda o projeto OpenClawSquad.

Conteudo do `GEMINI.md`:

```markdown
# OpenClawSquad — Gemini CLI Integration

You are operating inside an OpenClawSquad workspace —
a multi-agent orchestration framework.

## Available Commands
openclawsquad create <name>     # Create a new squad
openclawsquad run <squad>       # Execute a squad pipeline
openclawsquad dashboard         # Start the visual dashboard
openclawsquad agents            # List all available agents
openclawsquad skills            # List installed skills

## Agents Directory
Agent definitions live in agents/*.agent.md.

## Squads Directory
Squad configurations live in squads/.

## How to Use
1. Create a squad: openclawsquad create my-team
2. Edit the pipeline: Modify squads/my-team/squad.json
3. Run it: openclawsquad run my-team
4. Review output: Check squads/my-team/output/
```

### Fluxo de trabalho com Gemini CLI

1. **Navegue** ate a pasta do projeto no terminal:

```bash
cd meu-projeto
```

2. **Inicie** o Gemini CLI:

```bash
gemini
```

3. O Gemini **le automaticamente** o `GEMINI.md` e entende o contexto do projeto.

4. **Interaja** com o Gemini usando linguagem natural:

```
Voce: Quais squads estao disponiveis neste projeto?
Gemini: O projeto tem 4 squads pre-construidos:
        - content: Criacao de conteudo com coordinator, researcher, writer, reviewer
        - research: Pesquisa profunda com coordinator, researcher, strategist
        - automation: Automacao de tarefas com coordinator, strategist, executor, reviewer
        - pentest: Testes de seguranca com coordinator, researcher, executor, reviewer
        Voce pode executa-los com: openclawsquad run <nome>
```

```
Voce: Execute o squad de conteudo para criar um blog post sobre machine learning
Gemini: Vou executar o comando para voce:
        openclawsquad run content
```

```
Voce: Crie um novo squad focado em analise de dados
Gemini: Posso ajudar! Execute:
        openclawsquad create data-analysis
        Sugiro incluir os agentes: coordinator, researcher, dataanalyst, visualizer e reviewer.
```

### Gemini CLI com execucao de comandos

O Gemini CLI pode executar comandos diretamente no terminal. Isso significa que voce pode pedir para ele rodar os comandos do OpenClawSquad:

```
Voce: Liste todos os agentes disponiveis
Gemini: [Executa: npx openclawsquad agents]
        Aqui estao os agentes organizados por categoria:
        Coordination: coordinator
        Intelligence: researcher, scraper
        ...
```

```
Voce: Instale o agente pentester e execute o squad de seguranca
Gemini: [Executa: npx openclawsquad agents install pentester]
        Agente instalado!
        [Executa: npx openclawsquad run pentest]
        Iniciando pipeline de seguranca...
```

### Dicas para Gemini CLI

- **Contexto automatico**: Basta navegar ate a pasta do projeto e rodar `gemini` — o `GEMINI.md` e lido automaticamente
- **Execucao de comandos**: O Gemini pode executar comandos do OpenClawSquad diretamente quando voce pede
- **Leitura de arquivos**: O Gemini pode ler arquivos `.agent.md` e `squad.json` para entender a configuracao
- **Criacao de arquivos**: Peca ao Gemini para criar novos agentes ou editar squads diretamente
- **Sem estado persistente**: Cada sessao do Gemini CLI comeca do zero — o `GEMINI.md` garante que o contexto base esta sempre presente
- **Combine com o dashboard**: Inicie o dashboard em outro terminal para acompanhar visualmente enquanto usa o Gemini CLI

### Personalizando o GEMINI.md

Voce pode editar o `GEMINI.md` para adicionar instrucoes especificas do seu projeto:

```markdown
# Instrucoes adicionais do projeto

## Contexto do negocio
Este projeto e uma agencia de marketing digital focada em e-commerce.

## Preferencias
- Usar sempre o provedor Minimax M2.7
- Gerar conteudo em portugues brasileiro
- Priorizar SEO em todo conteudo criado

## Squads favoritos
- content: Para blog posts semanais
- marketing-social: Para posts em redes sociais (squad customizado)
```

---

## 11. Exemplos Praticos

### Exemplo 1: Criacao de conteudo para blog

```bash
# No terminal, antes de abrir o Gemini
npx openclawsquad run content
```

Ou dentro do Gemini CLI:

```
Voce: Preciso criar um blog post sobre as tendencias de IA para 2025.
      Execute o squad de conteudo.
Gemini: [Executa: npx openclawsquad run content]
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

```
Voce: Preciso fazer uma auditoria de seguranca no meu sistema.
Gemini: Vou executar o squad de pentest:
        [Executa: npx openclawsquad run pentest]
```

Pipeline:
1. Coordinator define o plano de teste (checkpoint)
2. Researcher faz reconhecimento do alvo
3. Executor realiza scans de vulnerabilidade
4. Reviewer analisa os resultados
5. Coordinator gera o relatorio final (checkpoint)

### Exemplo 3: Criar e executar squad customizado

```
Voce: Crie um squad de pesquisa de mercado para o setor de fintech
Gemini: [Executa: npx openclawsquad create fintech-research]
        Responda as perguntas do wizard interativo.
        Sugiro incluir: researcher, dataanalyst, strategist e summarizer.

Voce: Agora execute
Gemini: [Executa: npx openclawsquad run fintech-research]
```

### Exemplo 4: Explorar agentes pelo Gemini

```
Voce: Leia o arquivo do agente SEO Expert e me diga o que ele faz
Gemini: [Le: agents/seoexpert.agent.md]
        O SEO Expert e um especialista full-spectrum em:
        - Pesquisa de keywords
        - Auditoria tecnica (Core Web Vitals, crawlability)
        - Otimizacao on-page
        - Estrategia de link building
        - Monitoramento de rankings
        Ele segue 6 principios: user intent first, technical foundation,
        content quality over keyword density, sustainable practices,
        measure everything, competitive awareness.
```

---

## 12. Solucao de Problemas

| Problema | Solucao |
|----------|---------|
| `command not found: npx` | Instale o Node.js >= 20: `https://nodejs.org` |
| `command not found: gemini` | Instale o Gemini CLI: `npm install -g @google/gemini-cli` |
| `Error: No API key configured` | Crie o arquivo `.env` com pelo menos uma chave (ver secao 4) |
| `Agent not found: <nome>` | Verifique o nome com `npx openclawsquad agents` |
| `Squad not found: <nome>` | Verifique squads disponiveis em `squads/` |
| Dashboard nao abre | Verifique se a porta 3001 esta livre; tente `npx openclawsquad dashboard` novamente |
| Gemini nao conhece o OpenClawSquad | Verifique se `GEMINI.md` existe na raiz do projeto; re-execute `npx openclawsquad init` selecionando Gemini CLI |
| Gemini nao le o GEMINI.md | Certifique-se de estar no diretorio raiz do projeto ao executar `gemini` |
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
