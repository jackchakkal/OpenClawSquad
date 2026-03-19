# OpenClawSquad - Claude Code Integration

This skill enables Claude Code to work with OpenClawSquad multi-agent orchestration.

## Commands

- `create <squad-name>` - Create a new squad
- `run <squad-name>` - Execute a squad pipeline
- `list agents` - Show available agents
- `list squads` - Show configured squads

## How It Works

OpenClawSquad allows you to orchestrate multiple AI agents working together on complex tasks.

### Creating a Squad

```
You: create my-marketing-squad
Agent: What agents do you need?
You: writer, copywriter, seoexpert
Agent: Creating squad with: Writer, Copywriter, SEO Expert...
```

### Running a Pipeline

```
You: run my-marketing-squad to create a blog post about AI
Agent: Starting pipeline...
- Researcher: Gathering information about AI...
- Writer: Creating content...
- Copywriter: Adding marketing flair...
- SEO Expert: Optimizing for search...
✅ Pipeline completed!
```

## Available Agents

| Agent | Description |
|-------|-------------|
| coordinator | Orchestrates workflow |
| researcher | Searches and gathers info |
| writer | Creates content |
| copywriter | Marketing copy |
| reviewer | Quality assurance |
| seoexpert | SEO optimization |
| and 20+ more... |

## Configuration

Edit `squads/` to customize squads.
Edit `agents/` to customize agents.
