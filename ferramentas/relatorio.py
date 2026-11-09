"""Converte os relatórios .tex do projeto em páginas HTML do site.

Uso: /mnt/cache/venvs/slides/bin/python -I ferramentas/relatorio.py <pasta-dos-tex> <n> [<n> ...]

Cada relatório sai em relatorios/atividade<n>.html. O texto, as tabelas, as notas e as
referências vêm do pandoc; as figuras TikZ não passam por ele, então cada uma tem um SVG
desenhado à mão em ferramentas/figuras/, ligado ao rótulo da figura no relatorios.json.
As datas são o primeiro e o último commit do .tex (git log --follow).
"""
import html
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parent
CONF = json.loads((AQUI / 'relatorios.json').read_text(encoding='utf-8'))
MOLDE_PANDOC = AQUI / 'molde-pandoc.html'
VERSAO = '4'


def datas(fonte, nome):
    saida = subprocess.run(
        ['git', '-C', str(fonte), 'log', '--follow', '--format=%as', '--', nome],
        capture_output=True, text=True, check=True).stdout.split()
    if not saida:
        sys.exit(f'{nome}: sem histórico no git')
    return saida[-1], saida[0]


def br(d):
    a, m, dia = d.split('-')
    return f'{dia}/{m}/{a}'


def preparar(tex):
    """Ajusta o que o leitor de LaTeX do pandoc não entende, sem mudar o texto."""
    # tabularx com colunas próprias (\newcolumntype) vira tabular com colunas l, c e r
    # (a especificação pode ter p{3cm}, então aceita um nível de chaves)
    def tabx(m):
        spec = re.sub(r'[A-Z]', 'l', m.group(1))
        return '\\begin{tabular}{' + spec + '}'
    tex = re.sub(r'\\begin\{tabularx\}\{[^}]*\}\{((?:[^{}]|\{[^{}]*\})*)\}', tabx, tex)
    tex = tex.replace('\\end{tabularx}', '\\end{tabular}')
    tex = re.sub(r'\\begin\{Verbatim\}(\[[^\]]*\])?', r'\\begin{verbatim}', tex)
    tex = tex.replace('\\end{Verbatim}', '\\end{verbatim}')
    return tex


def pandoc(tex):
    r = subprocess.run(
        ['pandoc', '-f', 'latex', '-t', 'html5', '--mathml', '--wrap=none',
         '--number-sections', '--section-divs', f'--template={MOLDE_PANDOC}'],
        input=tex, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)
    for linha in r.stderr.splitlines():
        print('  pandoc:', linha)
    titulo, resto = r.stdout.split('@@AUTOR@@', 1)
    autor, corpo = resto.split('@@CORPO@@', 1)
    # \section vira h2 (o h1 é o título da página), mantendo a numeração 1, 2, 3 do PDF
    for k in (4, 3, 2, 1):
        corpo = re.sub(rf'<(/?)h{k}([ >])', rf'<\1h{k + 1}\2', corpo)
        corpo = corpo.replace(f'class="level{k}"', f'class="level{k + 1}"')
    return titulo.strip(), autor.strip(), corpo


def svg_da_figura(nome):
    caminho = AQUI / 'figuras' / nome
    if not caminho.exists():
        sys.exit(f'figura sem SVG: {caminho}')
    return caminho.read_text(encoding='utf-8').strip()


def converter(fonte, n):
    c = CONF[str(n)]
    nome = c['tex']
    tex = (fonte / nome).read_text(encoding='utf-8')
    chaves = re.findall(r'\\bibitem(?:\[[^\]]*\])?\{([^}]+)\}', tex)
    titulo, autor, corpo = pandoc(preparar(tex))
    titulo = re.sub(r'\s*<br\s*/?>\s*', ' ', titulo)
    autor = re.split(r'<br\s*/?>', autor)[0].strip()
    primeira, ultima = datas(fonte, nome)

    # citações numeradas na ordem da bibliografia, como no PDF
    def citar(m):
        partes = []
        for k in m.group(1).split():
            if k not in chaves:
                sys.exit(f'{nome}: citação sem \\bibitem: {k}')
            i = chaves.index(k) + 1
            partes.append(f'<a class="cite" href="#ref-{i}" data-nota="ref-{i}">{i}</a>')
        return '<span class="cites">[' + ', '.join(partes) + ']</span>'
    corpo = re.sub(r'<span class="citation" data-cites="([^"]+)">.*?</span>', citar, corpo, flags=re.S)

    # bibliografia
    m = re.search(r'<div class="thebibliography">(.*?)</div>', corpo, re.S)
    if m:
        itens = re.findall(r'<p>(.*?)</p>', m.group(1), re.S)
        if itens and re.fullmatch(r'<span>[^<]*</span>', itens[0].strip()):
            itens = itens[1:]
        if len(itens) != len(chaves):
            sys.exit(f'{nome}: {len(itens)} itens na bibliografia e {len(chaves)} \\bibitem')
        lis = ''.join(f'<li id="ref-{i}">{t.strip()}</li>' for i, t in enumerate(itens, 1))
        corpo = corpo.replace(m.group(0), '<section class="refs" id="referencias"><h2>Referências</h2>'
                              f'<ol>{lis}</ol></section>')

    # figuras: o TikZ não passa pelo pandoc, entra o SVG desenhado para ele
    numeros = {}
    cont = {'fig': 0, 'tab': 0}

    def figura(m):
        rid, dentro, legenda = m.group(1), m.group(2).strip(), m.group(3)
        cont['fig'] += 1
        numeros[rid] = cont['fig']
        arte = dentro
        if rid in c.get('figuras', {}):
            arte = svg_da_figura(c['figuras'][rid])
        elif not dentro:
            sys.exit(f'{nome}: figura {rid} sem conteúdo e sem SVG no relatorios.json')
        larga = ' larga' if rid in c.get('figuras_largas', []) else ''
        return (f'<figure class="fig{larga}" id="{rid}"><div class="arte">{arte}</div>'
                f'<figcaption><span class="rot">Figura {cont["fig"]}.</span> {legenda}</figcaption></figure>')
    corpo = re.sub(r'<figure id="([^"]*)">(.*?)<figcaption>(.*?)</figcaption>\s*</figure>', figura, corpo, flags=re.S)

    def tabela(rid, dentro):
        cont['tab'] += 1
        # cabeçalho em duas linhas (multicolumn): o pandoc deixa só a primeira no thead;
        # a segunda, toda em negrito, passa para o thead também
        if re.search(r'<thead>.*?colspan.*?</thead>', dentro, re.S):
            mt = re.search(r'(<tbody>\s*)<tr[^>]*>(.*?)</tr>', dentro, re.S)
            if mt and re.fullmatch(r'(\s*<td[^>]*>\s*(<strong>.*?</strong>)?\s*</td>)+\s*', mt.group(2), re.S):
                linha = re.sub(r'<(/?)td', r'<\1th', mt.group(2))
                dentro = dentro.replace(mt.group(0), mt.group(1), 1).replace('</thead>', f'<tr>{linha}</tr></thead>', 1)
        if rid:
            numeros[rid] = cont['tab']
        cap = re.search(r'<caption>(.*?)</caption>', dentro, re.S)
        legenda = ''
        if cap:
            dentro = dentro.replace(cap.group(0), '')
            legenda = (f'<figcaption><span class="rot">Tabela {cont["tab"]}.</span> '
                       f'{re.sub(r"</?p>", "", cap.group(1)).strip()}</figcaption>')
        attr = f' id="{rid}"' if rid else ''
        return f'<figure class="tab"{attr}>{legenda}<div class="rolar"><table class="t">{dentro}</table></div></figure>'

    corpo = re.sub(r'<div id="(tab:[^"]+)">\s*<table[^>]*>(.*?)</table>\s*</div>',
                   lambda m: tabela(m.group(1), m.group(2)), corpo, flags=re.S)
    corpo = re.sub(r'<table(?![^>]*class="t")[^>]*>(.*?)</table>',
                   lambda m: tabela(None, m.group(1)), corpo, flags=re.S)

    # referência cruzada com o número que a página mostra
    def ref(m):
        alvo = m.group(1)
        txt = str(numeros.get(alvo, m.group(2)))
        return f'<a class="xref" href="#{alvo}">{txt}</a>'
    corpo = re.sub(r'<a href="#([^"]+)" data-reference-type="ref" data-reference="[^"]*">([^<]*)</a>', ref, corpo)

    # links de fora abrem em outra aba
    corpo = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', corpo)

    # notas de rodapé
    corpo = re.sub(r'<aside id="footnotes"[^>]*>\s*<hr\s*/?>',
                   '<aside id="notas" class="notas" role="doc-endnotes"><h2>Notas</h2>', corpo)
    corpo = re.sub(r'<a href="#(fn\d+)" class="footnote-ref" id="(fnref\d+)" role="doc-noteref"><sup>(\d+)</sup></a>',
                   r'<a href="#\1" class="fnref" id="\2" data-nota="\1"><sup>\3</sup></a>', corpo)

    # sumário a partir das seções
    sumario = []
    for m in re.finditer(r'<section id="([^"]+)" class="level2"([^>]*)>\s*<h2[^>]*>(.*?)</h2>', corpo, re.S):
        sid, attrs, texto = m.groups()
        num = re.search(r'data-number="([^"]*)"', attrs)
        num = num.group(1) if num else ''
        limpo = re.sub(r'<span class="header-section-number">[^<]*</span>\s*', '', texto)
        limpo = re.sub(r'<[^>]+>', '', limpo).strip()
        sumario.append((sid, num or '', limpo))
    if 'id="referencias"' in corpo:
        sumario.append(('referencias', '', 'Referências'))
    if 'id="notas"' in corpo:
        sumario.append(('notas', '', 'Notas'))

    return pagina(n, c, titulo, autor, primeira, ultima, corpo, sumario)


def vizinhos(n):
    ns = sorted(int(k) for k, v in CONF.items() if v.get('pagina') or int(k) == n)
    i = ns.index(n)
    ant = ns[i - 1] if i > 0 else None
    prox = ns[i + 1] if i + 1 < len(ns) else None
    return ant, prox


def cartao(k, sentido):
    if k is None:
        return '<span></span>'
    v = CONF[str(k)]
    return (f'<a class="viz {sentido}" href="atividade{k}.html"><span class="seta" aria-hidden="true">'
            f'{"←" if sentido == "ant" else "→"}</span><span><small>Atividade {k}</small>'
            f'<b>{html.escape(v["nome"])}</b></span></a>')


def pagina(n, c, titulo, autor, primeira, ultima, corpo, sumario):
    ant, prox = vizinhos(n)
    docs = [f'<a href="../{c["pdf"]}">PDF da entrega</a>'] if c.get('pdf') else []
    if c.get('slides'):
        docs.append(f'<a href="../{c["slides"]}">Slides</a>')
    itens = ''.join(
        f'<li><a href="#{sid}" data-alvo="{sid}"><span class="num">{num}</span>{html.escape(txt)}</a></li>'
        for sid, num, txt in sumario)
    ficha = ''
    if c.get('feito') or c.get('resultado'):
        ficha = ('<dl class="ficha">'
                 f'<div><dt>O que foi feito</dt><dd>{html.escape(c["feito"])}</dd></div>'
                 f'<div><dt>O que saiu</dt><dd>{html.escape(c["resultado"])}</dd></div>'
                 '</dl>')
    video = ''
    base = f'assets/video/atividade{n}-pt'
    if (SITE / f'{base}.mp4').exists():
        legenda = f'<track kind="captions" srclang="pt-BR" label="Português" src="../{base}.vtt">' \
            if (SITE / f'{base}.vtt').exists() else ''
        capa = f' poster="../{base}.jpg"' if (SITE / f'{base}.jpg').exists() else ''
        video = (f'<figure class="video"><video controls preload="metadata" playsinline{capa}>'
                 f'<source src="../{base}.mp4" type="video/mp4">{legenda}</video>'
                 f'<figcaption>O relatório em vídeo, narrado e com legenda.</figcaption></figure>')
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Atividade {n}: {html.escape(c["nome"])} | BuraqueiraBench</title>
<meta name="description" content="Relatório da Atividade {n} do projeto BuraqueiraBench: {html.escape(c["nome"])}.">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/img/buraqueira-32.png?v=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/relatorio.css?v={VERSAO}">
<script>document.documentElement.classList.add('js');</script>
</head>
<body>
<a class="pular" href="#texto">Pular para o texto</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="aquarela" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="7" result="r"/>
    <feDisplacementMap in="SourceGraphic" in2="r" scale="5"/>
  </filter>
</svg>
<header class="topo">
  <div class="in">
    <a class="marca" href="../index.html">BuraqueiraBench</a>
    <nav class="voltas" aria-label="Site"><a href="../index.html#prova">O combinado</a><a href="../index.html#biblioteca">Relatórios e vídeos</a><a href="../index.html#problema">O juiz</a><a href="../index.html#vimos">O que vimos</a><a href="../index.html#linha">Linha do tempo</a></nav>
  </div>
  <div class="progresso" aria-hidden="true"><span></span></div>
</header>

<main>
  <header class="abre">
    <p class="sobre">Relatório da Atividade {n} &middot; {html.escape(c["nome"])}</p>
    <h1>{titulo}</h1>
    <p class="autor">{autor}</p>
    <p class="datas">Primeira versão em {br(primeira)}, última modificação em {br(ultima)}</p>
    <p class="docs">{' '.join(docs)}</p>
    {ficha}
    {video}
  </header>

  <div class="corpo">
    <nav class="sumario" aria-label="Nesta página">
      <p>Nesta página</p>
      <ol>{itens}</ol>
    </nav>
    <article id="texto">
{corpo}
    </article>
  </div>

  <nav class="vizinhos" aria-label="Outras atividades">
    {cartao(ant, "ant")}
    <a class="meio" href="../index.html#linha">Linha do tempo</a>
    {cartao(prox, "prox")}
  </nav>
</main>

<footer class="pe">
  <p>Cristhian Kapelinski e Beatriz Roland Machado, Laboratório de Inteligência Artificial Aplicada, UNIPAMPA, 2026/2.
  Texto convertido do relatório em LaTeX.</p>
</footer>
<script src="../assets/js/relatorio.js?v={VERSAO}"></script>
</body>
</html>
'''


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    fonte = Path(sys.argv[1])
    saida = SITE / 'relatorios'
    saida.mkdir(exist_ok=True)
    for n in map(int, sys.argv[2:]):
        destino = saida / f'atividade{n}.html'
        destino.write_text(converter(fonte, n), encoding='utf-8')
        print(f'atividade {n}: {destino}')


if __name__ == '__main__':
    main()
