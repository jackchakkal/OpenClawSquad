# OpenClawSquad Dashboard 🦞

## Escritório Virtual 2D

O OpenClawSquad inclui um dashboard visual 2D que mostra seus agentes trabalhando em tempo real.

## Como Usar

### Opção 1: Servir Localmente

```bash
# No diretório do projeto
cd dashboard

# Usar Python
python3 -m http.server 3000

# Ou Node.js
npx serve .
```

### Opção 2: Abrir Diretamente

Basta abrir o arquivo `index.html` em qualquer navegador.

## Funcionalidades

### Visualização 2D dos Agentes
- Cada agente aparece como um avatar no "escritório"
- Cores indicam status:
  - ⚪ Cinza: Aguardando
  - 🟡 Amarelo: Trabalhando
  - 🟢 Verde: Concluído
  - 🔴 Vermelho: Erro

### Sidebar de Agentes
- Lista todos os agentes do squad atual
- Mostra status em tempo real
- Clique para ver detalhes

### Painel de Atividade
- Mostra logs de atividade recentes
- Atualiza automaticamente
- Formato: HH:MM - Agente: Mensagem

### Seletor de Squads
- Conteúdo
- Segurança
- Dados

## Integração Futura

Planejado:
- [ ] Conectar com API real do OpenClaw
- [ ] Mostrar execução real dos agentes
- [ ] Checkpoints visuais
- [ ] Notificações em tempo real

---

**Dashboards disponíveis em:** `dashboard/`
