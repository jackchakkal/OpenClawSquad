#!/usr/bin/env python3
"""
VideoExtractor - Script principal
Uso: python main.py <url> [--no-whisper]
"""
import sys
import os

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cli import main

if __name__ == "__main__":
    main()
