# OpenClawSquad 🦞

Sistema de orquestração multi-agente para automação de tarefas.

## Agentes do Squad

### 🎯 Coordenação
| Agente | Descrição |
|--------|-----------|
| **Coordinator** | Coordena múltiplos agentes, gerencia workflows e上下游 |

### 🔍 Inteligência
| Agente | Descrição |
|--------|-----------|
| **Researcher** | Pesquisa informações, tendências e dados do setor |
| **Scraper** | Extrai dados de websites e APIs |

### 📊 Planejamento
| Agente | Descrição |
|--------|-----------|
| **Strategist** | Gera ideias e define abordagens estratégicas |

### ✍️ Conteúdo
| Agente | Descrição |
|--------|-----------|
| **Writer** | Produz conteúdo written (artigos, posts, documentos) |
| **Copywriter** | Cria textos persuasivos para marketing e vendas |

### ⚡ Execução
| Agente | Descrição |
|--------|-----------|
| **Executor** | Executa tarefas automatizadas e scripts |

### 🔎 Qualidade
| Agente | Descrição |
|--------|-----------|
| **Reviewer** | Revisa e garante qualidade do conteúdo |
| **CodeReviewer** | Revisa código e sugere melhorias |
| **Tester** | Executa testes e valida funcionalidades |

### 🛡️ Segurança
| Agente | Descrição |
|--------|-----------|
| **Pentester** | Testes de penetração e vulnerabilidades |
| **SecurityAuditor** | Auditorias de segurança completas |
| **BugHunter** | Caça e reporta bugs |

### 💻 Desenvolvimento
| Agente | Descrição |
|--------|-----------|
| **Architect** | Desenha arquiteturas de software e sistemas |
| **Debugger** | Identifica e corrige bugs em código |

### 📊 Dados
| Agente | Descrição |
|--------|-----------|
| **DataAnalyst** | Analisa dados e gera insights |
| **Visualizer** | Cria visualizações e gráficos |

### 📢 Marketing
| Agente | Descrição |
|--------|-----------|
| **SEOExpert** | Otimização para motores de busca |
| **SocialMediaManager** | Gerencia redes sociais e publicações |

### 💬 Comunicação
| Agente | Descrição |
|--------|-----------|
| **Translator** | Traduz conteúdo entre idiomas |
| **Summarizer** | Resume textos e documentos |
| **Tutor** | Ensina conceitos e explica tópicos |

### 📖 Especialistas
| Agente | Descrição |
|--------|-----------|
| **ProductSpecialist** | Especialista em produtos e funcionalidades |
| **SalesScript** | Cria roteiros de vendas e objeções |

### 🎥 Multimídia
| Agente | Descrição |
|--------|-----------|
| **VideoExtractor** | Extrai conteúdo de vídeos (YouTube, TikTok, etc) |
| **VideoLearner** | Assiste vídeos e extrai transcrições |

---

## Referências

Inspirado no [opensquad](https://github.com/renatoasse/opensquad) - Framework de orquestração multi-agente

### Melhores Práticas do Opensquad Incorporadas

1. **Agentes com responsabilidade única** - Cada agente tem uma função clara
2. **Pipelines com checkpoints** - Decisões importantes precisam de aprovação humana
3. **Pesquisa obrigatória** - Agentes de pesquisa usam subagentes
4. **Revisão obrigatória** - Todo conteúdo passa por revisão antes da entrega
5. **Formato .agent.md** - Estrutura padronizada com Persona, Princípios, Framework Operacional

---

## Uso

```bash
# Listar agentes
ls agents/

# Executar agente específico
python3 agent.py <agente> <tarefa>
```

---

## Arquitetura

```
agents/
├── coordinator.agent.md      # Coordenação geral
├── researcher.agent.md       # Pesquisa
├── strategist.agent.md       # Estratégia
├── writer.agent.md          # Redação
├── copywriter.agent.md      # Copywriting
├── reviewer.agent.md         # Revisão
├── pentester.agent.md       # Segurança
├── ...
```

---

**Criado por:** Jack Chakkal  
**GitHub:** https://github.com/jackchakkal/OpenClawSquad
