# 🎬 VideoExtractor

**Sua própria alternativa 100% gratuita ao Supadata!**

Extraia conteúdo de vídeos do YouTube, TikTok, Instagram, Twitter/X e Facebook sem pagar nada!

## ✨ Funcionalidades

| Recurso | Status | Descrição |
|---------|--------|------------|
| 📊 Metadata | ✅ | Título, views, likes, canal, descrição, tags |
| 📜 Transcript Existente | ✅ | Extrai legendas se existirem |
| 🎙️ Transcrição AI | ✅ | Faster-Whisper (local, grátis!) |
| 🔍 Pesquisa | ✅ | Pesquise no YouTube |
| 🌐 Multi-plataforma | ✅ | YouTube, TikTok, Instagram, Twitter, Facebook |
| 🚀 API REST | ✅ | FastAPI integrada |

## 💰 Comparativo

| Serviço | Preço | VideoExtractor |
|---------|-------|----------------|
| Supadata | $9+/mês | **GRÁTIS** |
| AssemblyAI | $0.33/min | **GRÁTIS** |
| Deepgram | $0.01/min | **GRÁTIS** |

## 🚀 Instalação

```bash
# Clone o projeto
git clone https://github.com/jackchakkal/VideoExtractor.git
cd VideoExtractor

# Crie ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instale dependências
pip install -r requirements.txt

# Instale o browser
playwright install chromium

# Instale ffmpeg (Linux)
apt-get install ffmpeg
# ou (Mac)
brew install ffmpeg
```

## 📖 Uso

### Linha de Comando

```bash
# Extrair tudo
python main.py "https://www.youtube.com/watch?v=..."

# Sem Whisper (mais rápido)
python main.py "https://www.youtube.com/watch?v=..." --no-whisper

# Apenas metadata
python cli.py --url "https://www.youtube.com/watch?v=..." --metadata-only
```

### API

```bash
# Iniciar servidor
cd api
python main.py

# Ou com uvicorn
uvicorn api.main:app --reload
```

#### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/` | Info da API |
| GET | `/platforms` | Plataformas suportadas |
| GET | `/health` | Health check |
| POST | `/extract` | Extrai tudo |
| POST | `/metadata` | Só metadata |
| POST | `/transcript` | Só transcrição |
| GET | `/youtube/search?q=...` | Pesquisa |

#### Exemplo de uso da API

```bash
# Extrair tudo
curl -X POST http://localhost:8000/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=...", "include_whisper": true}'

# Só metadata
curl -X POST http://localhost:8000/metadata \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=..."}'
```

## 🧪 Testes

```bash
# Executar testes
python test.py
```

## 📁 Estrutura

```
VideoExtractor/
├── api/
│   └── main.py          # API FastAPI
├── cli.py               # Interface CLI
├── main.py             # Script principal
├── video_extractor_core.py  # Motor de extração
├── test.py             # Testes
├── requirements.txt    # Dependências
└── README.md          # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Optional: Configure um proxy
export HTTP_PROXY="http://proxy:8080"
export HTTPS_PROXY="http://proxy:8080"

# Optional: API keys (se quiser usar serviços externos)
export OPENAI_API_KEY="sk-..."
```

### Modelos Whisper

O modelo é baixado automaticamente na primeira execução:
- `tiny` - Mais rápido, menos preciso (~75MB)
- `small` - Balanceado (~250MB)
- `medium` - Mais preciso (~1.5GB)
- `large` - Mais preciso (~3GB)

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova`)
5. Crie um Pull Request

## 📝 Licença

MIT License - Use como quiser!

---

**Feito com ❤️ pelo Carinha + Jack**
**Versão:** 1.0.0
