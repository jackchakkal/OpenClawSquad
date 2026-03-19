# 🦞 OpenClawSquad

<p align="center">
  <strong>Multi-agent orchestration framework — open source alternative to opensquad</strong>
</p>

<p align="center">
  <a href="https://github.com/jackchakkal/OpenClawSquad/stargazers">
    <img src="https://img.shields.io/github/stars/jackchakkal/OpenClawSquad?style=flat" alt="Stars">
  </a>
  <a href="https://github.com/jackchakkal/OpenClawSquad/issues">
    <img src="https://img.shields.io/github/issues/jackchakkal/OpenClawSquad" alt="Issues">
  </a>
  <a href="https://npmjs.com/package/openclawsquad">
    <img src="https://img.shields.io/npm/v/openclawsquad" alt="NPM">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  </a>
</p>

<p align="center">
  <a href="./GETTING_STARTED.md">📖 Guia de Início (PT-BR) — Getting Started Guide</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **27+ Pre-built Agents** | Coordinator, Researcher, Writer, Copywriter, Reviewer, Security, Data, Marketing, and more! |
| 📊 **Real-time Dashboard** | WebSocket-powered 2D visualization of agent workflows |
| 🖥️ **IDE Integrations** | Claude Code, Codex, Cursor, Windsurf, Zed, Jan |
| ⚡ **Dynamic Squads** | Create squads on-demand with the Architect agent |
| 🔄 **Pipeline Runner** | Execute workflows with checkpoints and handoffs |
| 🌐 **Multi-platform** | Support for Instagram, LinkedIn, Twitter, YouTube, and more |
| 📦 **Skills System** | Extensible skill framework (image-creator, instagram-publisher, etc.) |

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g openclawsquad

# Initialize in a folder
mkdir my-project && cd my-project
npx openclawsquad init

# Create a squad
npx openclawsquad create my-team

# Run it
npx openclawsquad run my-team

# Start dashboard
npx openclawsquad dashboard
```

### Without Installation

```bash
npx openclawsquad init
npx openclawsquad create my-team
npx openclawsquad run my-team
```

---

## 📖 Usage

### Commands

| Command | Description |
|---------|-------------|
| `npx openclawsquad init` | Initialize OpenClawSquad in current folder |
| `npx openclawsquad create <name>` | Create a new squad |
| `npx openclawsquad run <squad>` | Execute a squad pipeline |
| `npx openclawsquad dashboard` | Start the real-time dashboard |
| `npx openclawsquad skills` | List installed skills |
| `npx openclawsquad agents` | List available agents |
| `npx openclawsquad runs` | View execution history |
| `npx openclawsquad --help` | Show help |

### Creating Squads

```bash
# Interactive mode
npx openclawsquad create marketing-team

# Define agents
- researcher (gathers info)
- writer (creates content)
- copywriter (marketing)
- designer (visuals)
- reviewer (quality)
```

---

## 🤖 Available Agents

### Coordination
- **Coordinator** - Orchestrates squad workflows

### Intelligence  
- **Researcher** - Search and gather information
- **Scraper** - Web scraping specialist

### Planning
- **Strategist** - Planning and strategy

### Content
- **Writer** - Content creation
- **Copywriter** - Marketing copy
- **Designer** - Design specialist

### Execution
- **Executor** - Execute tasks

### Quality
- **Reviewer** - Quality assurance
- **Code Reviewer** - Code review
- **Tester** - Testing specialist

### Security
- **Pentester** - Security testing
- **Security Auditor** - Security audit
- **Bug Hunter** - Bug hunting
- **Debugger** - Debugging

### Data
- **Data Analyst** - Data analysis
- **Visualizer** - Data visualization

### Marketing
- **SEO Expert** - SEO optimization
- **Social Media Manager** - Social media

### Communication
- **Translator** - Translation
- **Summarizer** - Summarization
- **Tutor** - Teaching

### Specialists
- **Product Specialist** - Product expertise
- **Sales Script** - Sales scripting
- **Video Extractor** - Video extraction
- **Video Learner** - Video learning

---

## 🖥️ IDE Integrations

OpenClawSquad supports multiple IDEs:

| IDE | Configuration |
|-----|---------------|
| **Claude Code** | `.claude/skills/openclawsquad/` |
| **Codex** | `.agents/skills/openclawsquad/` |
| **Cursor** | `.cursor/rules/openclawsquad.mdc` |
| **Windsurf** | `.windsurf/rules/openclawsquad.md` |
| **Zed** | `.zed/openclawsquad.json` |
| **Jan** (local AI) | Local AI integration |

---

## 📦 Skills

OpenClawSquad includes built-in skills:

- **apify** - Web scraping and automation
- **canva** - Design integration  
- **image-creator** - HTML/CSS to image rendering
- **image-fetcher** - Web image search
- **instagram-publisher** - Publish to Instagram

Install more:
```bash
npx openclawsquad install <skill-name>
```

---

## 📊 Dashboard

Start the real-time dashboard:

```bash
npx openclawsquad dashboard
```

Then open http://localhost:3001 in your browser.

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# OpenAI
OPENAI_API_KEY=your-key

# Anthropic (Claude)
ANTHROPIC_API_KEY=your-key

# Or use local AI with Jan
JAN_API_URL=http://localhost:1337
JAN_MODEL=llama-3.3-70b-instruct
```

### Squad Configuration

Edit `squads/<name>/squad.yaml`:

```yaml
name: my-squad
description: Marketing content creation
mode: high

agents:
  - id: researcher
  - id: writer
  - id: copywriter
```

---

## 📁 Project Structure

```
my-project/
├── _openclawsquad/       # OpenClawSquad config
│   ├── _memory/          # Preferences
│   └── runs/            # Execution history
├── agents/              # Custom agents
├── skills/             # Installed skills
├── squads/             # Squad definitions
│   └── my-squad/
│       ├── agents/      # Squad-specific agents
│       ├── pipeline/   # Pipeline steps
│       └── output/     # Execution output
├── dashboard/          # Web dashboard
└── README.md
```

---

## 🆚 OpenClawSquad vs opensquad

| Feature | OpenClawSquad | opensquad |
|---------|---------------|-----------|
| Real-time Dashboard | ✅ WebSocket | ✅ Basic |
| IDE Integrations | 6 (Claude, Codex, Cursor, Windsurf, Zed, Jan) | 5 |
| Pre-built Agents | 27+ | ~15 |
| Dynamic Squad Creation | ✅ Architect agent | ❌ |
| Skills System | ✅ Extensible | ✅ |
| Open Source | ✅ Full | ✅ Full |
| npm Package | ✅ | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by [opensquad](https://github.com/renatoasse/opensquad)
- Built with Node.js, Inquirer, Chalk, and WS

---

## 🔗 Links

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/jackchakkal/OpenClawSquad/issues)
- 💬 [Discord](https://discord.com/invite/clawd)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/jackchakkal">Jack Chakkal</a>
</p>
