# 🦞 OpenClawSquad

Framework de orquestração multi-agente de código aberto. Alternativa completa ao opensquad.

## 🚀 Quick Start

```bash
# Clonar o repositório
git clone https://github.com/jackchakkal/OpenClawSquad.git
cd OpenClawSquad

# Iniciar
npm install
node bin/cli.js init

# Criar um squad
node bin/cli.js create meu-squad

# Executar
node bin/cli.js run meu-squad

# Abrir Dashboard
node bin/cli.js dashboard
```

## 📦 O que vem incluído

### CLI Completa
- `init` - Inicializar projeto
- `create <nome>` - Criar squad dinamicamente
- `run <nome>` - Executar squad
- `list` - Listar squads
- `dashboard` - Abrir escritório virtual 2D

### Sistema de Pipeline
- Execução automática de agentes
- Checkpoints com aprovação humana
- Estado persistente

### Skills Executáveis
- `image-creator` - Renderiza HTML → Imagem (via Playwright)
- `instagram-publisher` - Publica no Instagram (via Graph API)
- `apify` - Web scraping
- `image-fetcher` - Busca imagens

### Dashboard 2D
- Visualização dos agentes em tempo real
- Status: idle/working/done/error
- Pipeline visual
- Checkpoints visuais
- Console de logs
- Conexão WebSocket

### Arquitetura de Agentes
27 agentes com formato rico:
- Persona (Role, Identity, Communication Style)
- Principles
- Operational Framework
- Voice Guidance
- Output Examples
- Anti-Patterns
- Quality Criteria
- Integration

## 📁 Estrutura

```
openclawsquad/
├── bin/
│   └── cli.js              # CLI principal
├── src/
│   ├── pipeline-runner.js   # Executor de pipeline
│   ├── squad-creator.js    # Criador dinâmico de squads
│   └── dashboard-server.js  # Servidor WebSocket
├── skills/
│   ├── image-creator/      # Skill de renderização
│   ├── instagram-publisher/ # Skill de publicação
│   └── ...
├── agents/                  # Agentes do sistema
├── best-practices/          # Guias por plataforma
├── dashboard/               # Dashboard 2D
├── squads/                 # Squads criados
└── package.json
```

## 🎯 Criar um Squad

```bash
node bin/cli.js create meu-squad
```

O Architect vai perguntar:
1. Propósito do squad
2. Público-alvo
3. Modo (Alta Performance / Econômico)
4. Plataformas (Instagram, LinkedIn, etc)

E criará automaticamente:
- Arquivos de agentes
- Pipeline com checkpoints
- Estrutura de diretórios

## ⚡ Executar um Squad

```bash
node bin/cli.js run meu-squad
```

O pipeline executará:
1. Researcher → checkpoint
2. Strategist → checkpoint
3. Creator → checkpoint
4. Reviewer → checkpoint → done

## 📺 Dashboard

```bash
node bin/cli.js dashboard
```

Acesse: http://localhost:3000

**Features:**
- Visualização 2D dos agentes
- Status em tempo real
- Pipeline visual
- Checkpoints interativos
- Console de logs
- Conexão WebSocket com servidor

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Instagram Publisher
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
IMGBB_API_KEY=

# Apify
APIFY_TOKEN=
```

### Criar .env

```bash
cp .env.example .env
# Edite com suas chaves
```

## 🤖 Agentes Disponíveis

| Categoria | Agentes |
|-----------|---------|
| Coordenação | Coordinator |
| Inteligência | Researcher, Scraper |
| Planejamento | Strategist |
| Conteúdo | Writer, Copywriter |
| Design | Designer |
| Execução | Executor |
| Qualidade | Reviewer, CodeReviewer, Tester |
| Segurança | Pentester, SecurityAuditor, BugHunter |
| Desenvolvimento | Architect, Debugger |
| Dados | DataAnalyst, Visualizer |
| Marketing | SEOExpert, SocialMediaManager |
| Comunicação | Translator, Summarizer, Tutor |
| Especialistas | ProductSpecialist, SalesScript |
| Multimídia | VideoExtractor, VideoLearner |

## 📚 Best Practices

Guias por plataforma incluídos:
- Instagram Feed, Reels, Stories
- LinkedIn Post, Article
- Twitter Post, Thread
- YouTube Script, Shorts
- Blog Post, SEO
- Email Newsletter, Sales
- WhatsApp Broadcast

## 🔄 Diferenças do Opensquad

| Feature | Opensquad | OpenClawSquad |
|---------|-----------|----------------|
| CLI | ✅ | ✅ |
| Pipeline Runner | ✅ | ✅ |
| Checkpoints | ✅ | ✅ |
| Skills | ✅ | ✅ |
| Dashboard 2D | ✅ | ✅ |
| Integração Claude | ✅ | ⚠️ Requer setup |
| Open Source | ❌ | ✅ |

## 📄 Licença

MIT - Livre para usar e modificar.

---

**Desenvolvido por:** Jack Chakkal  
**GitHub:** https://github.com/jackchakkal/OpenClawSquad
