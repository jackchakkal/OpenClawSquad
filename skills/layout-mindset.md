# Layout Carrossel Instagram - Estilo "Mindset Viral"

## Especificações Técnicas

### Dimensões
- **Largura:** 1080px
- **Altura:** 1440px
- **Proporção:** 3:4 (Instagram Carousel)

### Fonte
- **Família:** Space Grotesk (Google Fonts)
- **Peso texto:** 700 (bold)
- **Tamanho texto principal:** 75px
- **Tamanho emoji:** 120px
- **Line-height:** 1.2
- **Cor texto:** #ffffff
- **Cor destaque:** #e94560

### Cores do Fundo
```css
/* Gradiente de fundo */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

/* Blob decorativo 1 (rosa) */
background: linear-gradient(135deg, #e94560, #ff6b8a);
width/height: 600px;
border-radius: 50%;
filter: blur(100px);
opacity: 0.4;
position: top: -200px; right: -200px;
animation: float 8s ease-in-out infinite;

/* Blob decorativo 2 (azul) */
background: #0f3460;
position: bottom: -200px; left: -200px;
```

## Estrutura HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* CSS completo abaixo */
  </style>
</head>
<body>
  <!-- Fundo com gradiente -->
  <div class="bg"></div>
  
  <!-- Elementos decorativos blobs -->
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  
  <!-- Conteúdo principal -->
  <div class="content">
    <span class="slide-num">01</span>
    <div class="emoji">🧠</div>
    <div class="text">Seu texto aqui com <span class="highlight">destaque</span>.</div>
  </div>
  
  <!-- Handle Instagram -->
  <div class="handle">@mais1rodrigo</div>
  
  <!-- Barra de progresso -->
  <div class="progress">
    <div class="dot active"></div>  <!-- slide atual -->
    <div class="dot"></div>
    <div class="dot"></div>
    <!-- ... (8 dots para 8 slides) -->
  </div>
</body>
</html>
```

## CSS Completo

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body { 
  width: 1080px; 
  height: 1440px; 
  overflow: hidden; 
  font-family: 'Space Grotesk', sans-serif; 
  position: relative; 
}

.bg { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); 
}

.blob { 
  position: absolute; 
  width: 600px; 
  height: 600px; 
  background: linear-gradient(135deg, #e94560, #ff6b8a); 
  border-radius: 50%; 
  filter: blur(100px); 
  opacity: 0.4; 
  animation: float 8s ease-in-out infinite; 
}

.blob-1 { top: -200px; right: -200px; }
.blob-2 { bottom: -200px; left: -200px; background: #0f3460; }

@keyframes float { 
  0%, 100% { transform: translate(0, 0); } 
  50% { transform: translate(30px, 30px); } 
}

.content { 
  position: relative; 
  text-align: center; 
  z-index: 10; 
  height: 100%; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  padding: 80px; 
}

.slide-num { 
  position: absolute; 
  top: 60px; 
  left: 60px; 
  font-size: 180px; 
  font-weight: 800; 
  color: rgba(255,255,255,0.05); 
  line-height: 1; 
}

.text { 
  font-size: 75px; 
  font-weight: 700; 
  color: #fff; 
  line-height: 1.2; 
  max-width: 950px; 
  text-align: center; 
}

.text .highlight { 
  color: #e94560; 
}

.emoji { 
  font-size: 120px; 
  margin-bottom: 30px; 
  text-align: center; 
}

.handle { 
  position: absolute; 
  bottom: 100px; 
  left: 50%; 
  transform: translateX(-50%); 
  font-size: 24px; 
  color: #e94560; 
  font-weight: 600; 
}

.progress { 
  position: absolute; 
  bottom: 60px; 
  left: 50%; 
  transform: translateX(-50%); 
  display: flex; 
  gap: 12px; 
}

.dot { 
  width: 12px; 
  height: 12px; 
  border-radius: 50%; 
  background: rgba(255,255,255,0.2); 
}

.dot.active { 
  background: #e94560; 
  width: 40px; 
  border-radius: 6px; 
}
```

## Slide de CTA (Último Slide)

```html
<div class="content">
  <span class="slide-num">08</span>
  <div class="emoji">💡</div>
  <div class="text">Texto motivacional aqui.<br>Continuação do texto.</div>
  <div class="cta">💾 SALVE ESTE CARROSSEL</div>
</div>

<!-- CTA Styling -->
.cta { 
  background: linear-gradient(135deg, #e94560, #ff6b8a); 
  padding: 30px 60px; 
  border-radius: 16px; 
  font-size: 28px; 
  font-weight: 700; 
  color: #fff; 
  box-shadow: 0 20px 60px rgba(233, 69, 96, 0.4); 
  display: inline-block; 
}
```

## Variáveis de Cores

| Variável | Cor | Uso |
|----------|-----|-----|
| --bg-dark | #1a1a2e | Fundo principal |
| --bg-mid | #16213e | Meio do gradiente |
| --bg-light | #0f3460 | Fundo gradiente |
| --accent | #e94560 | Rosa vibrnto (destaque) |
| --accent-light | #ff6b8a | Rosa claro (hover) |
| --text-white | #ffffff | Texto principal |
| --text-muted | rgba(255,255,255,0.7) | Texto secundário |
| --dot-inactive | rgba(255,255,255,0.2) | Dot inativo |

## Renderização

Para renderizar os slides em PNG:

```javascript
// 1. Iniciar servidor HTTP local
python3 -m http.server 8765 --directory "/caminho/slides"

// 2. Usar Playwright
await page.goto('http://localhost:8765/slide-01.html');
await page.screenshot({ 
  path: 'slide-01.png', 
  fullPage: false,
  clip: { x: 0, y: 0, width: 1080, height: 1440 }
});
```

## Dicas para o Agente

1. **Tamanhos de fonte:** 75px para texto, 120px para emojis
2. **Sempre centralizar:** texto-align: center no .content, .text e .emoji
3. **Handle:** sempre acima da barra de progresso (bottom: 100px)
4. **Progress bar:** 8 dots para 8 slides, marcar .active no slide atual
5. **Emoji:** usar emoji relevante para cada frase
6. **Highlight:** usar span class="highlight" para palavra-chave
7. **CTA:** último slide com botão "SALVE ESTE CARROSSEL"
