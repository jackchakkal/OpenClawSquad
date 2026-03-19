# 🦞 Guia de Início — OpenClawSquad

Este guia é para quem está começando do zero. Siga cada passo com calma.

---

## Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configurar o projeto localmente](#2-configurar-o-projeto-localmente)
3. [Publicar o repositório no GitHub](#3-publicar-o-repositório-no-github)
4. [Publicar o pacote no npm](#4-publicar-o-pacote-no-npm)
5. [Usar o OpenClawSquad](#5-usar-o-openclawsquad)
6. [Resolução de problemas comuns](#6-resolução-de-problemas-comuns)

---

## 1. Pré-requisitos

Antes de começar, você precisa ter instalado:

### Node.js (versão 20 ou superior)

1. Acesse [https://nodejs.org](https://nodejs.org)
2. Baixe a versão **LTS** (a recomendada)
3. Instale normalmente
4. Verifique a instalação abrindo o terminal e digitando:
   ```bash
   node --version
   ```
   Deve aparecer algo como `v20.x.x` ou superior.

### Git

1. Acesse [https://git-scm.com](https://git-scm.com)
2. Baixe e instale para o seu sistema operacional
3. Verifique com:
   ```bash
   git --version
   ```

### Conta no GitHub

- Crie em [https://github.com/signup](https://github.com/signup) (gratuito)

### Conta no npm

- Crie em [https://www.npmjs.com/signup](https://www.npmjs.com/signup) (gratuito)

---

## 2. Configurar o projeto localmente

### Passo 1 — Baixar as dependências

Abra o terminal **dentro da pasta do projeto** e execute:

```bash
npm install
```

Aguarde terminar. Isso instala todos os pacotes necessários.

### Passo 2 — Criar o arquivo de configuração

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
# No Linux/Mac:
cp .env.example .env

# No Windows (cmd):
copy .env.example .env
```

### Passo 3 — Configurar sua chave de API

Abra o arquivo `.env` em qualquer editor de texto (Bloco de Notas, VS Code, etc.) e preencha pelo menos **uma** das chaves de API abaixo:

```env
# Chave da Anthropic (Claude) — recomendado
ANTHROPIC_API_KEY=sua-chave-aqui

# Chave da OpenAI — alternativa
OPENAI_API_KEY=sua-chave-aqui
```

Para obter uma chave da Anthropic: [https://console.anthropic.com](https://console.anthropic.com)
Para obter uma chave da OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Passo 4 — Testar se está funcionando

```bash
node bin/openclawsquad.js --version
```

Deve aparecer: `1.0.0`

---

## 3. Publicar o repositório no GitHub

Os badges de **estrelas** e **issues** no README só funcionam quando o repositório está **público** no GitHub.

### Passo 1 — Criar o repositório no GitHub

1. Acesse [https://github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name**: `OpenClawSquad`
   - **Description**: `Multi-agent orchestration framework`
   - Marque **Public** (não Private)
3. **NÃO** marque "Add a README file" (já temos um)
4. Clique em **Create repository**

### Passo 2 — Conectar o projeto local ao GitHub

No terminal, dentro da pasta do projeto:

```bash
git remote set-url origin https://github.com/SEU_USUARIO/OpenClawSquad.git
```

> Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

### Passo 3 — Enviar o código para o GitHub

```bash
git push -u origin main
```

Se pedir usuário e senha, use seu usuário do GitHub e um **Personal Access Token** (não a senha normal).

Para criar um token: [https://github.com/settings/tokens](https://github.com/settings/tokens)
- Clique em **Generate new token (classic)**
- Marque a permissão **repo**
- Copie e use como senha

### Passo 4 — Verificar

Acesse `https://github.com/SEU_USUARIO/OpenClawSquad` e veja se o projeto aparece. Os badges de stars e issues devem começar a funcionar.

---

## 4. Publicar o pacote no npm

O badge de **npm** só funciona depois que o pacote for publicado.

### Passo 1 — Fazer login no npm

```bash
npm login
```

Digite seu usuário, senha e email do npmjs.com. Se tiver autenticação de dois fatores, confirme no email.

### Passo 2 — Verificar o nome do pacote

O pacote se chama `openclawsquad` (definido no `package.json`). Se esse nome já estiver ocupado no npm, você precisará mudá-lo.

Verifique se o nome está disponível:
```bash
npm view openclawsquad
```

- Se aparecer `404 Not Found` → nome disponível, continue.
- Se aparecer informações de um pacote → nome ocupado, mude no `package.json`.

### Passo 3 — Publicar

```bash
npm publish
```

Aguarde a publicação. Após alguns minutos, o pacote estará disponível em:
`https://www.npmjs.com/package/openclawsquad`

### Passo 4 — Verificar o badge

Aguarde até **10 minutos** para o badge atualizar no README. Pode ser necessário dar um hard refresh (Ctrl+Shift+R) na página do GitHub.

---

## 5. Usar o OpenClawSquad

### Instalação global (após publicar no npm)

```bash
npm install -g openclawsquad
```

### Criar um novo projeto

```bash
mkdir meu-projeto
cd meu-projeto
npx openclawsquad init
```

### Criar um squad

```bash
npx openclawsquad create meu-time
```

### Executar um squad

```bash
npx openclawsquad run meu-time
```

### Ver o dashboard em tempo real

```bash
npx openclawsquad dashboard
```

Abra o navegador em `http://localhost:3001`

### Comandos disponíveis

| Comando | O que faz |
|---------|-----------|
| `openclawsquad init` | Inicializa o projeto na pasta atual |
| `openclawsquad create <nome>` | Cria um novo squad interativamente |
| `openclawsquad run <squad>` | Executa um squad |
| `openclawsquad dashboard` | Inicia o painel de controle |
| `openclawsquad agents` | Lista os agentes disponíveis |
| `openclawsquad skills` | Lista as skills instaladas |
| `openclawsquad runs` | Ver histórico de execuções |
| `openclawsquad --help` | Ver todos os comandos |

---

## 6. Resolução de problemas comuns

### "Cannot find module" ao executar

Execute `npm install` na pasta do projeto para instalar as dependências.

### "node: command not found"

Node.js não está instalado ou não está no PATH. Reinstale seguindo o Passo 1 do item 1.

### "ANTHROPIC_API_KEY is not set"

O arquivo `.env` não foi criado ou a chave não foi preenchida. Siga o Passo 2 e 3 do item 2.

### Badge npm continua com erro após publicar

Aguarde até 10 minutos. O shields.io tem cache. Tente limpar o cache do navegador.

### "npm ERR! 403 Forbidden" ao publicar

- Verifique se está logado: `npm whoami`
- O nome do pacote pode estar ocupado; mude a propriedade `name` no `package.json`

### "git push" pede usuário e senha repetidamente

Configure o Git para lembrar as credenciais:
```bash
git config --global credential.helper store
```

Depois faça o push novamente e insira suas credenciais uma vez.

### Erro de permissão ao instalar globalmente (Linux/Mac)

Use `sudo`:
```bash
sudo npm install -g openclawsquad
```

---

## Precisa de ajuda?

- Abra uma issue em: [https://github.com/jackchakkal/OpenClawSquad/issues](https://github.com/jackchakkal/OpenClawSquad/issues)
- Leia a documentação completa: [MANUAL_EN.md](./MANUAL_EN.md) | [MANUAL_PT.md](./MANUAL_PT.md)
