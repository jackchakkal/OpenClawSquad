/**
 * OpenClawSquad - Internationalization
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let currentLocale = {};
let currentLang = 'en';

const locales = {
  'en': {
    welcome: 'Welcome to OpenClawSquad!',
    success: '✅ OpenClawSquad has been initialized!',
    askName: 'What is your name?',
    chooseIdes: 'Which IDEs would you like to configure?',
    createdFile: '  📄 Created: {path}',
    nextSteps: 'Next steps:',
  },
  'pt-BR': {
    welcome: 'Bem-vindo ao OpenClawSquad!',
    success: '✅ OpenClawSquad foi inicializado!',
    askName: 'Qual é o seu nome?',
    chooseIdes: 'Quais IDEs você gostaria de configurar?',
    createdFile: '  📄 Criado: {path}',
    nextSteps: 'Próximos passos:',
  },
  'es': {
    welcome: '¡Bienvenido a OpenClawSquad!',
    success: '✅ ¡OpenClawSquad ha sido inicializado!',
    askName: '¿Cuál es tu nombre?',
    chooseIdes: '¿Qué IDEs te gustaría configurar?',
    createdFile: '  📄 Creado: {path}',
    nextSteps: 'Próximos pasos:',
  }
};

export async function loadLocale(lang) {
  currentLang = lang;
  currentLocale = locales[lang] || locales['en'];
}

export function t(key, params = {}) {
  let text = currentLocale[key] || key;
  
  // Replace placeholders
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`{${param}}`, 'g'), value);
  }
  
  return text;
}

export function getCurrentLang() {
  return currentLang;
}
