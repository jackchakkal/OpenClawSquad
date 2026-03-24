#!/usr/bin/env node

/**
 * Dashboard Server - WebSocket server for real-time 2D dashboard
 * Integrated with PipelineRunner for real agent status
 */

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, unlinkSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, resetConfig, saveConfig } from './config.js';
import { loadGlobalKeys, saveGlobalKey, removeGlobalKey, applyGlobalKeys } from './keys.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

// Known API key names for the config panel
const API_KEY_NAMES = [
  'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'MINIMAX_API_KEY',
  'INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID',
  'IMGBB_API_KEY', 'APIFY_TOKEN'
];

// Available agents list (mirrored from agents-cli.js)
const AVAILABLE_AGENTS = [
  { id: 'architect', name: 'Architect', description: 'Creates squads dynamically' },
  { id: 'coordinator', name: 'Coordinator', description: 'Orchestrates squad workflows' },
  { id: 'researcher', name: 'Researcher', description: 'Search and gather information' },
  { id: 'scraper', name: 'Scraper', description: 'Web scraping specialist' },
  { id: 'strategist', name: 'Strategist', description: 'Planning and strategy' },
  { id: 'writer', name: 'Writer', description: 'Content creation' },
  { id: 'copywriter', name: 'Copywriter', description: 'Marketing copy' },
  { id: 'executor', name: 'Executor', description: 'Execute tasks' },
  { id: 'reviewer', name: 'Reviewer', description: 'Quality assurance' },
  { id: 'codereviewer', name: 'Code Reviewer', description: 'Code quality review' },
  { id: 'tester', name: 'Tester', description: 'Testing specialist' },
  { id: 'pentester', name: 'Pentester', description: 'Security testing' },
  { id: 'securityauditor', name: 'Security Auditor', description: 'Security audit' },
  { id: 'bughunter', name: 'Bug Hunter', description: 'Bug hunting' },
  { id: 'debugger', name: 'Debugger', description: 'Debugging specialist' },
  { id: 'dataanalyst', name: 'Data Analyst', description: 'Data analysis' },
  { id: 'visualizer', name: 'Visualizer', description: 'Data visualization' },
  { id: 'seoexpert', name: 'SEO Expert', description: 'SEO optimization' },
  { id: 'socialmediamanager', name: 'Social Media Manager', description: 'Social media' },
  { id: 'translator', name: 'Translator', description: 'Translation' },
  { id: 'summarizer', name: 'Summarizer', description: 'Summarization' },
  { id: 'tutor', name: 'Tutor', description: 'Teaching' },
  { id: 'productspecialist', name: 'Product Specialist', description: 'Product expertise' },
  { id: 'salesscript', name: 'Sales Script', description: 'Sales scripting' },
  { id: 'videoextractor', name: 'Video Extractor', description: 'Video extraction' },
  { id: 'videolearner', name: 'Video Learner', description: 'Video learning' },
  { id: 'designer', name: 'Designer', description: 'Design specialist' },
];

const AGENT_CATEGORIES = {
  'Coordination': ['coordinator'],
  'Intelligence': ['researcher', 'scraper'],
  'Planning': ['strategist'],
  'Content': ['writer', 'copywriter', 'designer'],
  'Execution': ['executor'],
  'Quality': ['reviewer', 'codereviewer', 'tester'],
  'Security': ['pentester', 'securityauditor', 'bughunter', 'debugger'],
  'Development': ['architect'],
  'Data': ['dataanalyst', 'visualizer'],
  'Marketing': ['seoexpert', 'socialmediamanager'],
  'Communication': ['translator', 'summarizer', 'tutor'],
  'Specialists': ['productspecialist', 'salesscript', 'videoextractor', 'videolearner'],
};

// Track the target directory for config operations
let _targetDir = process.cwd();

/**
 * Parse JSON body from an incoming request
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Mask an API key value, showing only last 4 characters
 */
function maskKey(value) {
  if (!value || value.length < 5) return '****';
  return '****' + value.slice(-4);
}

/**
 * Read agent .md file frontmatter for icon/title
 */
function loadAgentIcons() {
  const agentsDir = join(__dirname, '..', 'agents');
  const icons = {};
  if (!existsSync(agentsDir)) return icons;
  try {
    const files = readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
    for (const file of files) {
      const content = readFileSync(join(agentsDir, file), 'utf-8');
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        const frontmatter = match[1];
        const idMatch = file.replace('.agent.md', '');
        const iconMatch = frontmatter.match(/^icon:\s*(.+)$/m);
        const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
        if (iconMatch) icons[idMatch] = { icon: iconMatch[1].trim(), title: titleMatch ? titleMatch[1].trim() : '' };
      }
    }
  } catch {
    // ignore read errors
  }
  return icons;
}

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
  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

    // Config API: GET /api/config
    if (req.url === '/api/config' && req.method === 'GET') {
      try {
        resetConfig();
        const config = loadConfig(_targetDir);
        const keys = loadGlobalKeys();
        const keyStatus = {};
        for (const keyName of API_KEY_NAMES) {
          const val = keys[keyName] || process.env[keyName] || '';
          keyStatus[keyName] = { exists: !!val, masked: val ? maskKey(val) : '' };
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ config, keys: keyStatus }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Config API: POST /api/config
    if (req.url === '/api/config' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const saved = saveConfig(_targetDir, body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, config: saved }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Keys API: POST /api/keys
    if (req.url === '/api/keys' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.key || !body.value) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing key or value' }));
          return;
        }
        saveGlobalKey(body.key, body.value);
        applyGlobalKeys();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Keys API: DELETE /api/keys/:name
    if (req.url.startsWith('/api/keys/') && req.method === 'DELETE') {
      try {
        const keyName = decodeURIComponent(req.url.split('/api/keys/')[1]);
        removeGlobalKey(keyName);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // Agents API: GET /api/agents
    if (req.url === '/api/agents' && req.method === 'GET') {
      try {
        const icons = loadAgentIcons();
        const agents = AVAILABLE_AGENTS.map(a => ({
          ...a,
          icon: icons[a.id]?.icon || '',
          title: icons[a.id]?.title || a.name,
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ agents, categories: AGENT_CATEGORIES }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // === Layouts API ===
    const layoutsDir = join(__dirname, '..', 'layouts');

    // GET /api/layouts - list all layouts
    if (req.url === '/api/layouts' && req.method === 'GET') {
      try {
        if (!existsSync(layoutsDir)) mkdirSync(layoutsDir, { recursive: true });
        const files = readdirSync(layoutsDir).filter(f => f.endsWith('.json'));
        const layouts = files.map(f => {
          try {
            const data = JSON.parse(readFileSync(join(layoutsDir, f), 'utf-8'));
            return { id: data.id || f.replace('.json', ''), name: data.name, category: data.category, version: data.version };
          } catch { return null; }
        }).filter(Boolean);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ layouts }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // GET /api/layouts/:id - get specific layout
    if (req.url.startsWith('/api/layouts/') && req.method === 'GET') {
      try {
        const layoutId = decodeURIComponent(req.url.split('/api/layouts/')[1]);
        const filePath = join(layoutsDir, `${layoutId}.json`);
        if (!existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Layout not found' }));
          return;
        }
        const data = readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // POST /api/layouts - create new layout
    if (req.url === '/api/layouts' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        if (!body.id || !body.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing id or name' }));
          return;
        }
        if (!existsSync(layoutsDir)) mkdirSync(layoutsDir, { recursive: true });
        const sanitizedId = body.id.replace(/[^a-zA-Z0-9_-]/g, '-');
        const filePath = join(layoutsDir, `${sanitizedId}.json`);
        writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: sanitizedId }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // PUT /api/layouts/:id - update layout
    if (req.url.startsWith('/api/layouts/') && req.method === 'PUT') {
      try {
        const layoutId = decodeURIComponent(req.url.split('/api/layouts/')[1]);
        const filePath = join(layoutsDir, `${layoutId}.json`);
        if (!existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Layout not found' }));
          return;
        }
        const body = await parseBody(req);
        body.id = layoutId;
        writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // DELETE /api/layouts/:id - delete layout
    if (req.url.startsWith('/api/layouts/') && req.method === 'DELETE') {
      try {
        const layoutId = decodeURIComponent(req.url.split('/api/layouts/')[1]);
        const filePath = join(layoutsDir, `${layoutId}.json`);
        if (!existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Layout not found' }));
          return;
        }
        unlinkSync(filePath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // === Carousels API ===
    const squadsDir = join(__dirname, '..', 'squads');

    // GET /api/carousels - list generated carousels from squad outputs
    if (req.url === '/api/carousels' && req.method === 'GET') {
      try {
        const carousels = [];
        if (existsSync(squadsDir)) {
          const squadDirs = readdirSync(squadsDir).filter(d => {
            const p = join(squadsDir, d);
            return existsSync(p) && statSync(p).isDirectory();
          });
          for (const squad of squadDirs) {
            const outputDir = join(squadsDir, squad, 'output');
            if (!existsSync(outputDir)) continue;
            // Scan for slide PNG files
            const scanDir = (dir, prefix) => {
              if (!existsSync(dir)) return;
              const files = readdirSync(dir);
              const slides = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort();
              if (slides.length > 0) {
                carousels.push({
                  id: `${squad}/${prefix || ''}`,
                  squad,
                  name: prefix || squad,
                  slides: slides.map(f => ({
                    filename: f,
                    url: `/api/carousels/${squad}/${prefix ? prefix + '/' : ''}${f}`
                  })),
                  slideCount: slides.length
                });
              }
              // Check subdirectories (e.g., output/slides/)
              const subdirs = files.filter(f => {
                const p = join(dir, f);
                return existsSync(p) && statSync(p).isDirectory();
              });
              for (const sub of subdirs) {
                scanDir(join(dir, sub), prefix ? `${prefix}/${sub}` : sub);
              }
            };
            scanDir(outputDir, '');
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ carousels }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // GET /api/carousels/:squad/... - serve carousel image file
    if (req.url.startsWith('/api/carousels/') && req.method === 'GET') {
      try {
        const relPath = decodeURIComponent(req.url.replace('/api/carousels/', ''));
        const imgPath = join(squadsDir, relPath, '..', '..', 'output', relPath.split('/').slice(1).join('/'));
        // Rebuild proper path: /api/carousels/squadName/subpath/file.png -> squads/squadName/output/subpath/file.png
        const parts = relPath.split('/');
        const squadName = parts[0];
        const rest = parts.slice(1).join('/');
        const fullPath = join(squadsDir, squadName, 'output', rest);
        if (!existsSync(fullPath)) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = extname(fullPath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${basename(fullPath)}"`
        });
        res.end(readFileSync(fullPath));
      } catch (err) {
        res.writeHead(500);
        res.end('Error serving file');
      }
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
  // Set target dir for config operations
  _targetDir = targetDir || process.cwd();

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
