# OpenClawSquad - Manual do Usuario

> Framework de orquestracao multi-agente para workflows com IA

---

## Indice

1. [O que e o OpenClawSquad?](#o-que-e-o-openclawsquad)
2. [Instalacao](#instalacao)
3. [Inicio Rapido](#inicio-rapido)
4. [Exemplos Praticos](#exemplos-praticos)
5. [Conceitos Fundamentais](#conceitos-fundamentais)
6. [Agentes Disponiveis](#agentes-disponiveis)
7. [Criando Squads](#criando-squads)
8. [Executando Pipelines](#executando-pipelines)
9. [Dashboard](#dashboard)
10. [Provedores de LLM](#provedores-de-llm)
11. [Integracao com Claude Code](#integracao-com-claude-code)
12. [Integracoes com IDEs](#integracoes-com-ides)
13. [Configuracao](#configuracao)
14. [Sistema de Skills](#sistema-de-skills)
15. [Testes e Debug](#testes-e-debug)
16. [Publicacao no npm](#publicacao-no-npm)
17. [FAQ](#faq)

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

### 1. Iniciar o Wizard de Configuracao

```bash
mkdir meu-projeto && cd meu-projeto
npx openclawsquad start
```

O wizard interativo vai guiar voce por:
- **Selecao de modo** — Terminal CLI ou Dashboard no Browser
- **Configuracao de chave de API** — informe sua chave uma vez, salva globalmente
- **Integracao com IDE** — conecte ao Cursor, Claude Code, Codex, etc.

Nenhuma edicao de arquivo `.env` necessaria. Sua chave de API e salva automaticamente em `~/.openclawsquad/keys.json` e carregada em toda execucao.

### 2. Configurar Chaves de API (apenas na primeira vez)

Durante o `npx openclawsquad start`, voce sera solicitado:

```
Step 2/3 — Configure your LLM provider

? Which LLM provider do you want to configure?
  > Anthropic (Claude) — Recomendado - https://console.anthropic.com/
    OpenAI (GPT) — https://platform.openai.com/
    Minimax (M2.7) — https://platform.minimax.io/
    Skip (configure later)

? Enter your Anthropic (Claude) API key: **********************

  [OK] API key saved to /home/seuusuario/.openclawsquad/keys.json
  Provider will be auto-detected on every run.
```

Para atualizar ou adicionar uma chave depois, execute `npx openclawsquad start` novamente.

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

## Exemplos Praticos

Tres exemplos reais de como usar o OpenClawSquad para resolver problemas e gerar renda.

---

### Exemplo 1 — Agencia de Marketing de Conteudo

**Cenario:** Voce oferece servicos de criacao de conteudo para clientes. Cada cliente precisa de posts de blog SEO semanais mais legendas para redes sociais. Fazer isso manualmente leva 4 a 6 horas por cliente.

**Com o OpenClawSquad:** Automatize o pipeline completo — pesquisa, estrategia, redacao, revisao e adaptacao para redes sociais — em minutos.

**Configuracao:**

```bash
mkdir agencia-conteudo && cd agencia-conteudo
npx openclawsquad start
npx openclawsquad create pipeline-blog
```

Ao criar o squad, adicione estes agentes em ordem:
1. `researcher` — coleta dados, estatisticas e concorrentes do topico
2. `strategist` — define angulo, publico-alvo e foco de palavras-chave
3. `writer` — escreve o artigo completo otimizado para SEO
4. `reviewer` — verifica qualidade, clareza e pontuacao SEO
5. `copywriter` — adapta os pontos principais para Instagram, LinkedIn e X

**Executando:**

```bash
npx openclawsquad run pipeline-blog
```

Quando solicitado o objetivo, informe:

```
Escreva um post de blog SEO de 1500 palavras para uma empresa SaaS que vende
software de gestao de projetos. Palavra-chave alvo: "melhores ferramentas de
gestao de projetos para times remotos 2025". Tom: profissional mas acessivel.
Inclua estatisticas e um CTA claro.
```

**Resultado:** Um artigo completo + 3 legendas para redes sociais prontos para publicar, salvos em `_openclawsquad/runs/`.

**Modelo de negocio:** Cobre R$1.500–4.000 por cliente/mes para posts semanais. Com 5 clientes e 10 minutos de trabalho por artigo, isso representa R$7.500–20.000/mes.

---

### Exemplo 2 — Servico de Auditoria de Seguranca Automatizada

**Cenario:** Pequenas empresas precisam de auditorias de seguranca mas nao podem pagar consultores caros. Voce oferece relatorios de seguranca por R$2.500–7.500 cada.

**Com o OpenClawSquad:** O squad `pentest` produz um relatorio estruturado de seguranca cobrindo analise de superficie de ataque, identificacao de vulnerabilidades e recomendacoes de correcao.

**Configuracao:**

```bash
mkdir servico-seguranca && cd servico-seguranca
npx openclawsquad start
```

Use o squad `pentest` pre-construido (ja incluido):

```bash
npx openclawsquad run pentest
```

Informe os detalhes do alvo quando solicitado:

```
Realize uma auditoria de seguranca para um e-commerce pequeno construido em
WordPress. O site aceita pagamentos por cartao de credito via Stripe. Identifique
vulnerabilidades comuns, configuracoes incorretas e forneca etapas priorizadas de
correcao. Foco nas vulnerabilidades do OWASP Top 10.
```

**O que o pipeline faz:**
1. `coordinator` — estrutura o escopo e metodologia da auditoria
2. `researcher` — identifica vulnerabilidades conhecidas para o stack tecnologico
3. `executor` — percorre sistematicamente o checklist OWASP
4. `reviewer` — valida os achados e remove falsos positivos

**Resultado:** Um relatorio profissional de seguranca em Markdown de 8 a 12 paginas, pronto para converter em PDF e entregar ao cliente.

**Modelo de negocio:** Oferta auditorias por R$2.500–7.500 cada. Com 4 auditorias por mes, usando 30 minutos por auditoria para revisao e personalizacao, isso representa R$10.000–30.000/mes.

---

### Exemplo 3 — Relatorios de Pesquisa de Mercado para Startups

**Cenario:** Fundadores e investidores precisam de pesquisa de mercado rapida antes de tomar decisoes. Empresas tradicionais de pesquisa cobram R$15.000–50.000 por relatorio e levam semanas.

**Com o OpenClawSquad:** Produza um relatorio abrangente de analise de mercado em menos de uma hora por uma fracao do custo.

**Configuracao:**

```bash
mkdir pesquisa-mercado && cd pesquisa-mercado
npx openclawsquad start
npx openclawsquad create relatorio-mercado
```

Construa o squad com:
1. `researcher` — mapeia o mercado, players e tendencias
2. `data-analyst` — interpreta dados, tamanho do mercado e taxas de crescimento
3. `strategist` — identifica oportunidades, ameacas e posicionamento
4. `summarizer` — produz o resumo executivo e principais conclusoes
5. `writer` — formata o relatorio completo com secoes claras

**Executando:**

```bash
npx openclawsquad run relatorio-mercado
```

Informe o briefing da pesquisa:

```
Crie um relatorio de pesquisa de mercado para o setor de legaltech movido a IA
no Brasil. Inclua: tamanho do mercado e projecoes de crescimento, top 5 concorrentes
com analise, principais dores dos clientes, cenario regulatorio e 3 oportunidades
estrategicas para um novo entrante com budget seed de R$1 milhao.
```

**Resultado:** Um relatorio de 15 a 20 paginas estruturado com resumo executivo, analise competitiva, matriz de oportunidades e recomendacoes — pronto para entregar ou usar em suas proprias decisoes.

**Modelo de negocio:** Oferta relatorios por R$1.000–4.000 cada dependendo da profundidade. Venda para: aceleradoras, VCs, fundadores de startups, corporacoes explorando novos mercados. Com 8 relatorios por mes a R$2.000 em media, isso representa R$16.000/mes.

---

#### Exemplo 4 — Carrossel Instagram: Pipeline HTML-para-Imagem (Somente Texto)

**O que faz:** Cria carrosseis educativos para Instagram usando HTML/CSS renderizado em imagens PNG. Nao precisa de habilidades de design — a IA cuida do layout, tipografia e cores.

**Squad:** `carousel-creator`

**Pipeline:**
1. `strategist` — define o topico do carrossel, angulo do gancho, divisao dos slides (5–8 slides)
2. `copywriter` — escreve o texto de cada slide (conciso, que prenda a atencao)
3. `designer` — cria HTML/CSS para cada slide em 1080×1440, usa a skill `image-creator` para renderizar em PNG
4. `reviewer` — verifica qualidade visual, legibilidade do texto, consistencia da marca
5. `socialmediamanager` — escreve a legenda com hashtags, otimizada para engajamento

**Detalhe tecnico:** O agente designer usa a skill `image-creator`. Cada slide e um arquivo HTML independente com CSS inline (Google Fonts via `@import`, fundos com gradiente, tipografia grande). O Playwright renderiza cada um em viewport 1080×1440. Se o Playwright/image-creator nao estiver disponivel, o designer gera prompts detalhados para cada slide — descrevendo layout, cores, tipografia e conteudo de texto.

**Executando:**

```bash
npx openclawsquad run carousel-creator
```

Insira o objetivo:

```
Crie um carrossel de 7 slides para Instagram sobre "5 Habitos Matinais Que Mudaram Minha Vida".
Estilo: minimalista, fundo escuro (#1a1a2e), cor de destaque #e94560,
fonte: Inter. Cada slide deve ter um ponto-chave com uma breve explicacao.
Slide 1: gancho. Slide 7: CTA. Renderizar como imagens em 1080x1440.
```

**Resultado:** 7 imagens PNG prontas para upload como carrossel no Instagram, mais legenda com hashtags.

**Modelo de negocio:** Oferte criacao de carrosseis por R$250–R$750 por carrossel. Publico: coaches, consultores, marcas pessoais. Com 20 carrosseis/mes a R$400 em media, isso representa R$8.000/mes.

---

#### Exemplo 5 — Campanha de Lancamento no Instagram com Fallback de Imagem

**O que faz:** Planeja e cria uma campanha coordenada no Instagram para lancamento de produto — posts teaser, carrossel de lancamento e conteudo de acompanhamento. Quando fotografia de produto e necessaria (nao renderizavel pela IA), gera prompts de imagem estruturados com especificacoes exatas.

**Squad:** `instagram-launch`

**Pipeline:**
1. `researcher` — analisa lancamentos de concorrentes e formatos em alta no Instagram
2. `strategist` — planeja sequencia de 5 posts (2 teasers, 1 carrossel de lancamento, 2 follow-ups)
3. `copywriter` — escreve o copy de cada post
4. `designer` — cria assets visuais usando `image-creator`; para posts que precisam de fotos de produto, gera prompts de imagem com especificacoes exatas
5. `socialmediamanager` — finaliza legendas, estrategia de hashtags e cronograma de postagens; usa `instagram-publisher` para publicar quando pronto

**Comportamento de fallback:** Quando o designer nao consegue renderizar uma imagem (ex: fotografia de produto necessaria, ou Playwright indisponivel), ele gera um bloco de prompt estruturado:

```
[PROMPT DE IMAGEM - Slide 3]
Proporcao: 1080x1350 (4:5)
Fundo: foto de produto de [item] em superficie de marmore branco
Texto overlay: "Disponivel Agora" em Montserrat Bold 58px, cor #2d3436
Layout: produto centralizado, texto no terco inferior
Estilo: limpo, minimalista, sensacao de luxo
```

**Executando:**

```bash
npx openclawsquad run instagram-launch
```

Insira o objetivo:

```
Planeje e crie uma campanha de 5 posts no Instagram para lancar uma nova linha de
cosmeticos organicos. Cores da marca: #2d3436 e #dfe6e9. Tom: limpo, luxo, minimalista.
Incluir 2 teasers, 1 carrossel de lancamento (5 slides) e 2 posts de acompanhamento.
```

**Resultado:** 5 posts completos com legendas, hashtags e assets visuais (ou prompts de imagem para fotografia).

**Modelo de negocio:** Oferte campanhas de lancamento por R$1.500–R$4.000 por campanha. Publico: marcas de e-commerce, startups DTC. Com 4 campanhas/mes a R$2.500, isso representa R$10.000/mes.

---

#### Exemplo 6 — Serie de Conteudo LinkedIn para Thought Leadership

**O que faz:** Cria uma semana completa de conteudo no LinkedIn para profissionais B2B — um post longo, um carrossel (slides estilo PDF) e uma enquete. Tudo otimizado para o algoritmo do LinkedIn.

**Squad:** `linkedin-authority`

**Pipeline:**
1. `researcher` — identifica topicos em alta no setor-alvo a partir do LinkedIn, noticias e posts de concorrentes
2. `strategist` — escolhe o tema da semana, mapeia para 3 formatos de conteudo (post longo, carrossel, enquete)
3. `writer` — escreve o post longo do LinkedIn (gancho na primeira linha, estrutura de storytelling, CTA)
4. `designer` — cria slides do carrossel como HTML renderizado em 1200×627 (otimo para LinkedIn); gera slides estilo PDF com dados, citacoes e frameworks
5. `socialmediamanager` — escreve a pergunta da enquete com 4 opcoes, agenda os 3 posts ao longo da semana nos melhores horarios (Ter/Qua/Qui de manha)

**Executando:**

```bash
npx openclawsquad run linkedin-authority
```

Insira o objetivo:

```
Crie uma semana de conteudo no LinkedIn para um CEO de fintech. Topico: "Por que a maioria
das startups falha em vendas B2B." Formato: 1 post longo (terca), 1 carrossel com 6 slides
(quarta), 1 enquete (quinta). Tom: confiante mas acessivel. Incluir dados
e uma visao contraria.
```

**Resultado:** 3 pecas de conteudo prontas para publicar no LinkedIn: um post longo (~1.200 palavras), um carrossel de 6 slides (como imagens ou HTML) e uma enquete com 4 opcoes.

**Modelo de negocio:** Oferte pacotes semanais de LinkedIn por R$1.000–R$2.500/semana. Publico: fundadores B2B, executivos, consultores. Com 6 clientes a R$1.500/semana, isso representa R$36.000/mes.

---

#### Exemplo 7 — Thread no X (Twitter) + Pipeline de Repurpose de Newsletter

**O que faz:** Pega uma edicao de newsletter e transforma em uma thread no X (Twitter) com imagens de citacao. Maximiza o alcance transformando um unico conteudo em formatos nativos e compartilhaveis para cada plataforma.

**Squad:** `content-repurpose`

**Pipeline:**
1. `summarizer` — le o conteudo da newsletter e extrai 5–7 insights-chave, preservando a voz original
2. `copywriter` — transforma cada insight em um post de tamanho de tweet (280 caracteres max) formando uma thread coerente; adiciona tweet de gancho e tweet de CTA no final
3. `designer` — cria 3 imagens de citacao (1200×675 para X) a partir dos insights mais compartilhaveis usando `image-creator`; se a criacao de imagem falhar, gera prompts para cada grafico
4. `socialmediamanager` — monta a thread final com tweets numerados, determina quais tweets recebem a imagem de citacao e sugere o melhor horario para postar

**Executando:**

```bash
npx openclawsquad run content-repurpose
```

Insira o objetivo:

```
Transforme esta newsletter em uma thread no X (Twitter) com graficos de citacao:
[cole o conteudo da newsletter ou forneca o caminho do arquivo]
Estilo da thread: insights numerados, tom conversacional. Crie 3 cards de citacao
em 1200x675 com os insights mais compartilhaveis. Cores da marca: #1DA1F2 destaque
em fundo escuro.
```

**Resultado:** Uma thread completa (8–12 tweets) com 3 imagens de citacao, pronta para postar.

**Modelo de negocio:** Oferte pacotes de repurpose por R$500–R$1.250 por newsletter. Publico: escritores de newsletter, criadores de conteudo, thought leaders. Com 15 conversoes/mes a R$750, isso representa R$11.250/mes.

---

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

As chaves sao armazenadas em `~/.openclawsquad/keys.json` e carregadas automaticamente. Para adicionar ou alterar uma chave, execute `npx openclawsquad start`.

### Selecao Explicita de Provedor

Adicione ao `openclawsquad.config.json` na raiz do projeto:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514"
}
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

1. **Sempre execute `openclawsquad start`** primeiro para gerar o CLAUDE.md e configurar sua chave de API
2. **Use nomes de squad** ao pedir ao Claude Code para executar pipelines
3. **Referencie nomes de agentes** para que o Claude Code use personas especificas
4. **Use o dashboard** junto com o Claude Code para monitoramento visual

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
- Execute `npx openclawsquad start` e siga a etapa de configuracao de chave de API
- Sua chave e armazenada em `~/.openclawsquad/keys.json` e carregada automaticamente

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
