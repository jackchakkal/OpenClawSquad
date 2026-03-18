#!/usr/bin/env python3
"""
VideoExtractor CLI - Interface de linha de comando
"""
import argparse
import json
import sys
from video_extractor_core import VideoExtractorCore

def main():
    parser = argparse.ArgumentParser(
        description="🎬 VideoExtractor - Extraia conteúdo de vídeos de graça!"
    )
    parser.add_argument("url", help="URL do vídeo")
    parser.add_argument("--metadata-only", action="store_true", help="Apenas metadata")
    parser.add_argument("--transcript-only", action="store_true", help="Apenas transcrição")
    parser.add_argument("--no-whisper", action="store_true", help="Não usar Whisper")
    parser.add_argument("--whisper-model", default="small", choices=["tiny", "small", "medium", "large"], help="Modelo Whisper")
    parser.add_argument("--output", "-o", help="Salvar resultado em arquivo JSON")
    parser.add_argument("--search", help="Pesquisar no YouTube")
    
    args = parser.parse_args()
    
    extractor = VideoExtractorCore()
    
    try:
        # Pesquisa
        if args.search:
            print(f"🔍 Pesquisando: {args.search}")
            results = extractor.search_youtube(args.search)
            print(f"\n📊 Encontrados {len(results.get('results', []))} resultados:\n")
            for r in results.get('results', []):
                print(f"  🎬 {r.get('title', 'N/A')}")
                print(f"     👁️ {r.get('views', 'N/A')} | 📺 {r.get('channel', 'N/A')}")
                print(f"     🔗 {r.get('url', 'N/A')}")
                print()
            extractor.stop_browser()
            return
        
        url = args.url
        print(f"🎬 Processando: {url}")
        print("=" * 50)
        
        # Executa extração
        if args.metadata_only:
            result = extractor.extract_all(url, include_transcript=False)
        elif args.transcript_only:
            result = extractor.extract_transcript(url, force_whisper=not args.no_whisper)
        else:
            use_whisper = not args.no_whisper
            result = extractor.extract_all(url, use_whisper=use_whisper, whisper_model=args.whisper_model)
        
        # Exibe resultado
        if result.get("success"):
            if "metadata" in result:
                m = result["metadata"]
                print(f"\n📌 Título: {m.get('title', 'N/A')}")
                print(f"📺 Autor: {m.get('author', 'N/A')}")
                print(f"👁️ Views: {m.get('viewCount', m.get('stats', {}).get('views', 'N/A'))}")
                
                desc = m.get('description', m.get('text', ''))
                if desc:
                    print(f"\n📝 Descrição:")
                    print(f"   {desc[:300]}...")
            
            if "transcript" in result:
                t = result["transcript"]
                if t.get("found"):
                    print(f"\n📜 Transcrição ({t.get('segments', '?')} segmentos):")
                    print(f"   {t.get('text', t.get('segments', [{}])[0].get('text', 'N/A'))[:300]}...")
                else:
                    print(f"\n⚠️ Transcript: {t.get('error', 'Não disponível')}")
            
            if "whisper_transcript" in result:
                w = result["whisper_transcript"]
                if w.get("text"):
                    print(f"\n🎙️ Transcrição Whisper ({w.get('language', '?')}, {w.get('duration', 0):.0f}s):")
                    print(f"   {w.get('text', 'N/A')[:300]}...")
                elif w.get("error"):
                    print(f"\n⚠️ Whisper: {w.get('error')}")
        
        else:
            print(f"\n❌ Erro: {result.get('error', 'Desconhecido')}")
        
        # Salvar se solicitado
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"\n✅ Salvo em: {args.output}")
        
        print("\n" + "=" * 50)
        print("✅ Concluído!")
        
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
    finally:
        extractor.stop_browser()

if __name__ == "__main__":
    main()
