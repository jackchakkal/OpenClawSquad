#!/usr/bin/env node

/**
 * Dashboard Server - Servidor WebSocket para Dashboard 2D em tempo real
 */

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

// Estado do sistema
const state = {
  squads: new Map(),
  agents: new Map(),
  activities: [],
  connections: new Set()
};

// Servidor HTTP simples
const server = http.createServer((req, res) => {
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
  console.log('📱 Cliente conectado ao dashboard');
  state.connections.add(ws);

  // Enviar estado inicial
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      squads: Array.from(state.squads.values()),
      agents: Array.from(state.agents.values()),
      activities: state.activities.slice(-20)
    }
  }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      handleMessage(ws, msg);
    } catch (e) {
      console.error('❌ Erro ao processar mensagem:', e);
    }
  });

  ws.on('close', () => {
    state.connections.delete(ws);
  });
});

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
  state.squads.set(squadName, {
    name: squadName,
    status: 'running',
    startTime: Date.now(),
    agents: agents.map((a, i) => ({
      ...a,
      position: { x: 100 + (i * 120), y: 150 }
    }))
  });

  addActivity('System', `Squad "${squadName}" iniciado`);

  broadcast({
    type: 'squad_started',
    data: { squadName, agents }
  });
}

function updateAgentStatus(agentId, status, task) {
  state.agents.set(agentId, {
    id: agentId,
    status,
    task: task || '',
    lastUpdate: Date.now()
  });

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

// API REST simples para controlar execução
server.on('request', (req, res) => {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🦞 OpenClawSquad Dashboard Server      ║
╠═══════════════════════════════════════════╣
║   HTTP:  http://localhost:${PORT}           ║
║   WS:    ws://localhost:${PORT}             ║
╚═══════════════════════════════════════════╝
  `);
  
  // Exemplos de agentes para demo
  const demoAgents = [
    { id: 'coordinator', name: 'Coordinator', icon: '🎯', status: 'idle' },
    { id: 'researcher', name: 'Rodrigo Referencia', icon: '🔍', status: 'idle' },
    { id: 'strategist', name: 'Sofia Estratégia', icon: '🧠', status: 'idle' },
    { id: 'writer', name: 'Wanda Writer', icon: '✍️', status: 'idle' },
    { id: 'designer', name: 'Diego Design', icon: '🎨', status: 'idle' },
    { id: 'reviewer', name: 'Renata Revisão', icon: '✅', status: 'idle' }
  ];
  
  startSquad('content-squad', demoAgents);
});

export default server;
