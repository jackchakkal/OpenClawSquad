#!/usr/bin/env python3
"""
YouTube Audio Downloader + Whisper Transcription
Alternativa sem cookies para transcrever vídeos do YouTube
"""

import subprocess
import sys
import os
from pathlib import Path

VENV_PY = "/root/.openclaw/workspace/venv/bin/python"

def download_audio(youtube_url: str, output_dir: str = "/tmp") -> str:
    """Baixa áudio do YouTube usando yt-dlp com headers de browser"""
    
    print(f"📥 Baixando áudio de: {youtube_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
    }
    
    headers_str = " ".join([f"--add-header '{k}: {v}'" for k, v in headers.items()])
    
    cmd = f"""
        yt-dlp {headers_str} \
        -f 'bestaudio[ext=m4a]/best[ext=mp4]/best' \
        --extract-audio \
        --audio-format mp3 \
        --audio-quality 0 \
        -o '{output_dir}/%(title)s.%(ext)s' \
        --no-playlist \
        '{youtube_url}'
    """
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            print(f"❌ Erro no download: {result.stderr}")
            return None
            
        files = list(Path(output_dir).glob("*.mp3")) + list(Path(output_dir).glob("*.m4a"))
        
        if files:
            audio_file = max(files, key=os.path.getmtime)
            print(f"✅ Áudio baixado: {audio_file}")
            return str(audio_file)
        
        return None
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None


def transcribe_audio(audio_file: str, language: str = "pt") -> str:
    """Transcreve áudio usando Faster-Whisper"""
    
    print(f"🎤 Transcrevendo: {audio_file}")
    
    # Salvar script temporário
    script = f"""
import sys
from faster_whisper import WhisperModel

print("📥 Carregando modelo whisper...")
model = WhisperModel("small", device="cpu", compute_type="int8")

print("🎤 Transcrevendo...")
segments, info = model.transcribe("{audio_file}", language="{language}")

print(f"✅ Idioma: {{info.language}} ({{info.language_probability:.2f}})")

transcript = []
for segment in segments:
    text = segment.text.strip()
    if text:
        transcript.append(text)

result = " ".join(transcript)
print("===TRANSCRIPT_START===")
print(result)
print("===TRANSCRIPT_END===")
"""
    
    with open("/tmp/whisper_script.py", "w") as f:
        f.write(script)
    
    cmd = [VENV_PY, "/tmp/whisper_script.py"]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        
        if result.returncode != 0:
            print(f"❌ Erro: {result.stderr}")
            return None
            
        output = result.stdout
        
        # Extrair transcrição entre marcadores
        if "===TRANSCRIPT_START===" in output:
            transcript = output.split("===TRANSCRIPT_START===")[1].split("===TRANSCRIPT_END===")[0].strip()
            return transcript
        else:
            print(output)
            return None
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 youtube_transcribe.py <youtube_url>")
        sys.exit(1)
    
    youtube_url = sys.argv[1]
    
    audio_file = download_audio(youtube_url)
    
    if not audio_file:
        print("❌ Falha no download")
        sys.exit(1)
    
    transcript = transcribe_audio(audio_file)
    
    if transcript:
        print("\n" + "="*50)
        print("✅ TRANSCRIÇÃO COMPLETA:")
        print("="*50)
        print(transcript)
    else:
        print("❌ Falha na transcrição")
        sys.exit(1)


if __name__ == "__main__":
    main()
