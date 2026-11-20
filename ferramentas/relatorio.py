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
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parent
CONF = json.loads((AQUI / 'relatorios.json').read_text(encoding='utf-8'))
# O que o site não publica (seções, itens, frases, trechos trocados e a lista do que não pode sobrar) fica num arquivo
# local, fora do git, porque descrever o trecho omitido num repositório público já o publicaria. Relatório marcado
# com "omitir": true no relatorios.json exige regras nesse arquivo; sem elas, o gerador para em vez de publicar.
LOCAL = AQUI / 'omitir.local.json'
_regras = json.loads(LOCAL.read_text(encoding='utf-8')) if LOCAL.exists() else {}
for _n, _c in CONF.items():
    if _c.get('omitir') is True:
        if _n not in _regras:
            sys.exit(f'atividade {_n}: marcada para omitir, mas {LOCAL} não tem as regras dela; nada foi gerado')
        _c['omitir'] = _regras[_n]['omitir']
        _c['proibido'] = _regras[_n].get('proibido', [])
MOLDE_PANDOC = AQUI / 'molde-pandoc.html'
VERSAO = '5'


def datas(fonte, nome):
    """Primeira e última data em que o conteúdo do relatório mudou. Um commit que só move o arquivo de pasta
    (status R100, sem mudar uma linha) não conta como modificação: em 17/11/2026 os .tex foram para atividadeN/."""
    bruto = subprocess.run(
        ['git', '-C', str(fonte), 'log', '--follow', '--format=@%as', '--name-status', '--', nome],
        capture_output=True, text=True, check=True).stdout
    saida = []
    for bloco in bruto.split('@')[1:]:
        linhas = [l for l in bloco.splitlines() if l.strip()]
        if not linhas:
            continue
        data, status = linhas[0].strip(), (linhas[1].split('\t')[0] if len(linhas) > 1 else '')
        if status != 'R100':
            saida.append(data)
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

    # o que o site não publica (relatorios.json, chave "omitir"): seções inteiras pelo rótulo e itens de lista pelo
    # começo do texto; as seções seguintes são renumeradas. O .tex entregue fica como está.
    omitir = c.get('omitir', {})
    for sid in omitir.get('secoes', []):
        ini = corpo.find(f'<section id="{sid}"')
        if ini < 0:
            sys.exit(f'{nome}: seção a omitir não encontrada: {sid}')
        prof, fim = 0, None
        for m in re.finditer(r'<section\b|</section>', corpo[ini:]):
            prof += 1 if m.group(0) == '<section' else -1
            if prof == 0:
                fim = ini + m.end()
                break
        corpo = corpo[:ini] + corpo[fim:].lstrip('\n')
    for inicio in omitir.get('itens', []):
        novo = re.sub(r'<li>\s*<p>' + re.escape(inicio) + r'.*?</p>\s*</li>\s*', '', corpo, flags=re.S)
        if novo == corpo:
            sys.exit(f'{nome}: item a omitir não encontrado: {inicio}')
        corpo = novo
    for inicio in omitir.get('frases', []):
        # da frase que começa assim até o ponto final dela (o ponto seguido de espaço ou do fim do parágrafo)
        novo = re.sub(r'\s*' + re.escape(inicio) + r'.*?\.(?=\s|</p>)', '', corpo, count=1, flags=re.S)
        if novo == corpo:
            sys.exit(f'{nome}: frase a omitir não encontrada: {inicio}')
        corpo = novo
    for de, para in omitir.get('trocar', []):
        # trecho trocado dentro de uma frase; o que só existe no título ou no autor do PDF não aparece aqui
        corpo = corpo.replace(de, para)
    if omitir.get('secoes'):
        velhos = re.findall(r'<section id="[^"]+" class="level2" data-number="(\d+)"', corpo)
        mapa = {v: str(i) for i, v in enumerate(velhos, 1)}
        renum = lambda m: m.group(1) + mapa.get(m.group(2), m.group(2)) + (m.group(3) or '')
        corpo = re.sub(r'(data-number=")(\d+)((?:\.\d+)*)', renum, corpo)
        corpo = re.sub(r'(<span class="header-section-number">)(\d+)((?:\.\d+)*)', renum, corpo)

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


def slug(titulo):
    """O id que o pandoc dá a uma seção sem rótulo: minúsculas, sem pontuação, espaços viram hífens."""
    t = re.sub(r'[^\w\s-]', '', titulo.lower())
    return re.sub(r'\s+', '-', t.strip())


def filtrar_tex(tex, omitir, nome):
    """As mesmas omissões da página aplicadas ao .tex, para o PDF publicado no site. Cada regra tem de casar uma vez
    no .tex; se não casar, o PDF do site sairia com o trecho, então para com erro."""
    for de, para in omitir.get('trocar', []):
        if de not in tex:
            sys.exit(f'{nome}: trecho a trocar não encontrado no .tex: {de}')
        tex = tex.replace(de, para)
    for sid in omitir.get('secoes', []):
        achou = False
        for m in re.finditer(r'\\section\*?\{([^}]*)\}', tex):
            depois = tex[m.end():]
            rot = re.match(r'\s*\\label\{([^}]+)\}', depois)
            if (rot and rot.group(1) == sid) or slug(m.group(1)) == sid:
                fim = re.search(r'\\section\*?\{|\\begin\{thebibliography\}|\\end\{document\}', depois)
                tex = tex[:m.start()] + depois[fim.start():]
                achou = True
                break
        if not achou:
            sys.exit(f'{nome}: seção a omitir não encontrada no .tex: {sid}')
    for inicio in omitir.get('itens', []):
        novo = re.sub(r'\\item\s+' + re.escape(inicio) + r'.*?(?=\\item\b|\\end\{(?:itemize|enumerate)\})', '',
                      tex, count=1, flags=re.S)
        if novo == tex:
            sys.exit(f'{nome}: item a omitir não encontrado no .tex: {inicio}')
        tex = novo
    for inicio in omitir.get('frases', []):
        novo = re.sub(r'\s*' + re.escape(inicio) + r'.*?\.(?=\s)', '', tex, count=1, flags=re.S)
        if novo == tex:
            sys.exit(f'{nome}: frase a omitir não encontrada no .tex: {inicio}')
        tex = novo
    return tex


def pdf_site(fonte, n):
    """Relatório com omissões: o PDF do site é compilado do .tex filtrado, para não publicar no PDF o que a página
    esconde. Sem omissões, o PDF do site é o da entrega, copiado à parte."""
    c = CONF[str(n)]
    if not c.get('omitir') or not c.get('pdf'):
        return None
    nome = c['tex']
    tex = filtrar_tex((fonte / nome).read_text(encoding='utf-8'), c['omitir'], nome)
    base = Path(nome).stem
    with tempfile.TemporaryDirectory(prefix='pdf-site-') as tmp:
        (Path(tmp) / f'{base}.tex').write_text(tex, encoding='utf-8')
        r = subprocess.run(['latexmk', '-pdf', '-interaction=nonstopmode', '-halt-on-error', f'{base}.tex'],
                           cwd=tmp, capture_output=True, text=True)
        if r.returncode:
            sys.exit(f'{nome}: o PDF do site não compilou\n' + r.stdout[-3000:])
        destino = SITE / c['pdf']
        novo = Path(tmp) / f'{base}.pdf'
        ler = lambda p: subprocess.run(['pdftotext', str(p), '-'], capture_output=True, text=True).stdout
        # o PDF muda de bytes a cada compilação (data de criação); só substitui quando o texto mudou
        if not destino.exists() or ler(novo) != ler(destino):
            shutil.copyfile(novo, destino)
    texto = subprocess.run(['pdftotext', str(destino), '-'], capture_output=True, text=True).stdout
    for proibido in c.get('proibido', []):
        if re.search(proibido, texto, re.I):
            sys.exit(f'{nome}: o PDF do site ainda tem "{proibido}"')
    return destino


def conferir_html(n, pagina_html):
    """O que a chave "proibido" lista não pode sobrar no texto da página (nem na ficha, nem no título)."""
    texto = html.unescape(re.sub(r'<[^>]+>', ' ', pagina_html))
    for proibido in CONF[str(n)].get('proibido', []):
        achado = re.search(r'.{0,60}' + proibido + r'.{0,60}', texto, re.I | re.S)
        if achado:
            sys.exit(f'atividade {n}: a página ainda tem "{proibido}": ...{achado.group(0)}...')


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
        # vídeo longo vem com capítulos: [{"t": segundos, "titulo": "..."}] no .capitulos.json ao lado
        capitulos = ''
        arq_cap = SITE / f'{base}.capitulos.json'
        if arq_cap.exists():
            caps = json.loads(arq_cap.read_text(encoding='utf-8'))
            lista_cap = ''.join(
                f'<li><button type="button" data-t="{c["t"]}"><span class="tc">{int(c["t"]) // 60}:{int(c["t"]) % 60:02d}</span>'
                f'{html.escape(c["titulo"])}</button></li>' for c in caps)
            capitulos = f'<nav class="capitulos" aria-label="Capítulos do vídeo"><p>Capítulos</p><ol>{lista_cap}</ol></nav>'
        video = (f'<div class="video-bloco{" com-cap" if capitulos else ""}"><figure class="video"><video controls preload="metadata" playsinline{capa}>'
                 f'<source src="../{base}.mp4" type="video/mp4">{legenda}</video>'
                 f'<figcaption>O relatório em vídeo, narrado e com legenda.</figcaption></figure>{capitulos}</div>')
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
    <nav class="voltas" aria-label="Site"><a href="../index.html#prova">O combinado</a><a href="../index.html#biblioteca">Relatórios e vídeos</a><a href="../index.html#resultados">Espécies</a><a href="../index.html#vimos">O que vimos</a><a href="../index.html#validacao">Validação</a><a href="../index.html#linha">Linha do tempo</a></nav>
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
        pagina_html = converter(fonte, n)
        conferir_html(n, pagina_html)
        destino.write_text(pagina_html, encoding='utf-8')
        print(f'atividade {n}: {destino}')
        pdf = pdf_site(fonte, n)
        if pdf:
            print(f'atividade {n}: {pdf} (do .tex filtrado)')


if __name__ == '__main__':
    main()
