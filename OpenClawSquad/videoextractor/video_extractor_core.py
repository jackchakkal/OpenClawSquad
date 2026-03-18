#!/usr/bin/env python3
"""
VideoExtractor Core - Motor principal de extração
Versão completa com todas as funcionalidades
"""
import os
import re
import json
import subprocess
import tempfile
from urllib.parse import urlparse, parse_qs, quote
from playwright.sync_api import sync_playwright

class VideoExtractorCore:
    """Motor principal de extração de vídeos"""
    
    def __init__(self):
        self.browser = None
        self.playwright = None
        self.page = None
        self.context = None
        self.whisper_model = None
    
    # ==================== Browser ====================
    
    def start_browser(self):
        """Inicia o browser"""
        if self.playwright:
            return
        
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-gpu'
            ]
        )
        self.context = self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        self.page = self.context.new_page()
    
    def stop_browser(self):
        """Para o browser"""
        if self.browser:
            self.browser.close()
            self.browser = None
        if self.playwright:
            self.playwright.stop()
            self.playwright = None
    
    # ==================== Whisper ====================
    
    def init_whisper(self, model_size="small"):
        """Inicia o modelo Whisper"""
        if self.whisper_model:
            return True
        
        try:
            from faster_whisper import WhisperModel
            print(f"📥 Carregando Whisper {model_size}...")
            self.whisper_model = WhisperModel(
                model_size,
                device="cpu",
                compute_type="int8"
            )
            print("✅ Whisper carregado!")
            return True
        except Exception as e:
            print(f"⚠️ Erro Whisper: {e}")
            return False
    
    def transcribe_audio(self, audio_path, language="pt"):
        """Transcreve áudio com Whisper"""
        if not self.whisper_model:
            if not self.init_whisper():
                return {"error": "Whisper não disponível"}
        
        if not os.path.exists(audio_path):
            return {"error": "Arquivo não encontrado"}
        
        try:
            print(f"🎙️ Transcrevendo {audio_path}...")
            segments, info = self.whisper_model.transcribe(
                audio_path,
                language=language,
                beam_size=5,
                vad_filter=True
            )
            
            result_segments = []
            full_text = []
            
            for segment in segments:
                result_segments.append({
                    "text": segment.text.strip(),
                    "start": round(segment.start, 2),
                    "end": round(segment.end, 2)
                })
                full_text.append(segment.text.strip())
            
            return {
                "text": " ".join(full_text),
                "segments": result_segments,
                "language": info.language,
                "duration": round(info.duration, 2)
            }
        except Exception as e:
            return {"error": str(e)}
    
    # ==================== Platform Detection ====================
    
    def detect_platform(self, url):
        """Detecta a plataforma"""
        parsed = urlparse(url)
        domain = parsed.netloc.lower().replace('www.', '')
        
        platforms = {
            'youtube': ['youtube.com', 'youtu.be'],
            'tiktok': ['tiktok.com'],
            'instagram': ['instagram.com'],
            'twitter': ['twitter.com', 'x.com'],
            'facebook': ['facebook.com', 'fb.watch'],
            'vimeo': ['vimeo.com'],
            'twitch': ['twitch.tv']
        }
        
        for platform, domains in platforms.items():
            if any(d in domain for d in domains):
                return platform
        return 'unknown'
    
    def extract_video_id(self, url, platform=None):
        """Extrai ID do vídeo"""
        if not platform:
            platform = self.detect_platform(url)
        
        parsed = urlparse(url)
        
        if platform == 'youtube':
            if 'youtu.be' in parsed.netloc:
                return parsed.path[1:]
            qs = parse_qs(parsed.query)
            return qs.get('v', [None])[0]
        
        elif platform == 'tiktok':
            parts = [p for p in parsed.path.split('/') if p]
            for i, p in enumerate(parts):
                if p == 'video' and i + 1 < len(parts):
                    return parts[i + 1]
        
        elif platform == 'instagram':
            parts = [p for p in parsed.path.split('/') if p]
            for p in parts:
                if p in ['reel', 'p']:
                    idx = parts.index(p)
                    if idx + 1 < len(parts):
                        return parts[idx + 1]
        
        elif platform in ['twitter', 'x']:
            parts = [p for p in parsed.path.split('/') if p]
            for i, p in enumerate(parts):
                if p == 'status' and i + 1 < len(parts):
                    return parts[i + 1]
        
        return None
    
    # ==================== YouTube ====================
    
    def extract_youtube(self, url):
        """Extrai dados do YouTube"""
        self.start_browser()
        
        self.page.goto(url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(3000)
        
        # Metadata
        metadata = self.page.evaluate("""
            () => {
                const player = document.querySelector('#movie_player');
                const vd = player ? player.getVideoData() : {};
                const channel = document.querySelector('#channel-name');
                const viewEl = document.querySelector('.view-count');
                const dateEl = document.querySelector('#date');
                const likes = document.querySelector('#segmented-like-button');
                
                return {
                    title: vd.title || document.title.replace(' - YouTube', ''),
                    author: vd.author || '',
                    channelUrl: channel ? channel.querySelector('a')?.href : '',
                    viewCount: viewEl ? viewEl.innerText : '',
                    publishDate: dateEl ? dateEl.innerText : '',
                    videoId: vd.video_id,
                    length: vd.length_seconds,
                    isLive: vd.isLive || false,
                    category: vd.category || ''
                };
            }
        """)
        
        # Description
        try:
            more = self.page.query_selector('#more')
            if more:
                more.click()
                self.page.wait_for_timeout(500)
        except:
            pass
        
        try:
            desc = self.page.query_selector('#description-inline-expander')
            if desc:
                metadata['description'] = desc.inner_text()
        except:
            metadata['description'] = ''
        
        # Tags
        try:
            metadata['tags'] = self.page.evaluate("""
                () => {
                    const meta = document.querySelector('meta[name="keywords"]');
                    return meta ? meta.content.split(',').map(t => t.trim()) : [];
                }
            """)
        except:
            metadata['tags'] = []
        
        # Thumbnail
        video_id = metadata.get('videoId')
        if video_id:
            metadata['thumbnail'] = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        
        return metadata
    
    def get_youtube_transcript(self):
        """Tenta obter transcrição do YouTube"""
        try:
            # Menu
            try:
                more = self.page.query_selector('button[aria-label="More actions"]')
                if more:
                    more.click()
                    self.page.wait_for_timeout(1000)
                    
                    menu = self.page.query_selector('ytd-menu-popup-renderer')
                    if menu:
                        items = menu.query_selector_all('ytd-menu-service-item-renderer')
                        for item in items:
                            if 'transcript' in item.inner_text().lower():
                                item.click()
                                self.page.wait_for_timeout(2000)
                                break
            except:
                pass
            
            # Painel
            panel = self.page.query_selector('ytd-transcript-renderer')
            if panel:
                segments = panel.query_selector_all('ytd-transcript-segment-renderer')
                if segments:
                    result = []
                    for seg in segments:
                        ts = seg.query_selector('.timestamp')
                        txt = seg.query_selector('.text')
                        if ts and txt:
                            result.append({
                                "timestamp": ts.inner_text(),
                                "text": txt.inner_text()
                            })
                    return {
                        "found": True,
                        "segments": result,
                        "source": "youtube_auto"
                    }
            
            return {"found": False, "error": "Transcrição não disponível"}
        except Exception as e:
            return {"found": False, "error": str(e)}
    
    def download_youtube_audio(self, url, output_path=None):
        """Baixa áudio do YouTube"""
        if not output_path:
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
                output_path = f.name
        
        cmd = [
            'yt-dlp',
            '-x', '--audio-format', 'mp3',
            '--output', f'{output_path}.%(ext)s',
            '--quiet',
            '--no-warnings',
            url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            actual_path = f'{output_path}.mp3'
            if os.path.exists(actual_path):
                return actual_path
        
        return None
    
    # ==================== TikTok ====================
    
    def extract_tiktok(self, url):
        """Extrai dados do TikTok"""
        self.start_browser()
        
        self.page.goto(url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(3000)
        
        metadata = self.page.evaluate("""
            () => {
                return {
                    title: document.title,
                    description: document.querySelector('[data-e2e="video-desc"]')?.innerText || '',
                    author: document.querySelector('[data-e2e="video-author-uniqueid"]')?.innerText || '',
                    nickname: document.querySelector('[data-e2e="video-author-name"]')?.innerText || '',
                    stats: {
                        likes: document.querySelector('[data-e2e="like-count"]')?.innerText || '0',
                        comments: document.querySelector('[data-e2e="comment-count"]')?.innerText || '0',
                        shares: document.querySelector('[data-e2e="share-count"]')?.innerText || '0',
                        views: document.querySelector('[data-e2e="browse-video-detail"]')?.innerText || '0'
                    },
                    music: document.querySelector('[data-e2e="video-music"]')?.innerText || '',
                    createTime: document.querySelector('[data-e2e="video-created-time"]')?.innerText || '',
                    verified: document.querySelector('[data-e2e="video-author-avatar"]')?.innerHTML || ''
                };
            }
        """)
        
        return metadata
    
    # ==================== Instagram ====================
    
    def extract_instagram(self, url):
        """Extrai dados do Instagram"""
        self.start_browser()
        
        self.page.goto(url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(3000)
        
        metadata = self.page.evaluate("""
            () => {
                return {
                    title: document.title,
                    type: url.includes('/reel/') ? 'reel' : (url.includes('/p/') ? 'post' : 'unknown'),
                    description: document.querySelector('h1')?.innerText || '',
                    likes: document.querySelector('section span[aria-label]')?.innerText || '',
                    comments: document.querySelector('ul li')?.innerText || '',
                };
            }
        """)
        
        return metadata
    
    # ==================== Twitter ====================
    
    def extract_twitter(self, url):
        """Extrai dados do Twitter/X"""
        self.start_browser()
        
        self.page.goto(url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(3000)
        
        metadata = self.page.evaluate("""
            () => {
                const tweet = document.querySelector('[data-testid="tweet"]');
                return {
                    text: tweet?.innerText || '',
                    author: document.querySelector('[data-testid="User-Name"]')?.innerText || '',
                    time: document.querySelector('time')?.innerText || '',
                    metrics: {
                        likes: document.querySelector('[data-testid="like"]')?.innerText || '0',
                        retweets: document.querySelector('[data-testid="retweet"]')?.innerText || '0',
                        replies: document.querySelector('[data-testid="reply"]')?.innerText || '0',
                        views: document.querySelector('[data-testid="view-count"]')?.innerText || '0'
                    }
                };
            }
        """)
        
        return metadata
    
    # ==================== Facebook ====================
    
    def extract_facebook(self, url):
        """Extrai dados do Facebook"""
        self.start_browser()
        
        self.page.goto(url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(3000)
        
        metadata = self.page.evaluate("""
            () => {
                return {
                    title: document.title,
                    text: document.querySelector('[data-pagelet="FeedUnit"]')?.innerText.substring(0, 1000) || '',
                    author: document.querySelector('[data-pagelet="Story"]')?.innerText || '',
                    metrics: {
                        likes: document.querySelector('[aria-label="Like"]')?.innerText || '0',
                        comments: document.querySelector('[aria-label="Comment"]')?.innerText || '0',
                        shares: document.querySelector('[aria-label="Share"]')?.innerText || '0'
                    }
                };
            }
        """)
        
        return metadata
    
    # ==================== Main Methods ====================
    
    def extract_all(self, url, include_transcript=True, use_whisper=False, whisper_model="small"):
        """Extrai tudo do vídeo"""
        platform = self.detect_platform(url)
        video_id = self.extract_video_id(url, platform)
        
        result = {
            "url": url,
            "platform": platform,
            "video_id": video_id,
            "success": False
        }
        
        try:
            if platform == 'youtube':
                result["metadata"] = self.extract_youtube(url)
                
                if include_transcript:
                    result["transcript"] = self.get_youtube_transcript()
                    
                    # Se não encontrou e quer Whisper
                    if use_whisper and not result.get("transcript", {}).get("found"):
                        audio_path = self.download_youtube_audio(url)
                        if audio_path:
                            result["whisper_transcript"] = self.transcribe_audio(audio_path)
                            try:
                                os.remove(audio_path)
                            except:
                                pass
            
            elif platform == 'tiktok':
                result["metadata"] = self.extract_tiktok(url)
            
            elif platform == 'instagram':
                result["metadata"] = self.extract_instagram(url)
            
            elif platform in ['twitter', 'x']:
                result["metadata"] = self.extract_twitter(url)
            
            elif platform == 'facebook':
                result["metadata"] = self.extract_facebook(url)
            
            else:
                result["error"] = f"Plataforma não suportada: {platform}"
                return result
            
            result["success"] = True
            
        except Exception as e:
            result["error"] = str(e)
        
        return result
    
    def extract_metadata(self, url):
        """Só metadata"""
        return self.extract_all(url, include_transcript=False)
    
    def extract_transcript(self, url, language="pt", force_whisper=False):
        """Só transcrição"""
        platform = self.detect_platform(url)
        
        if platform == 'youtube':
            # Tenta transcrição nativa primeiro
            transcript = self.get_youtube_transcript()
            
            if not transcript.get("found") or force_whisper:
                # Baixa e transcreve com Whisper
                audio_path = self.download_youtube_audio(url)
                if audio_path:
                    result = self.transcribe_audio(audio_path, language)
                    try:
                        os.remove(audio_path)
                    except:
                        pass
                    return result
            
            return transcript
        
        return {"error": "Transcrição não disponível para esta plataforma"}
    
    def search_youtube(self, query, limit=10):
        """Pesquisa no YouTube"""
        self.start_browser()
        
        search_url = f"https://www.youtube.com/results?search_query={quote(query)}"
        self.page.goto(search_url, wait_until='networkidle', timeout=90000)
        self.page.wait_for_timeout(2000)
        
        results = self.page.evaluate(f"""
            () => {{
                const items = document.querySelectorAll('ytd-video-renderer');
                const results = [];
                
                for (let i = 0; i < Math.min(items.length, {limit}); i++) {{
                    const item = items[i];
                    const link = item.querySelector('#video-title');
                    const views = item.querySelector('#metadata-line');
                    const channel = item.querySelector('#channel-name');
                    const thumb = item.querySelector('img');
                    
                    if (link) {{
                        results.push({{
                            title: link.innerText,
                            url: link.href,
                            videoId: link.href.split('v=')[1]?.split('&')[0] || '',
                            views: views ? views.innerText : '',
                            channel: channel ? channel.innerText : '',
                            thumbnail: thumb ? thumb.src : ''
                        }});
                    }}
                }}
                
                return results;
            }}
        """)
        
        return {"results": results, "query": query, "count": len(results)}
    
    def __del__(self):
        """Cleanup"""
        self.stop_browser()
