#!/usr/bin/env python3
"""
VideoExtractor API - Sua própria alternativa ao Supadata
API completa com FastAPI para extrair conteúdo de vídeos
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import json
import sys
import os

# Import our extractor
from video_extractor_core import VideoExtractorCore

app = FastAPI(
    title="VideoExtractor API",
    description="Sua própria alternativa ao Supadata - Extraia conteúdo de vídeos de graça!",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ExtractRequest(BaseModel):
    url: str
    platform: Optional[str] = None
    include_transcript: bool = True
    include_whisper: bool = False
    whisper_model: Optional[str] = "small"

class TranscriptRequest(BaseModel):
    url: str
    language: Optional[str] = "pt"
    force_whisper: bool = False

class MetadataRequest(BaseModel):
    url: str

# Initialize extractor
extractor = VideoExtractorCore()

@app.get("/")
async def root():
    return {
        "name": "VideoExtractor API",
        "version": "1.0.0",
        "description": "Sua própria alternativa ao Supadata",
        "endpoints": {
            "/extract": "Extrai tudo do vídeo",
            "/metadata": "Só metadata",
            "/transcript": "Só transcrição",
            "/platforms": "Plataformas suportadas",
            "/health": "Health check"
        }
    }

@app.get("/platforms")
async def get_platforms():
    return {
        "platforms": [
            {"name": "youtube", "status": "✅"},
            {"name": "tiktok", "status": "✅"},
            {"name": "instagram", "status": "✅"},
            {"name": "twitter", "status": "✅"},
            {"name": "facebook", "status": "✅"},
            {"name": "vimeo", "status": "🟡"},
            {"name": "twitch", "status": "🟡"}
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "extractor": "ready"}

@app.post("/extract")
async def extract_all(request: ExtractRequest):
    """Extrai tudo: metadata + transcrição + análise"""
    try:
        result = extractor.extract_all(
            url=request.url,
            include_transcript=request.include_transcript,
            use_whisper=request.include_whisper,
            whisper_model=request.whisper_model
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/metadata")
async def get_metadata(request: MetadataRequest):
    """Só metadata"""
    try:
        result = extractor.extract_metadata(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcript")
async def get_transcript(request: TranscriptRequest):
    """Só transcrição"""
    try:
        result = extractor.extract_transcript(
            url=request.url,
            language=request.language,
            force_whisper=request.force_whisper
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/youtube/search")
async def search_youtube(q: str = Query(...), limit: int = 10):
    """Pesquisa no YouTube"""
    try:
        results = extractor.search_youtube(q, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def main():
    print("""
🎬 VideoExtractor API
====================
Iniciando servidor em http://localhost:8000

Endpoints disponíveis:
- GET  /              - Info
- GET  /platforms    - Plataformas
- GET  /health        - Health check
- POST /extract      - Extrai tudo
- POST /metadata     - Só metadata
- POST /transcript   - Só transcrição
- GET  /youtube/search - Pesquisa
    """)
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
