# OpenClawSquad Dashboard

## Virtual Office Dashboard

OpenClawSquad includes a visual 2D dashboard that shows your agents working in real-time via WebSocket.

## How to Use

### Option 1: Via CLI (Recommended)

```bash
npx openclawsquad dashboard
```

This starts the HTTP + WebSocket server on port 3001.

### Option 2: Serve Locally

```bash
cd dashboard
python3 -m http.server 3000
# or
npx serve .
```

### Option 3: Open Directly

Open `index.html` in any browser (WebSocket features require the server).

## Features

### 2D Agent Visualization
- Each agent appears as an avatar in the virtual office
- Colors indicate status:
  - White: Idle
  - Yellow: Working
  - Green: Completed
  - Red: Error

### Agent Sidebar
- Lists all agents in the current squad
- Shows real-time status
- Click for details

### Activity Panel
- Shows recent activity logs
- Auto-updates via WebSocket
- Format: HH:MM - Agent: Message

### Pipeline Progress
- Visual progress through pipeline steps
- Checkpoint notifications with approve/reject

### API Endpoints
- `GET /api/status` - Current system state (squads, agents, runs)
- `GET /api/providers` - Configured LLM providers

## Integration

The dashboard connects to the pipeline runner via WebSocket. When you run a squad in another terminal, the dashboard updates in real-time:

```bash
# Terminal 1: Start dashboard
npx openclawsquad dashboard

# Terminal 2: Run a squad
npx openclawsquad run content
```
