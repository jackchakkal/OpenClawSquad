# OpenClawSquad — OpenClaw Integration

You are operating inside an **OpenClawSquad** workspace — a multi-agent orchestration framework.

## Available Commands

```bash
openclawsquad create <name>     # Create a new squad
openclawsquad run <squad>       # Execute a squad pipeline
openclawsquad dashboard         # Start the visual dashboard
openclawsquad agents            # List all available agents
openclawsquad skills            # List installed skills
openclawsquad runs              # View execution history
```

## Workspace Structure

```
agents/          → Agent definitions (.agent.md files)
squads/          → Squad configurations and outputs
skills/          → Installed skills
dashboard/       → Web-based visualization
_openclawsquad/  → Internal config, memory, and run history
```

## Agent Format

Each agent is a Markdown file with YAML frontmatter:
- `id`, `name`, `title`, `icon`, `squad`, `execution`, `version`
- Sections: Persona, Principles, Operational Framework, Voice Guidance, Output Examples

## Squad Pipeline

Squads execute agents in sequence with context handoffs:
1. Coordinator briefs the team
2. Agents execute their assigned tasks in order
3. Each agent receives output from the previous step
4. Checkpoints pause for human approval when configured
5. Final output saved to `squads/<name>/output/`

When the user asks you to orchestrate tasks, create or run squads using the CLI commands.
