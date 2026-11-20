"""Gera assets/js/duracoes.js com a duração de cada vídeo de relatório (assets/video/atividadeN-pt.mp4), medida pelo
ffprobe. A estante mostra essa duração no cartão; rodar de novo sempre que um vídeo mudar.

Uso: python -I ferramentas/duracoes.py
"""
import json
import re
import subprocess
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
duracoes = {}
for mp4 in sorted((SITE / 'assets' / 'video').glob('atividade*-pt.mp4')):
    n = int(re.match(r'atividade(\d+)-pt', mp4.stem).group(1))
    seg = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp4)],
                               capture_output=True, text=True, check=True).stdout)
    duracoes[n] = round(seg)
destino = SITE / 'assets' / 'js' / 'duracoes.js'
destino.write_text('// Gerado por ferramentas/duracoes.py (ffprobe). Segundos de cada vídeo de relatório.\n'
                   f'window.DURACOES = {json.dumps(dict(sorted(duracoes.items())))};\n', encoding='utf-8')
print(destino, duracoes)
