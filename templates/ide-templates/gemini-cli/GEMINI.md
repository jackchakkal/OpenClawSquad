# OpenClawSquad — Gemini CLI Integration

You are operating inside an **OpenClawSquad** workspace — a multi-agent orchestration framework.

## Available Commands

Run these in the terminal to control squads:

```bash
openclawsquad create <name>     # Create a new squad
openclawsquad run <squad>       # Execute a squad pipeline
openclawsquad dashboard         # Start the visual dashboard
openclawsquad agents            # List all available agents
openclawsquad skills            # List installed skills
```

## Agents Directory

Agent definitions live in `agents/*.agent.md`. Each file defines:
- **Persona** — role, identity, communication style
- **Principles** — guidelines and constraints
- **Operational Framework** — process and decision criteria

## Squads Directory

Squad configurations live in `squads/`. Each squad has:
- `squad.json` or `squad.yaml` — pipeline definition
- `output/` — execution results

## How to Use

1. **Create a squad**: `openclawsquad create my-team`
2. **Edit the pipeline**: Modify `squads/my-team/squad.json`
3. **Run it**: `openclawsquad run my-team`
4. **Review output**: Check `squads/my-team/output/`

## Context

- Project config: `_openclawsquad/config.json`
- User preferences: `_openclawsquad/_memory/preferences.md`
- Skills: `skills/` directory
- Execution history: `_openclawsquad/runs/`

When the user asks you to work with agents or squads, use the OpenClawSquad CLI commands above.
