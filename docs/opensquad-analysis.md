# Análise do Opensquad - Ideias para o OpenClawSquad

## 🔑 Conceitos Principais do Opensquad

### 1. Arquitetura de Squads
O opensquad NÃO usa agentes fixos. Em vez disso, o **Architect** CRIA squads dinamicamente baseado na necessidade do usuário.

**Componentes:**
- **Architect** - Cria squads sob demanda
- **Pipeline Runner** - Executa o fluxo automaticamente
- **Sherlock** - Investigator que analisa perfis de referência
- **Checkpoints** - Pausas para aprovação humana

### 2. Estrutura de Agentes (.agent.md)

O opensquad define um formato rico para agentes:

```yaml
---
id: "squads/{code}/agents/{agent}"
name: "{Agent Name}"
title: "{Agent Title}"
icon: "{emoji}"
squad: "{code}"
execution: inline | subagent
skills: []
tasks:                              # Lista de arquivos de tarefas
  - tasks/task-one.md
  - tasks/task-two.md
---

# {Agent Name}

## Persona
### Role
### Identity  
### Communication Style

## Principles (mínimo 6)

## Operational Framework
### Process (mínimo 5 passos)
### Decision Criteria

## Voice Guidance
### Vocabulary - Always Use (mínimo 5)
### Vocabulary - Never Use (mínimo 3)
### Tone Rules

## Output Examples (1-2 exemplos completos, 15+ linhas cada)

## Anti-Patterns
### Never Do (mínimo 4)
### Always Do (mínimo 3)

## Quality Criteria

## Integration
```

### 3. Sistema de Tarefas (Tasks)

Para agentes complexos, cada tarefa tem seu próprio arquivo:

```yaml
---
task: "Task Name"
order: 1
input: |
  - field_name: Description
output: |
  - field_name: Description
---

# Task Name

## Process (mínimo 3 passos)

## Output Format (YAML schema)

## Output Example (15+ linhas)

## Quality Criteria (mínimo 3)

## Veto Conditions (mínimo 2)
```

### 4. Sistema de Pipeline

O pipeline define o fluxo de execução:

```yaml
---
execution: subagent
agent: {agent-id}
format: {format-id}    # Opcional - plataforma específica
inputFile: squads/{code}/output/{file}
outputFile: squads/{code}/output/{file}
model_tier: fast | powerful
---
```

### 5. Skills (Integrações)

O opensquad tem um sistema de skills modular:

| Skill | Função |
|-------|--------|
| **image-creator** | Renderiza HTML/CSS em imagens via Playwright |
| **canva** | Cria designs via API do Canva |
| **apify** | Web scraping e automação |
| **instagram-publisher** | Publica carrosséis no Instagram |
| **image-fetcher** | Busca imagens da web/screenshots |

### 6. Best Practices (Arquivos de Referência)

O opensquad tem best practices para cada tipo de conteúdo:

**Disciplinas:**
- copywriting.md
- researching.md
- review.md
- image-design.md
- strategist.md
- technical-writing.md
- data-analysis.md

**Plataformas:**
- instagram-feed.md
- instagram-reels.md
- linkedin-post.md
- twitter-thread.md
- youtube-script.md
- email-sales.md
- blog-seo.md
- whatsapp-broadcast.md

### 7. Modelo de Tier

O opensquad usa dois níveis de modelo:

- **powerful** - Claude Opus, Gemini Pro, o3 (para escrita, estratégia)
- **fast** - Claude Haiku, Gemini Flash, gpt-4o-mini (para pesquisa, investigação)

### 8. Checkpoints Obrigatórios

O opensquad exige:
-Checkpoint antes de pesquisador (para definir foco)
-Checkpoint de seleção de notícia (para squads de notícias)
-Checkpoint de aprovação de conteúdo (antes de publicar/gerar imagem)
-Aprovação final antes de finalizar

---

## 🚀 Ideias para Implementar no OpenClawSquad

### Imediato:

1. **Criar pasta de Best Practices**
   - Copiar todos os arquivos de best-practices do opensquad
   - Adaptar para português

2. **Melhorar formato dos agentes**
   - Adicionar seções: Persona, Principles, Operational Framework
   - Adicionar Voice Guidance
   - Adicionar Output Examples completos

3. **Sistema de Tasks**
   - Para agentes complexos, criar arquivos de tarefas separados

4. **Pipeline com Checkpoints**
   - Implementar sistema de aprovação humana

### Médio prazo:

5. **Skills**
   - image-creator (Playwright para renderizar HTML)
   - canva (API do Canva)
   - apify (web scraping)
   - instagram-publisher

6. **Arquitetura Dinâmica**
   - Criar agente Architect que cria squads sob demanda

7. **Investigator (Sherlock)**
   - Agente que analisa perfis de redes sociais

### Formatos de Conteúdo Suportados:

- Instagram Feed, Reels, Stories
- LinkedIn Post, Article
- Twitter/X Post, Thread
- YouTube Script, Shorts
- Blog Post, SEO
- Email Newsletter, Sales
- WhatsApp Broadcast
