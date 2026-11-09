// Resultados: gráficos em SVG à mão. Todo número vem de window.DADOS (fonte em cada bloco de dados.js).
(function () {
  const D = window.DADOS;
  const NS = 'http://www.w3.org/2000/svg';
  const TR = ['nllb', 'opus', 'deepseek'];
  const NOME_TR = { nllb: 'NLLB-200', opus: 'Opus-MT', deepseek: 'DeepSeek' };
  const CURTO = { lg3: 'LG3', harmbench: 'Harm', jailjudge: 'Jail', aegis: 'Aegis' };
  const COR = {
    enFill: '#5b8fc7', enLinha: '#2f5d8a', ptFill: '#d79a3b', ptLinha: '#a35f14',
    nocivo: '#c8412f', seguro: '#3f9a63', tinta: '#121c2b', papel: '#f5f3ee'
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const f1 = v => window.fmt(v, 1);

  function el(tag, attrs, pai) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (pai) pai.appendChild(e);
    return e;
  }
  function pos(e, x, y) { e.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
  function setD(e, d) { e.setAttribute('d', d); e.style.setProperty('d', 'path("' + d + '")'); }
  function geo(e, x, w) {
    e.setAttribute('x', x); e.setAttribute('width', w);
    e.style.setProperty('x', x + 'px'); e.style.setProperty('width', w + 'px');
  }
  function texto(pai, str, attrs) {
    const t = el('text', attrs || {}, pai);
    t.textContent = str;
    return t;
  }

  // forma do juiz: círculo, quadrado, triângulo, losango (nunca só cor)
  function marca(pai, id, r, attrs) {
    let e;
    if (id === 'lg3') e = el('circle', { r: r });
    else if (id === 'harmbench') e = el('rect', { x: -r * 0.88, y: -r * 0.88, width: r * 1.76, height: r * 1.76, rx: 1 });
    else if (id === 'jailjudge') e = el('polygon', { points: '0,' + (-r * 1.2) + ' ' + (r * 1.1) + ',' + (r * 0.85) + ' ' + (-r * 1.1) + ',' + (r * 0.85) });
    else e = el('polygon', { points: '0,' + (-r * 1.25) + ' ' + (r * 1.25) + ',0 0,' + (r * 1.25) + ' ' + (-r * 1.25) + ',0' });
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    pai.appendChild(e);
    return e;
  }
  const pontoEn = { fill: COR.enFill, stroke: COR.enLinha, 'stroke-width': 2 };
  const pontoPt = { fill: COR.ptFill, stroke: COR.ptLinha, 'stroke-width': 2 };
  const pontoNeutro = { fill: '#e6e8ee', stroke: COR.tinta, 'stroke-width': 1.8 };

  function criarSvg(host, W, H, rotulo) {
    const s = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': rotulo });
    host.appendChild(s);
    return s;
  }

  const ICONE_TABELA = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
  function tabela(id, cab, linhas) {
    const host = $('#a-' + id);
    let h = '<details><summary>' + ICONE_TABELA + 'Ver os mesmos números em tabela</summary><div class="rolar"><table><thead><tr>';
    cab.forEach(c => { h += '<th scope="col">' + c + '</th>'; });
    h += '</tr></thead><tbody>';
    linhas.forEach(l => {
      h += '<tr><th scope="row">' + l[0] + '</th>' + l.slice(1).map(v => '<td>' + v + '</td>').join('') + '</tr>';
    });
    host.innerHTML = h + '</tbody></table></div></details>';
  }
  const fonte = (id, t) => { $('#f-' + id).textContent = t; };

  function gradeX(svg, x, y0, y1, rotulo, yTxt) {
    el('line', { x1: x, x2: x, y1: y0, y2: y1, class: 'grade' }, svg);
    if (rotulo !== undefined) texto(svg, rotulo, { x: x, y: yTxt, 'text-anchor': 'middle', class: 'tenue' });
  }

  function legendaHtml(host, html) {
    const d = document.createElement('div');
    d.className = 'legenda-grafico';
    d.innerHTML = html;
    host.appendChild(d);
  }
  const miniPonto = (fill, linha) => '<svg viewBox="-9 -9 18 18" aria-hidden="true"><circle r="6" fill="' + fill + '" stroke="' + linha + '" stroke-width="2"/></svg>';

  // ---------- 1. falso negativo por juiz e condição ----------
  function graficoFn(host, estado) {
    const W = Math.max(300, host.clientWidth), mob = W < 600;
    const rowH = 24, headH = mob ? 22 : 0, bandH = headH + 3 * rowH, gap = 12, top = 4;
    const H = top + 4 * (bandH + gap) + 24;
    const labelW = mob ? 0 : 150, px0 = labelW + (mob ? 104 : 60), px1 = W - 44;
    const sx = v => px0 + (v / 50) * (px1 - px0);
    const r = 7;
    legendaHtml(host,
      '<span>' + miniPonto(COR.enFill, COR.enLinha) + 'Inglês</span>' +
      '<span>' + miniPonto(COR.ptFill, COR.ptLinha) + 'Português (traduzido)</span>' +
      '<span><svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6H17M17 6l-5-4v8z" stroke="' + COR.ptLinha + '" stroke-width="2" fill="' + COR.ptLinha + '"/></svg>de inglês para a tradução</span>' +
      '<span>a forma do ponto diz qual é o juiz</span>');
    const svg = criarSvg(host, W, H, 'Falso negativo por juiz, no inglês e em cada tradução');
    [0, 10, 20, 30, 40, 50].forEach(t => gradeX(svg, sx(t), top, H - 24, t + '%', H - 6));
    const linhas = [];
    D.juizes.forEach((j, i) => {
      const y0 = top + i * (bandH + gap);
      el('rect', { x: 0, y: y0, width: W, height: bandH, rx: 5, fill: 'rgba(30,24,19,.045)' }, svg);
      const ny = mob ? y0 + 12 : y0 + bandH / 2;
      const g = el('g', {}, svg);
      marca(g, j.id, 7, pontoNeutro); pos(g, 16, ny);
      texto(svg, j.nome, { x: 32, y: ny, 'dominant-baseline': 'central', class: 'nome-juiz' });
      TR.forEach((t, k) => {
        const y = y0 + headH + (k + 0.5) * rowH;
        el('line', { x1: px0, x2: px1, y1: y, y2: y, stroke: 'rgba(30,24,19,.12)' }, svg);
        texto(svg, NOME_TR[t], { x: px0 - 12, y: y, 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'tenue' });
        const seta = el('path', { fill: COR.ptLinha, stroke: COR.ptLinha, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'mover-d' }, svg);
        const gEn = el('g', { class: 'mover' }, svg); marca(gEn, j.id, r, pontoEn);
        const gPt = el('g', { class: 'mover' }, svg); marca(gPt, j.id, r, pontoPt);
        const tEn = texto(svg, '', { class: 'val halo mover', 'dominant-baseline': 'central', fill: COR.enLinha });
        const tPt = texto(svg, '', { class: 'val halo mover', 'dominant-baseline': 'central', fill: COR.ptLinha });
        linhas.push({ j: j.id, t: t, y: y, seta: seta, gEn: gEn, gPt: gPt, tEn: tEn, tPt: tPt });
      });
    });
    return function atualizar(est) {
      const dados = D[est.v];
      linhas.forEach(l => {
        const en = dados[l.j].en, pt = dados[l.j][l.t];
        const x1 = sx(en), x2 = sx(pt), s = x2 >= x1 ? 1 : -1, dist = Math.abs(x2 - x1), y = l.y;
        pos(l.gEn, x1, y); pos(l.gPt, x2, y);
        const sEn = f1(en), sPt = f1(pt), w = 7.6 * 4;
        l.tEn.textContent = sEn; l.tPt.textContent = sPt;
        const enDir = x2 < x1;
        pos(l.tEn, enDir ? x1 + r + 5 : x1 - r - 5 - w, y);
        pos(l.tPt, enDir ? x2 - r - 5 - w : x2 + r + 5, y);
        if (dist > 2 * r + 8) {
          const ini = x1 + s * (r + 3), ponta = x2 - s * (r + 3);
          setD(l.seta, 'M' + ini + ' ' + y + ' L' + (ponta - s * 6) + ' ' + y + ' M' + ponta + ' ' + y + ' L' + (ponta - s * 9) + ' ' + (y - 5) + ' L' + (ponta - s * 9) + ' ' + (y + 5) + ' Z');
          l.seta.style.opacity = 1;
        } else {
          setD(l.seta, 'M' + x1 + ' ' + y + ' L' + x1 + ' ' + y + ' M' + x1 + ' ' + y + ' L' + x1 + ' ' + y + ' L' + x1 + ' ' + y + ' Z');
          l.seta.style.opacity = 0;
        }
      });
      const cab = ['Juiz', 'Inglês'].concat(TR.map(t => NOME_TR[t]));
      tabela('fn', cab, D.juizes.map(j => [j.nome, f1(dados[j.id].en)].concat(TR.map(t => f1(dados[j.id][t])))));
      const base = est.v === 'fnReliable' ? 'ReliableBench, 1.030 pares (887 nocivas)' : 'os 6.521 pares comuns às oito condições';
      fonte('fn', 'Falso negativo (% das nocivas que o juiz libera) em ' + base + '. Fonte: ' + dados.fonte + ' (An:linha é a linha do relatório da Atividade n).');
    };
  }

  // ---------- 2. trocas nos dois sentidos ----------
  function graficoTrocas(host, estado) {
    const W = Math.max(300, host.clientWidth), mob = W < 600;
    const labelW = mob ? 0 : 150, px0 = labelW + 10, px1 = W - 10;
    const maxL = 90, maxR = 175, per = (px1 - px0) / (maxL + maxR), cx = px0 + maxL * per;
    const headH = 26, nomeH = mob ? 20 : 0, barH = 22, rowH = nomeH + barH + 14;
    const H = headH + 4 * rowH + 4;
    const svg = criarSvg(host, W, H, 'Pares que trocam de veredito em relação ao inglês, por juiz');
    texto(svg, 'barradas a mais', { x: cx - 8, y: 16, 'text-anchor': 'end', fill: '#2b7449', 'font-weight': 700 });
    texto(svg, 'liberadas a mais', { x: cx + 8, y: 16, 'text-anchor': 'start', fill: '#a3301f', 'font-weight': 700 });
    const linhas = [];
    D.juizes.forEach((j, i) => {
      const y0 = headH + i * rowH;
      if (j.id === 'jailjudge') el('rect', { x: 0, y: y0 - 2, width: W, height: rowH - 2, rx: 5, fill: 'rgba(215,154,59,.2)' }, svg);
      const yb = y0 + nomeH + 2, yc = yb + barH / 2;
      const ny = mob ? y0 + 10 : yc;
      const g = el('g', {}, svg); marca(g, j.id, 7, pontoNeutro); pos(g, 16, ny);
      texto(svg, j.nome, { x: 32, y: ny, 'dominant-baseline': 'central', class: 'nome-juiz' });
      const bL = el('rect', { y: yb, height: barH, rx: 2, fill: COR.seguro, class: 'barra' }, svg);
      const bR = el('rect', { y: yb, height: barH, rx: 2, fill: COR.nocivo, class: 'barra' }, svg);
      const tL = texto(svg, '', { 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'val mover' }, svg);
      const tR = texto(svg, '', { 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'val mover' }, svg);
      svg.appendChild(tL); svg.appendChild(tR);
      linhas.push({ j: j, yc: yc, bL: bL, bR: bR, tL: tL, tR: tR });
    });
    el('line', { x1: cx, x2: cx, y1: headH - 4, y2: H - 2, stroke: COR.tinta, 'stroke-width': 1.5 }, svg);
    return function atualizar(est) {
      const dados = D.trocasReliable;
      linhas.forEach(l => {
        const par = dados[l.j.id][est.v], lib = par[0], bar = par[1];
        geo(l.bL, cx - bar * per, bar * per);
        geo(l.bR, cx, lib * per);
        l.tL.textContent = bar; l.tR.textContent = lib;
        pos(l.tL, cx - bar * per - 5, l.yc);
        pos(l.tR, cx + lib * per + 5, l.yc);
      });
      const jj = dados.jailjudge[est.v];
      $('#m-trocas').innerHTML = 'No <strong>JailJudge</strong>, com o <strong>' + NOME_TR[est.v] + '</strong>, <strong>' + jj[0] + '</strong> das <strong>' + window.fmtInt(dados.nocivasReliable) + '</strong> nocivas passam a ser liberadas e <strong>' + jj[1] + '</strong> passam a ser barradas.';
      tabela('trocas', ['Juiz', 'Liberadas a mais', 'Barradas a mais'], D.juizes.map(j => [j.nome, dados[j.id][est.v][0], dados[j.id][est.v][1]]));
      fonte('trocas', 'Pares nocivos do ReliableBench cujo veredito muda em relação ao inglês, tradutor ' + NOME_TR[est.v] + '. Fonte: ' + dados.fonte + ' (An:linha é a linha do relatório da Atividade n).');
    };
  }

  // ---------- 3. HarmBench: FN cai, FP sobe ----------
  function graficoRigido(host) {
    const W = Math.max(300, host.clientWidth), mob = W < 560;
    const pw = mob ? W : (W - 40) / 2, ph = mob ? 150 : 190, headH = 34, rodape = 30;
    const painelH = headH + ph + rodape;
    const H = mob ? 2 * painelH + 8 : painelH;
    const conds = [['en', 'Inglês'], ['nllb', 'NLLB-200'], ['opus', 'Opus-MT'], ['deepseek', 'DeepSeek']];
    const fn = D.fnReliable.harmbench, fp = D.fpHarmbenchReliable;
    const paineis = [
      { t: 'Nocivas liberadas (falso negativo)', d: fn },
      { t: 'Seguras barradas (falso positivo)', d: fp }
    ];
    legendaHtml(host,
      '<span>' + miniPonto(COR.enFill, COR.enLinha) + 'Inglês</span>' +
      '<span>' + miniPonto(COR.ptFill, COR.ptLinha) + 'Português (traduzido)</span>' +
      '<span>linha tracejada: o valor em inglês</span>');
    const svg = criarSvg(host, W, H, 'HarmBench, falso negativo e falso positivo no inglês e nas três traduções');
    paineis.forEach((p, i) => {
      const ox = mob ? 0 : i * (pw + 40), oy = mob ? i * (painelH + 8) : 0;
      const base = oy + headH + ph, ymax = 45, sy = v => base - (v / ymax) * ph;
      texto(svg, p.t, { x: ox + pw / 2, y: oy + 18, 'text-anchor': 'middle', class: 'nome-juiz' });
      [0, 10, 20, 30, 40].forEach(t => el('line', { x1: ox, x2: ox + pw, y1: sy(t), y2: sy(t), class: 'grade' }, svg));
      const slot = pw / 4, bw = Math.min(64, slot * 0.62);
      conds.forEach((c, k) => {
        const v = p.d[c[0]], x = ox + k * slot + (slot - bw) / 2, pt = c[0] !== 'en';
        el('rect', { x: x, y: sy(v), width: bw, height: base - sy(v), rx: 2, fill: pt ? COR.ptFill : COR.enFill, stroke: pt ? COR.ptLinha : COR.enLinha, 'stroke-width': 2 }, svg);
        texto(svg, f1(v) + '%', { x: x + bw / 2, y: sy(v) - 6, 'text-anchor': 'middle', class: 'val halo' });
        texto(svg, c[1], { x: x + bw / 2, y: base + 18, 'text-anchor': 'middle', class: 'tenue' });
      });
      el('line', { x1: ox, x2: ox + pw, y1: sy(p.d.en), y2: sy(p.d.en), stroke: COR.enLinha, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, svg);
      el('line', { x1: ox, x2: ox + pw, y1: base, y2: base, stroke: COR.tinta, 'stroke-width': 1.5 }, svg);
    });
    tabela('rigido', ['Condição', 'Falso negativo (%)', 'Falso positivo (%)'], conds.map(c => [c[1], f1(fn[c[0]]), f1(fp[c[0]])]));
    fonte('rigido', 'HarmBench no ReliableBench. Falso negativo: ' + D.fnReliable.fonte + '. Falso positivo: ' + fp.fonte + ' (An:linha é a linha do relatório da Atividade n).');
    return function () {};
  }

  // ---------- 4. inclinação: inglês, português, volta ----------
  function graficoVolta(host) {
    const W = Math.max(300, host.clientWidth), mob = W < 600;
    const wn = mob ? 44 : 140, top = 44, ph = mob ? 250 : 290, H = top + ph + 14;
    const c0 = 52, c2 = W - wn - 54, c1 = (c0 + c2) / 2, r = 6.5, ymax = 40;
    const sy = v => top + (1 - v / ymax) * ph;
    legendaHtml(host,
      '<span><svg viewBox="0 0 26 8" aria-hidden="true"><path d="M1 4H25" stroke="' + COR.ptLinha + '" stroke-width="2.5"/></svg>tradução ao português</span>' +
      '<span><svg viewBox="0 0 26 8" aria-hidden="true"><path d="M1 4H25" stroke="' + COR.enLinha + '" stroke-width="2.5" stroke-dasharray="5 3"/></svg>volta ao inglês</span>' +
      '<span>a forma do ponto diz qual é o juiz</span>');
    const svg = criarSvg(host, W, H, 'Falso negativo por juiz no inglês, no português e na volta ao inglês');
    [[c0, 'Inglês', COR.enLinha], [c1, 'Português', COR.ptLinha], [c2, 'Volta ao inglês', COR.enLinha]].forEach(c => {
      el('line', { x1: c[0], x2: c[0], y1: top - 12, y2: top + ph, class: 'grade' }, svg);
      texto(svg, c[1], { x: c[0], y: 18, 'text-anchor': 'middle', class: 'nome-juiz', fill: c[2] });
    });
    const itens = D.juizes.map(j => {
      const jj = j.id === 'jailjudge';
      const l1 = el('path', { fill: 'none', stroke: COR.ptLinha, 'stroke-width': jj ? 4 : 2.2, 'stroke-linecap': 'round', class: 'mover-d' }, svg);
      const l2 = el('path', { fill: 'none', stroke: COR.enLinha, 'stroke-width': jj ? 4 : 2.2, 'stroke-dasharray': '6 4', 'stroke-linecap': 'round', class: 'mover-d' }, svg);
      return { j: j, l1: l1, l2: l2, pts: [], vals: [], nome: null, marcaNome: null };
    });
    itens.forEach(it => {
      [pontoEn, pontoPt, { fill: COR.papel, stroke: COR.enLinha, 'stroke-width': 2.2 }].forEach((estilo, k) => {
        const g = el('g', { class: 'mover' }, svg); marca(g, it.j.id, r, estilo); it.pts.push(g);
        const cor = k === 1 ? COR.ptLinha : COR.enLinha;
        it.vals.push(texto(svg, '', { class: 'val halo mover', 'dominant-baseline': 'central', fill: cor }));
      });
      it.nome = texto(svg, mob ? CURTO[it.j.id] : it.j.nome, { class: 'nome-juiz mover', 'dominant-baseline': 'central', style: 'font-size:' + (mob ? 13 : 15) + 'px' });
      if (!mob) { const g = el('g', { class: 'mover' }, svg); marca(g, it.j.id, 6, pontoNeutro); it.marcaNome = g; }
    });
    function espalhar(ys, minimo) {
      const ord = ys.map((y, i) => ({ y: y, i: i })).sort((a, b) => a.y - b.y);
      for (let n = 0; n < 40; n++) {
        for (let k = 1; k < ord.length; k++) {
          const d = ord[k].y - ord[k - 1].y;
          if (d < minimo) { const m = (minimo - d) / 2; ord[k - 1].y -= m; ord[k].y += m; }
        }
      }
      const out = []; ord.forEach(o => { out[o.i] = o.y; }); return out;
    }
    return function atualizar(est) {
      const cols = [c0, c1, c2];
      const dados = D.volta[est.v];
      const valores = itens.map(it => dados[it.j.id]);
      [0, 1, 2].forEach(k => {
        const ys = espalhar(valores.map(v => sy(v[k])), 15);
        itens.forEach((it, n) => {
          pos(it.pts[k], cols[k], sy(valores[n][k]));
          it.vals[k].textContent = f1(valores[n][k]);
          pos(it.vals[k], k === 0 ? cols[k] - r - 6 - 7.6 * 4 : cols[k] + r + 6, ys[n]);
          if (k === 2) {
            pos(it.nome, c2 + (mob ? 46 : 70), ys[n]);
            if (it.marcaNome) pos(it.marcaNome, c2 + 58, ys[n]);
          }
        });
      });
      itens.forEach((it, n) => {
        const v = valores[n];
        setD(it.l1, 'M' + c0 + ' ' + sy(v[0]) + ' L' + c1 + ' ' + sy(v[1]));
        setD(it.l2, 'M' + c1 + ' ' + sy(v[1]) + ' L' + c2 + ' ' + sy(v[2]));
      });
      $('#m-volta').innerHTML = 'Só parte do aumento do <strong>JailJudge</strong> sobrevive à volta ao inglês: <strong>' + D.volta.sobreviveJailjudge[est.v] + '%</strong> com o ' + NOME_TR[est.v] + '. Com os três tradutores, <strong>' + D.volta.sobreviveJailjudge.nllb + '%</strong>, <strong>' + D.volta.sobreviveJailjudge.opus + '%</strong> e <strong>' + D.volta.sobreviveJailjudge.deepseek + '%</strong>.';
      tabela('volta', ['Juiz', 'Inglês', 'Português', 'Volta ao inglês'], D.juizes.map(j => [j.nome].concat(dados[j.id].map(f1))));
      fonte('volta', 'Falso negativo no ReliableBench, tradutor ' + NOME_TR[est.v] + '. Parte do aumento que sobrevive: A11:660. Fonte: ' + D.volta.fonte + ' (An:linha é a linha do relatório da Atividade n).');
    };
  }

  // ---------- 5. gráfico de unidades: 438 processos ----------
  function graficoTradutor(host) {
    const dep = D.dependenciaTradutor, W = Math.max(300, host.clientWidth), mob = W < 420;
    // quadrados do tamanho que cabe na largura, com 30 por linha (18 no celular)
    const cols = mob ? 18 : 30, g = 3, u = Math.min(18, Math.floor((W - 4) / cols) - g);
    const rows = Math.ceil(dep.total / cols);
    const cores = ['#3f9a63', '#f3d9a0', '#e8bd6e', '#d79a3b', '#a35f14', '#c8412f'];
    const rotulos = ['Nenhum tradutor leva a nocivo (todos liberam)', '1 dos 5 leva a nocivo', '2 dos 5', '3 dos 5', '4 dos 5', 'Os 5 levam a nocivo (todos barram)'];
    const caixa = document.createElement('div'); caixa.className = 'waffle-caixa'; host.appendChild(caixa);
    const sw = cols * (u + g), sh = rows * (u + g);
    const svg = el('svg', { viewBox: '0 0 ' + sw + ' ' + sh, width: sw, height: sh, role: 'img', class: 'waffle-svg', 'aria-label': 'Cada quadrado é um dos 438 processos, colorido por quantos dos cinco tradutores levam o Llama Guard 3 a dizer nocivo' });
    svg.style.width = sw + 'px'; svg.style.maxWidth = '100%'; svg.style.height = 'auto'; svg.style.flex = 'none';
    caixa.appendChild(svg);
    let n = 0; const rects = [];
    dep.porContagem.forEach((q, gr) => {
      for (let i = 0; i < q; i++, n++) {
        const c = n % cols, l = Math.floor(n / cols);
        const dependente = gr >= 1 && gr <= 4;
        const r = el('rect', { x: c * (u + g), y: l * (u + g), width: u, height: u, rx: 3, fill: cores[gr], stroke: dependente ? 'rgba(30,24,19,.7)' : 'none', 'stroke-width': 1.2 }, svg);
        r.dataset.g = gr; rects.push(r);
      }
    });
    const lista = document.createElement('ul'); lista.className = 'waffle-legenda';
    function item(gs, cor, txt, qtd, grupo) {
      const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button';
      if (grupo) b.style.fontWeight = 700;
      b.innerHTML = '<i style="background:' + cor + '"></i><span>' + txt + '</span><b>' + qtd + '</b>';
      const liga = () => { svg.classList.add('foco'); rects.forEach(r => r.classList.toggle('vivo', gs.indexOf(+r.dataset.g) >= 0)); b.classList.add('vivo'); };
      const desliga = () => { svg.classList.remove('foco'); rects.forEach(r => r.classList.remove('vivo')); b.classList.remove('vivo'); };
      ['mouseenter', 'focus'].forEach(e => b.addEventListener(e, liga));
      ['mouseleave', 'blur'].forEach(e => b.addEventListener(e, desliga));
      li.appendChild(b); lista.appendChild(li);
    }
    item([0], cores[0], rotulos[0], dep.porContagem[0]);
    item([1, 2, 3, 4], 'repeating-linear-gradient(90deg,' + cores[1] + ' 0 4px,' + cores[4] + ' 4px 8px)', 'Dependem do tradutor (1 a 4 dos 5)', dep.dependem, true);
    [1, 2, 3, 4].forEach(k => item([k], cores[k], '&nbsp;&nbsp;' + rotulos[k], dep.porContagem[k]));
    item([5], cores[5], rotulos[5], dep.porContagem[5]);
    caixa.appendChild(lista);
    const resumo = document.createElement('p'); resumo.className = 'fonte';
    resumo.textContent = 'Cada quadrado é um processo. Passe o mouse ou foque na legenda para destacar um grupo.';
    host.appendChild(resumo);
    const linhas = dep.porContagem.map((q, k) => [rotulos[k], q]);
    linhas.push(['Total', dep.total]);
    tabela('tradutor', ['Quantos dos 5 tradutores levam a nocivo', 'Processos'], linhas);
    fonte('tradutor', '438 pares do JudgeStressTest, veredito do Llama Guard 3 sobre cada uma das cinco traduções. Fonte: ' + dep.fonte + ' (An:linha é a linha do relatório da Atividade n).');
    return function () {};
  }

  // ---------- abas ----------
  function registrar(id, inicial, montar) {
    const painel = $('#p-' + id), host = $('#g-' + id), estado = Object.assign({}, inicial);
    let atualizar = null;
    $$('.seletor button', painel).forEach(b => {
      b.addEventListener('click', () => {
        $$('.seletor button', painel).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        estado.v = b.dataset.v;
        if (atualizar) atualizar(estado);
      });
    });
    return {
      painel: painel,
      desenhar: function () {
        host.innerHTML = '';
        atualizar = montar(host, estado);
        atualizar(estado);
      }
    };
  }

  const graficos = {
    fn: registrar('fn', { v: 'fnReliable' }, graficoFn),
    trocas: registrar('trocas', { v: 'nllb' }, graficoTrocas),
    rigido: registrar('rigido', {}, graficoRigido),
    volta: registrar('volta', { v: 'nllb' }, graficoVolta),
    tradutor: registrar('tradutor', {}, graficoTradutor)
  };
  // todos os gráficos ficam à vista, um após o outro; redesenham quando a largura da grade muda
  const todos = Object.keys(graficos);
  const desenharTudo = () => todos.forEach(k => graficos[k].desenhar());

  $$('[data-dado]').forEach(e => {
    const v = e.dataset.dado.split('.').reduce((o, k) => o && o[k], D);
    if (typeof v === 'string') e.textContent = v;
  });

  desenharTudo();

  const grade = $('#grade-graficos');
  let larg = grade.clientWidth, tmo = null;
  new ResizeObserver(() => {
    if (grade.clientWidth === larg) return;
    larg = grade.clientWidth;
    clearTimeout(tmo);
    tmo = setTimeout(desenharTudo, 150);
  }).observe(grade);
})();
