# OpenClawSquad - User Manual

> Multi-agent orchestration framework for AI-powered workflows

---

## Table of Contents

1. [What is OpenClawSquad?](#what-is-openclawsquad)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Practical Examples](#practical-examples)
5. [Core Concepts](#core-concepts)
6. [Available Agents](#available-agents)
7. [Creating Squads](#creating-squads)
8. [Running Pipelines](#running-pipelines)
9. [Dashboard](#dashboard)
10. [LLM Providers](#llm-providers)
11. [Claude Code Integration](#claude-code-integration)
12. [IDE Integrations](#ide-integrations)
13. [Configuration](#configuration)
14. [Skills System](#skills-system)
15. [Testing & Debugging](#testing--debugging)
16. [Publishing to npm](#publishing-to-npm)
17. [FAQ](#faq)

---

## What is OpenClawSquad?

OpenClawSquad is an open-source multi-agent orchestration framework that lets you create teams ("squads") of specialized AI agents that collaborate on complex tasks. Each agent has a unique persona, expertise, and role within the squad pipeline.

**Key Features:**
- 27+ pre-built agents (researcher, writer, reviewer, pentester, etc.)
- Pipeline runner with checkpoints and human-in-the-loop approvals
- Multiple LLM provider support (Anthropic, OpenAI, Minimax)
- Real-time WebSocket dashboard
- IDE integrations (Claude Code, Cursor, Codex, Windsurf, Zed)
- Extensible skills system

---

## Installation

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 9.0.0
- At least one LLM API key (Anthropic, OpenAI, or Minimax)

### Install Globally

```bash
npm install -g openclawsquad
```

### Or Use with npx (no install needed)

```bash
npx openclawsquad init
```

### Verify Installation

```bash
openclawsquad --version
```

---

## Quick Start

### 1. Start the Setup Wizard

```bash
mkdir my-project && cd my-project
npx openclawsquad start
```

The interactive wizard will guide you through:
- **Mode selection** — Terminal CLI or Browser Dashboard
- **API key configuration** — enter your key once, stored globally
- **IDE integration** — connect to Cursor, Claude Code, Codex, etc.

No `.env` file editing required. Your API key is saved automatically to `~/.openclawsquad/keys.json` and loaded on every run.

### 2. Configure API Keys (first run only)

During `npx openclawsquad start`, you will be prompted:

```
Step 2/3 — Configure your LLM provider

? Which LLM provider do you want to configure?
  > Anthropic (Claude) — Recommended - https://console.anthropic.com/
    OpenAI (GPT) — https://platform.openai.com/
    Minimax (M2.7) — https://platform.minimax.io/
    Skip (configure later)

? Enter your Anthropic (Claude) API key: **********************

  [OK] API key saved to /home/youruser/.openclawsquad/keys.json
  Provider will be auto-detected on every run.
```

To update or add a key later, just run `npx openclawsquad start` again.

### 3. Create Your First Squad

```bash
npx openclawsquad create my-team
```

Follow the interactive wizard to define:
- Squad name and objective
- Which agents to include
- Pipeline steps and checkpoints

### 4. Run the Squad

```bash
npx openclawsquad run my-team
```

### 5. Watch in Real-Time

```bash
npx openclawsquad dashboard
```

Open `http://localhost:3001` in your browser.

---

## Practical Examples

Three real-world examples of how to use OpenClawSquad to solve problems and generate income.

---

### Example 1 — Content Marketing Agency

**Scenario:** You offer content creation services for clients. Each client needs weekly SEO blog posts plus social media captions. Doing this manually takes 4–6 hours per client.

**With OpenClawSquad:** Automate the entire pipeline — research, strategy, writing, review, and social media adaptation — in minutes.

**Setup:**

```bash
mkdir content-agency && cd content-agency
npx openclawsquad start
npx openclawsquad create blog-pipeline
```

When creating the squad, add these agents in order:
1. `researcher` — gathers data, stats, and competitors for the topic
2. `strategist` — defines angle, target audience, and keyword focus
3. `writer` — writes the full SEO-optimized article
4. `reviewer` — checks quality, clarity, and SEO score
5. `copywriter` — adapts the key points for Instagram, LinkedIn, and X

**Running it:**

```bash
npx openclawsquad run blog-pipeline
```

When prompted for the objective, enter:

```
Write a 1500-word SEO blog post for a SaaS company selling project management
software. Target keyword: "best project management tools for remote teams 2025".
Tone: professional but approachable. Include stats and a clear CTA.
```

**Output:** A complete article + 3 social media captions ready to publish, saved in `_openclawsquad/runs/`.

**Business model:** Charge $300–800 per client/month for weekly blog posts. With 5 clients and 10 minutes of work per article, that is $1,500–4,000/month.

---

### Example 2 — Automated Security Audit Service

**Scenario:** Small businesses need security audits but cannot afford expensive consultants. You offer lightweight security reports for $500–$1,500 each.

**With OpenClawSquad:** The `pentest` squad produces a structured security report covering attack surface analysis, vulnerability identification, and remediation recommendations.

**Setup:**

```bash
mkdir security-service && cd security-service
npx openclawsquad start
```

Use the pre-built `pentest` squad (already included):

```bash
npx openclawsquad run pentest
```

Enter the target details when prompted:

```
Perform a security audit for a small e-commerce website built on WordPress.
The site accepts credit card payments via Stripe. Identify common vulnerabilities,
misconfigurations, and provide prioritized remediation steps. Focus on OWASP Top 10.
```

**What the pipeline does:**
1. `coordinator` — structures the audit scope and methodology
2. `researcher` — identifies known vulnerabilities for the tech stack
3. `executor` — runs through the OWASP checklist systematically
4. `reviewer` — validates findings and removes false positives

**Output:** A professional 8–12 page security report in Markdown, ready to convert to PDF and deliver to the client.

**Business model:** Offer audits at $500–$1,500 each. With 4 audits per month, using 30 minutes per audit for review and customization, that is $2,000–6,000/month.

---

### Example 3 — Market Research Reports for Startups

**Scenario:** Founders and investors need quick market research before making decisions. Traditional research firms charge $3,000–$10,000 per report and take weeks.

**With OpenClawSquad:** Produce a comprehensive market analysis report in under an hour for a fraction of the cost.

**Setup:**

```bash
mkdir research-service && cd research-service
npx openclawsquad start
npx openclawsquad create market-report
```

Build the squad with:
1. `researcher` — maps the market, players, and trends
2. `data-analyst` — interprets data, market size, and growth rates
3. `strategist` — identifies opportunities, threats, and positioning
4. `summarizer` — produces the executive summary and key takeaways
5. `writer` — formats the full report with clear sections

**Running it:**

```bash
npx openclawsquad run market-report
```

Enter the research brief:

```
Create a market research report for the AI-powered legal tech sector in Brazil.
Include: market size and growth projections, top 5 competitors with analysis,
main customer pain points, regulatory landscape, and 3 strategic opportunities
for a new entrant with a $200k seed budget.
```

**Output:** A 15–20 page market report structured with executive summary, competitive analysis, opportunity matrix, and recommendations — ready to deliver or use for your own decisions.

**Business model:** Offer reports at $200–$800 each depending on depth. Sell to: accelerators, VCs, startup founders, corporates exploring new markets. With 8 reports per month at an average of $400, that is $3,200/month.

---

### Agents

An **agent** is a specialized AI persona defined in a `.agent.md` file. Each agent has:
- **Persona**: Role, identity, communication style
- **Principles**: Rules the agent follows
- **Operational Framework**: Step-by-step process
- **Voice Guidance**: Vocabulary preferences
- **Quality Criteria**: Self-evaluation checklist

Example agent file structure:
```markdown
---
id: squads/core/agents/researcher
name: Researcher
title: Research Specialist
icon: 🔍
squad: core
execution: subagent
---

# Researcher

## Persona
### Role
I find, verify, and synthesize information from multiple sources...
```

### Squads

A **squad** is a team of agents with a defined pipeline. Squads are configured in `squad.json` or `squad.yaml`:

```json
{
  "name": "content",
  "description": "Content creation squad",
  "agents": ["coordinator", "researcher", "writer", "reviewer"],
  "pipeline": [
    { "agent": "coordinator", "action": "plan" },
    { "agent": "researcher", "action": "research", "input": "topic" },
    { "checkpoint": true, "name": "Review research" },
    { "agent": "writer", "action": "write", "input": "researcher" },
    { "agent": "reviewer", "action": "review", "input": "writer" }
  ]
}
```

### Pipelines

A **pipeline** is the ordered sequence of steps in a squad. Steps can be:
- **Agent steps**: An agent executes a task
- **Checkpoints**: Pause for human review/approval

### Context Chain

Each agent's output automatically becomes context for the next agent in the pipeline. This creates a chain of increasing refinement.

---

## Available Agents

### Content & Marketing
| Agent | Icon | Description |
|-------|------|-------------|
| Writer | ✍️ | Creates long-form content, articles, blog posts |
| Copywriter | 📝 | Marketing copy, ads, landing pages |
| Strategist | 📐 | Marketing strategy and planning |
| SEO Expert | 🔎 | Search engine optimization |
| Social Media Manager | 📱 | Social media content and strategy |
| Sales Script | 💰 | Sales scripts and objection handling |

### Research & Analysis
| Agent | Icon | Description |
|-------|------|-------------|
| Researcher | 🔍 | Deep research with source verification |
| Data Analyst | 📊 | Data analysis and insights |
| Visualizer | 📈 | Data visualization recommendations |
| Summarizer | 📋 | Condenses lengthy content |

### Development & Security
| Agent | Icon | Description |
|-------|------|-------------|
| Architect | 🏗️ | System architecture and design |
| Executor | ⚡ | Task execution and automation |
| Code Reviewer | 🔍 | Code quality analysis |
| Debugger | 🔧 | Bug identification and fixing |
| Tester | 🧪 | Test creation and execution |
| Bug Hunter | 🐛 | Systematic bug discovery |
| Pentester | 🛡️ | Security penetration testing |
| Security Auditor | 🔐 | Security compliance auditing |

### Education & Media
| Agent | Icon | Description |
|-------|------|-------------|
| Tutor | 🎓 | Teaching and explanation |
| Translator | 🌐 | Multi-language translation |
| Video Learner | 🎥 | Video content analysis |
| Video Extractor | 🎬 | Video metadata extraction |

### Operations
| Agent | Icon | Description |
|-------|------|-------------|
| Coordinator | 🎯 | Pipeline orchestration |
| Reviewer | ✅ | Quality assurance |
| Designer | 🎨 | Visual design guidance |
| Product Specialist | 🎯 | Product analysis |
| Scraper | 🕷️ | Web data extraction |

---

## Creating Squads

### Interactive Creation

```bash
npx openclawsquad create marketing-team
```

### Manual Creation

Create a directory under `squads/` with a `squad.json`:

```bash
mkdir -p squads/my-squad
```

```json
{
  "name": "my-squad",
  "description": "My custom squad",
  "agents": ["researcher", "writer", "reviewer"],
  "pipeline": [
    { "agent": "researcher", "action": "research", "input": "topic" },
    { "agent": "writer", "action": "write", "input": "researcher" },
    { "checkpoint": true, "name": "Review draft" },
    { "agent": "reviewer", "action": "review", "input": "writer" }
  ]
}
```

### Pre-built Squads

| Squad | Description | Agents |
|-------|-------------|--------|
| `content` | Content creation | coordinator, researcher, strategist, writer, reviewer |
| `research` | Deep research | coordinator, researcher, strategist |
| `automation` | Task automation | coordinator, strategist, executor, reviewer |
| `pentest` | Security testing | coordinator, researcher, executor, reviewer |

---

## Running Pipelines

### Basic Execution

```bash
npx openclawsquad run content
```

You'll be prompted to describe the objective. The pipeline will then:
1. Execute each agent step in order
2. Pass context between agents
3. Pause at checkpoints for your approval
4. Save outputs to `_openclawsquad/runs/`

### Execution Flow

```
User Input -> Agent 1 -> Agent 2 -> [Checkpoint] -> Agent 3 -> Output
                |           |                           |
                v           v                           v
            output/     output/                     output/
```

### Viewing Run History

```bash
npx openclawsquad runs              # All runs
npx openclawsquad runs content      # Filter by squad
```

---

## Dashboard

### Starting the Dashboard

```bash
npx openclawsquad dashboard
```

Opens a real-time WebSocket dashboard at `http://localhost:3001`.

### Features

- **Agent Status**: See which agents are active, completed, or waiting
- **Activity Feed**: Real-time log of all agent actions
- **Pipeline Progress**: Visual progress through the pipeline
- **Checkpoint Notifications**: Approve/reject from the dashboard

### API Endpoints

- `GET /api/status` - Current system state
- `GET /api/providers` - Configured LLM providers

---

## LLM Providers

OpenClawSquad supports multiple LLM providers. Set your API key and the system auto-detects the provider.

### Provider Priority (auto-detection)

1. **Anthropic Claude** - `ANTHROPIC_API_KEY`
2. **OpenAI** - `OPENAI_API_KEY`
3. **Minimax** - `MINIMAX_API_KEY`

Keys are stored in `~/.openclawsquad/keys.json` and loaded automatically. To add or change a key, run `npx openclawsquad start`.

### Explicit Provider Selection

Add to `openclawsquad.config.json` in your project root:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514"
}
```

### Check Configuration

```bash
npx openclawsquad config
```

---

## Claude Code Integration

This is the recommended way to use OpenClawSquad with maximum power.

### How It Works

Claude Code (Anthropic's CLI) can directly interact with OpenClawSquad because:
1. OpenClawSquad generates `CLAUDE.md` files during `init` that Claude Code reads automatically
2. Agent files (`.agent.md`) serve as system prompts for Claude Code
3. The pipeline runner can be invoked directly from Claude Code's terminal

### Setup

```bash
# 1. Initialize OpenClawSquad with Claude Code integration
npx openclawsquad init
# Select "Claude Code" when asked about IDE integrations

# 2. Start Claude Code in the same directory
claude
```

Claude Code will automatically load the `CLAUDE.md` with OpenClawSquad context.

### Using OpenClawSquad from Claude Code

Once inside Claude Code, you can:

```
# Create a new squad
> Create a content squad for writing blog posts about AI

# Run an existing squad
> Run the research squad to analyze market trends in electric vehicles

# Use individual agents
> Use the researcher agent to find data about renewable energy trends

# Create custom workflows
> Create a squad with researcher, writer, and reviewer to produce
  a technical whitepaper about WebAssembly
```

### Direct CLI Commands from Claude Code

Claude Code has terminal access, so you can ask it to:

```
> Run: npx openclawsquad run content
> Start the dashboard: npx openclawsquad dashboard
> Show me the available agents: npx openclawsquad agents
> Create a new squad called "seo-team": npx openclawsquad create seo-team
```

### Advanced: Agent-to-Agent via Claude Code

You can use Claude Code as a meta-orchestrator:

1. Ask Claude Code to read an agent file
2. Claude Code adopts that agent's persona
3. Execute tasks with that persona's guidelines
4. Chain multiple agents manually with full control

Example:
```
> Read the researcher agent and use its methodology to research
  "best practices for microservices architecture". Then read the
  writer agent and use it to write a comprehensive guide based
  on the research.
```

### Tips for Best Results

1. **Always run `openclawsquad start`** first to generate CLAUDE.md and configure your API key
2. **Use squad names** when asking Claude Code to run pipelines
3. **Reference agent names** to get Claude Code to use specific personas
4. **Use the dashboard** alongside Claude Code for visual monitoring

---

## IDE Integrations

### Claude Code
- Auto-loads `CLAUDE.md` configuration
- Full terminal access to CLI commands
- Agent persona adoption

### Cursor
- `.cursor/rules` files loaded automatically
- Agent context available in AI chat

### Codex (OpenAI)
- `AGENTS.md` file loaded as context
- Compatible with Codex CLI

### Windsurf
- Rules configuration in `.windsurf/`
- Agent definitions available

### Zed
- Configuration in `.zed/`
- AI assistant integration

---

## Configuration

### Configuration File

Create `openclawsquad.config.json` in your project root:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.7,
  "maxTokens": 4096,
  "language": "en",
  "dashboardPort": 3001
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCLAWSQUAD_PROVIDER` | LLM provider | auto-detect |
| `OPENCLAWSQUAD_MODEL` | Model name | provider default |
| `OPENCLAWSQUAD_TEMPERATURE` | Temperature (0-1) | 0.7 |
| `OPENCLAWSQUAD_MAX_TOKENS` | Max tokens per response | 4096 |
| `OPENCLAWSQUAD_LANGUAGE` | Output language | en |

### Priority Order

1. Environment variables (highest)
2. `openclawsquad.config.json`
3. Default values (lowest)

---

## Skills System

Skills are optional extensions that add functionality.

### List Skills

```bash
npx openclawsquad skills
```

### Install a Skill

```bash
npx openclawsquad install instagram-publisher
```

### Remove a Skill

```bash
npx openclawsquad uninstall instagram-publisher
```

### Available Skills

- **instagram-publisher**: Publish content directly to Instagram
- More skills coming soon!

---

## Testing & Debugging

### Verify Setup

```bash
# Check configuration and provider status
npx openclawsquad config

# List available agents
npx openclawsquad agents

# List available squads (implicit via run without args)
npx openclawsquad run
```

### Common Issues

**"No LLM provider configured"**
- Run `npx openclawsquad start` and follow the API key setup step
- Your key is stored in `~/.openclawsquad/keys.json` and auto-loaded

**"Squad not found"**
- Check that the squad directory exists under `squads/`
- Ensure it has a `squad.json` or `squad.yaml`

**"Agent not found"**
- Verify the agent ID in `squad.json` matches a file in `agents/`
- Run `npx openclawsquad agents` to see available agents

**Dashboard not loading**
- Check port 3001 is available
- Try a different port via config

---

## Publishing to npm

If you fork OpenClawSquad and want to publish your own version:

### 1. Update package.json

```json
{
  "name": "your-package-name",
  "version": "1.0.0"
}
```

### 2. Login to npm

```bash
npm login
```

### 3. Publish

```bash
npm publish --access public
```

### npm Free Tier Compatibility

OpenClawSquad is fully compatible with npm free tier:
- Public package (`publishConfig.access: "public"`)
- MIT license
- No private registry requirements
- All dependencies are public packages

---

## FAQ

**Q: Do I need all three API keys?**
A: No, just one. The system auto-detects which provider to use based on available keys.

**Q: Can I use local LLMs?**
A: Not yet natively, but you can use any OpenAI-compatible API by setting `OPENAI_API_KEY` and pointing to your local endpoint.

**Q: How much does it cost to run a squad?**
A: Costs depend on your LLM provider. A typical content squad run uses ~5,000-15,000 tokens per agent step.

**Q: Can I create custom agents?**
A: Yes! Create a `.agent.md` file following the standard structure and place it in `agents/` or your squad's `agents/` directory.

**Q: Is my data sent to external services?**
A: Only to your configured LLM provider. No telemetry or analytics are collected.

**Q: Can agents run in parallel?**
A: Currently, agents run sequentially in the pipeline. Parallel execution is planned for a future release.

---

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! See the [GitHub repository](https://github.com/jackchakkal/OpenClawSquad) for issues and pull requests.
