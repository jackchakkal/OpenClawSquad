#!/usr/bin/env node

/**
 * Image Creator Skill
 * Renderiza HTML/CSS em imagens via Playwright
 */

import { spawn } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

// Usage: node render.js --input output/slide-01.html --output output/slide-01.png --width 1080 --height 1440

async function main() {
  const input = args.find(a => a.startsWith('--input='))?.split('=')[1];
  const output = args.find(a => a.startsWith('--output='))?.split('=')[1];
  const width = parseInt(args.find(a => a.startsWith('--width='))?.split('=')[1] || '1080');
  const height = parseInt(args.find(a => a.startsWith('--height='))?.split('=')[1] || '1440');

  if (!input || !output) {
    console.log('Usage: node render.js --input=<file> --output=<file> [--width=1080] [--height=1440]');
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`❌ Input file not found: ${input}`);
    process.exit(1);
  }

  console.log(`🎨 Renderizando: ${input}`);
  console.log(`   Dimensões: ${width}x${height}`);

  // Criar script de renderização temporário
  const script = `
    const { chromium } = require('playwright');
    
    (async () => {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setViewportSize({ width: ${width}, height: ${height} });
      
      const filePath = 'file://${input.replace(/\\/g, '/')}';
      await page.goto(filePath, { waitUntil: 'networkidle' });
      
      await page.screenshot({ path: '${output}', fullPage: false });
      
      await browser.close();
      console.log('✅ Renderizado: ${output}');
    })();
  `;

  // Executar com Node
  const proc = spawn('node', ['-e', script], { stdio: 'inherit' });
  proc.on('close', code => process.exit(code || 0));
}

main();
