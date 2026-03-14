---
name: Security Scan
description: >
  Realiza scans de segurança em websites: headers, SSL, vulnerabilidades
  comuns, exposição de dados e análise de configurações.
type: security
version: "1.0.0"
tools:
  - curl
  - web_fetch
  - browser
---

# Skill: Security Scan

Realiza análise de segurança em websites.

## O que verifica:

### 1. Headers de Segurança
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)
- Content-Security-Policy
- X-XSS-Protection

### 2. SSL/TLS
- Certificado válido
- Protocolos seguros
- Cipher suites

### 3. Informações Expostas
- Emails públicos
- Arquivos sensíveis
- Stack tecnológico
- Versões expostas

### 4. Vulnerabilidades Comuns
- Redirects abertos
- CSRF tokens ausentes
- Cookies inseguros

## Como usar:
"Faça um security scan em [URL]"
