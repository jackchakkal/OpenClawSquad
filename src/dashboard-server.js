#!/usr/bin/env node

/**
 * Dashboard Server - WebSocket server for real-time 2D dashboard
 * Integrated with PipelineRunner for real agent status
 */

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

// System state
const state = {
  squads: new Map(),
  agents: new Map(),
  activities: [],
  connections: new Set(),
  activeRuns: new Map()
};

function createDashboardServer(port = 3001) {
  // Simple HTTP server
  const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // API endpoints
    if (req.url === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        squads: Array.from(state.squads.values()),
        agents: Array.from(state.agents.values()),
        activeRuns: Array.from(state.activeRuns.values()),
        activities: state.activities.slice(-20)
      }));
      return;
    }

    if (req.url === '/api/providers') {
      // Dynamically import to avoid issues
      import('./providers/index.js').then(({ listProviders }) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(listProviders()));
      }).catch(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('[]');
      });
      return;
    }

    // Static files
    let filePath = join(__dirname, '..', 'dashboard');

    if (req.url === '/') {
      filePath = join(filePath, 'index.html');
    } else {
      filePath = join(filePath, req.url);
    }

    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(readFileSync(filePath));
  });

  // WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('📱 Client connected to dashboard');
    state.connections.add(ws);

    // Send initial state
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        squads: Array.from(state.squads.values()),
        agents: Array.from(state.agents.values()),
        activeRuns: Array.from(state.activeRuns.values()),
        activities: state.activities.slice(-20)
      }
    }));

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message);
        handleMessage(ws, msg);
      } catch (e) {
        console.error('❌ Error processing message:', e);
      }
    });

    ws.on('close', () => {
      state.connections.delete(ws);
    });
  });

  return { server, wss };
}

function handleMessage(ws, msg) {
  switch (msg.type) {
    case 'start_squad':
      startSquad(msg.squadName, msg.agents);
      break;
    case 'agent_status':
      updateAgentStatus(msg.agentId, msg.status, msg.task);
      break;
    case 'checkpoint':
      broadcast({
        type: 'checkpoint',
        data: {
          name: msg.name,
          message: msg.message
        }
      });
      break;
  }
}

function startSquad(squadName, agents) {
  const agentsList = (agents || []).map((a, i) => ({
    ...(typeof a === 'string' ? { id: a, name: a } : a),
    position: { x: 100 + (i * 120), y: 150 }
  }));

  state.squads.set(squadName, {
    name: squadName,
    status: 'running',
    startTime: Date.now(),
    agents: agentsList
  });

  addActivity('System', `Squad "${squadName}" started`);

  broadcast({
    type: 'squad_started',
    data: { squadName, agents: agentsList }
  });
}

function updateAgentStatus(agentId, status, task) {
  state.agents.set(agentId, {
    id: agentId,
    status,
    task: task || '',
    lastUpdate: Date.now()
  });

  addActivity(agentId, `${status}: ${task || ''}`);

  broadcast({
    type: 'agent_updated',
    data: { agentId, status, task }
  });
}

function addActivity(agent, message) {
  const activity = {
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    agent,
    message
  };

  state.activities.push(activity);

  if (state.activities.length > 100) {
    state.activities.shift();
  }

  broadcast({
    type: 'activity',
    data: activity
  });
}

function broadcast(message) {
  const data = JSON.stringify(message);

  state.connections.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

/**
 * Create a status callback for PipelineRunner integration
 */
export function createPipelineStatusCallback() {
  return (event) => {
    updateAgentStatus(event.agentId, event.status, event.task);

    if (event.type === 'pipeline_start') {
      startSquad(event.squad, []);
    }
  };
}

/**
 * Export state management functions for external use
 */
export { updateAgentStatus, startSquad, addActivity, broadcast, state };

export async function startDashboard(targetDir, port = 3001) {
  // Load .env if available
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch {
    // dotenv not installed
  }

  const { server } = createDashboardServer(port);

  server.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🦞 OpenClawSquad Dashboard Server      ║
╠═══════════════════════════════════════════╣
║   HTTP:  http://localhost:${port}           ║
║   WS:    ws://localhost:${port}             ║
║                                           ║
║   API:   /api/status                      ║
║          /api/providers                   ║
╚═══════════════════════════════════════════╝
    `);
    console.log('  Waiting for squad execution...');
    console.log('  Use "openclawsquad run <squad>" in another terminal\n');
  });
}

export default createDashboardServer;
