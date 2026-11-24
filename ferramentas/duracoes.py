"""Gera assets/js/duracoes.js com a duração de cada vídeo de relatório (assets/video/atividadeN-pt.mp4) e de cada
vídeo de aula que não é entrega (assets/video/aulaDDMM-pt.mp4, lista aulas em dados.js), medida pelo ffprobe. A
estante mostra essa duração no cartão; rodar de novo sempre que um vídeo mudar.

Uso: python -I ferramentas/duracoes.py
"""
import json
import re
import subprocess
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
VIDEO = SITE / 'assets' / 'video'


def segundos(mp4):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp4)],
                                capture_output=True, text=True, check=True).stdout)


duracoes = {}
for mp4 in VIDEO.glob('atividade*-pt.mp4'):
    duracoes[re.match(r'atividade(\d+)-pt', mp4.stem).group(1)] = round(segundos(mp4))
# vídeo de aula: a chave é o nome do arquivo sem o "-pt" (aula2411), o mesmo campo video de dados.js
for mp4 in VIDEO.glob('aula*-pt.mp4'):
    duracoes[mp4.stem[:-3]] = round(segundos(mp4))
# atividades em ordem numérica, depois as aulas
ordem = sorted(duracoes, key=lambda k: (not k.isdigit(), int(k) if k.isdigit() else 0, k))
destino = SITE / 'assets' / 'js' / 'duracoes.js'
destino.write_text('// Gerado por ferramentas/duracoes.py (ffprobe). Segundos de cada vídeo de relatório e de aula.\n'
                   f'window.DURACOES = {json.dumps({k: duracoes[k] for k in ordem})};\n', encoding='utf-8')
print(destino, {k: duracoes[k] for k in ordem})
