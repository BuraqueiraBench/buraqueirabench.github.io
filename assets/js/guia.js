// Gráficos como pranchas, diário, notas e a entrada das aquarelas. Todo número vem de dados.js.
(function () {
  const D = window.DADOS, f = window.fmt, fi = window.fmtInt;
  const C = { en: '#3f6e9e', pt: '#c08a2e', nocivo: '#a8402c', seguro: '#5d7d3a', tinta: '#2e261d', sepia: '#6b5640', fio: '#b9ad95' };
  const $ = (s, r = document) => r.querySelector(s);
  const nomeJ = id => D.juizes.find(j => j.id === id).nome;

  const dot = (x, y, cor, r = 6.5) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}" fill-opacity=".85" stroke="${C.tinta}" stroke-width=".9" filter="url(#aquarela)"/>`;
  const svg = (vb, inner, rotulo) => `<svg viewBox="${vb}" role="img" aria-label="${rotulo}">${inner}</svg>`;

  // mini gráfico de cada espécie: falso negativo no ReliableBench, inglês e três traduções
  function mini(id) {
    const d = D.fnReliable[id], X = v => 64 + v / 40 * 186, xe = X(d.en);
    const linhas = [['nllb', 'NLLB-200', 46], ['opus', 'Opus-MT', 70], ['deepseek', 'DeepSeek', 94]];
    let s = `<line class="eixo" x1="64" x2="250" y1="110" y2="110"/>`;
    [0, 20, 40].forEach(v => { s += `<text class="tk" x="${X(v)}" y="126" text-anchor="middle">${v}%</text>`; });
    s += `<line class="ref" x1="${xe}" x2="${xe}" y1="24" y2="104"/>`;
    s += `<text class="rot" x="0" y="24">inglês</text>${dot(xe, 20, C.en)}<text class="val" x="${xe + 11}" y="25">${f(d.en)}</text>`;
    linhas.forEach(([k, nome, y]) => {
      const x = X(d[k]);
      s += `<text class="rot" x="0" y="${y + 4}">${nome}</text>`;
      s += `<path class="traco" pathLength="1" d="M${xe} ${y} L${x} ${y}"/>${dot(x, y, C.pt)}<text class="val" ${x < xe ? `text-anchor="end" x="${x - 11}"` : `x="${x + 11}"`} y="${y + 5}">${f(d[k])}</text>`;
    });
    return svg('0 0 270 132', s, `${nomeJ(id)}: nocivas liberadas no ReliableBench, inglês ${f(d.en)}%, NLLB-200 ${f(d.nllb)}%, Opus-MT ${f(d.opus)}%, DeepSeek ${f(d.deepseek)}%.`);
  }
  document.querySelectorAll('.especie').forEach(e => { $('.mini', e).innerHTML = mini(e.dataset.j); });

  // gaveta de espécimes: um quadrado por processo
  function gaveta(grupos, cols, cel, rotulo) {
    const pad = 10, total = grupos.reduce((a, g) => a + g.n, 0), lin = Math.ceil(total / cols);
    const W = cols * cel + pad * 2, H = lin * cel + pad * 2;
    let i = 0, q = '';
    grupos.forEach(g => {
      for (let k = 0; k < g.n; k++, i++) {
        const x = pad + (i % cols) * cel, y = pad + Math.floor(i / cols) * cel;
        q += `<rect x="${x + 1}" y="${y + 1}" width="${cel - 3}" height="${cel - 3}" rx="1.2" fill="${g.cor}" fill-opacity="${g.op}" stroke="${g.borda || 'none'}" stroke-width=".7"/>`;
      }
    });
    const m = `<path class="traco moldura" pathLength="1" d="M2 3 L${W - 3} 2 L${W - 2} ${H - 3} L3 ${H - 2} Z"/>`;
    return svg(`0 0 ${W} ${H}`, `${m}<g filter="url(#aquarela)">${q}</g>`, rotulo);
  }
  const t = D.trocasReliable.jailjudge.nllb, nn = D.trocasReliable.nocivasReliable;
  $('#g-gaveta1').innerHTML = gaveta([
    { n: t[0], cor: C.nocivo, op: .85, borda: C.tinta },
    { n: t[1], cor: C.seguro, op: .85, borda: C.tinta },
    { n: nn - t[0] - t[1], cor: '#d8cdb2', op: .7, borda: C.fio }
  ], 40, 14, `${nn} quadrados, um por resposta nociva: ${t[0]} passaram a ser liberadas, ${t[1]} passaram a ser barradas, os demais não mudaram.`);

  const dep = D.dependenciaTradutor, ocre = ['#e6c27a', '#d9a94f', '#c08a2e', '#9a6a1c'];
  const g2 = [{ n: dep.porContagem[0], cor: C.seguro, op: .38, borda: C.fio }];
  for (let k = 1; k <= 4; k++) g2.push({ n: dep.porContagem[k], cor: ocre[k - 1], op: 1, borda: C.tinta });
  g2.push({ n: dep.porContagem[5], cor: C.nocivo, op: .42, borda: C.fio });
  $('#g-gaveta2').innerHTML = gaveta(g2, 30, 16, `${dep.total} quadrados, um por processo. ${dep.porContagem[0]} nenhum tradutor leva a nocivo, ${dep.porContagem[5]} todos levam, ${dep.dependem} dependem do tradutor.`);

  // inclinação: inglês, português e volta, um painel por juiz
  function inclin(tr) {
    const xs = [48, 130, 212], Y = v => 112 - v / 40 * 84, cores = [C.en, C.pt, C.en];
    return D.juizes.map(j => {
      const v = D.volta[tr][j.id];
      let s = `<line class="ref" x1="48" x2="212" y1="${Y(v[0])}" y2="${Y(v[0])}"/>`;
      s += `<path class="traco" pathLength="1" d="M${xs[0]} ${Y(v[0])} L${xs[1]} ${Y(v[1])}"/>`;
      s += `<path class="volta-linha" d="M${xs[1]} ${Y(v[1])} L${xs[2]} ${Y(v[2])}"/>`;
      v.forEach((val, i) => { s += dot(xs[i], Y(val), cores[i], 7) + `<text class="val" text-anchor="middle" x="${xs[i]}" y="${Y(val) - 13}">${f(val)}</text>`; });
      ['inglês', 'português', 'volta'].forEach((n, i) => { s += `<text class="rot-m" x="${xs[i]}" y="140">${n}</text>`; });
      return `<div><h4>${j.nome}</h4>${svg('0 0 260 148', s, `${j.nome}: nocivas liberadas, inglês ${f(v[0])}%, português ${f(v[1])}%, volta ${f(v[2])}%.`)}</div>`;
    }).join('');
  }
  const trads = [['nllb', 'NLLB-200'], ['opus', 'Opus-MT'], ['deepseek', 'DeepSeek']];
  const sel = $('#sel-trad');
  function mostrar(tr) {
    $('#g-inclin').innerHTML = inclin(tr);
    const s = D.volta.sobreviveJailjudge;
    $('#sobrevive').innerHTML = `No JailJudge, <b>${s[tr]}%</b> do aumento sobrevive à volta com o ${trads.find(x => x[0] === tr)[1]}. Com os três tradutores: ${s.nllb}%, ${s.opus}% e ${s.deepseek}%.`;
    sel.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === tr)));
  }
  sel.innerHTML = trads.map(([k, n]) => `<button type="button" data-t="${k}" aria-pressed="false">${n}</button>`).join('');
  sel.addEventListener('click', e => { const b = e.target.closest('button'); if (b) mostrar(b.dataset.t); });
  mostrar('nllb');

  // HarmBench: dois pares de barras
  (function () {
    const fn = D.fnReliable.harmbench, fp = D.fpHarmbenchReliable, base = 206, H = v => v / 40 * 150;
    const barras = [[44, fn.en, C.en], [112, fn.nllb, C.pt], [236, fp.en, C.en], [304, fp.nllb, C.pt]];
    let s = `<path class="traco moldura" pathLength="1" d="M10 ${base} L390 ${base}"/>`;
    barras.forEach(([x, v, c]) => {
      s += `<rect x="${x}" y="${base - H(v)}" width="56" height="${H(v)}" fill="${c}" fill-opacity=".82" stroke="${C.tinta}" stroke-width="1" filter="url(#aquarela)"/>`;
      s += `<text class="val-g" x="${x + 28}" y="${base - H(v) - 8}">${f(v)}%</text>`;
    });
    [44, 112, 236, 304].forEach((x, i) => { s += `<text class="rot-m" x="${x + 28}" y="${base + 20}">${i % 2 ? 'português' : 'inglês'}</text>`; });
    s += `<text class="rot-g" x="106" y="${base + 46}">nocivas liberadas</text><text class="rot-g" x="298" y="${base + 46}">seguras barradas</text>`;
    $('#g-barras').innerHTML = svg('0 0 400 260', s, `HarmBench no ReliableBench: nocivas liberadas de ${f(fn.en)}% para ${f(fn.nllb)}%; seguras barradas de ${f(fp.en)}% para ${f(fp.nllb)}%.`);
  })();

  $('#resposta').textContent = D.projeto.resposta;

  // o tradutor também é um juiz: barras empilhadas
  (function () {
    const r = D.recusas, a = r.haiku, b = r.deepseekSem, c = r.deepseekCom, L = 10, W = 540;
    const COR = { traduziu: C.seguro, recusou: C.nocivo, executou: '#5a2418' };
    const linhas = [
      ['Claude Haiku 4.5, ' + a.total + ' pedidos', a.total, [['traduziu', a.traduziu], ['recusou', a.recusou]]],
      ['DeepSeek sem as marcas, ' + b.total + ' pedidos', b.total, [['traduziu', b.traduziu], ['recusou', b.recusou], ['executou', b.executou]]],
      ['DeepSeek com as marcas, ' + c.total + ' pedidos', c.total, [['traduziu', c.traduziu]]]
    ];
    let s = '';
    linhas.forEach(([nome, tot, segs], i) => {
      const y = 38 + i * 78;
      s += `<text class="rot-s" x="${L}" y="${y - 10}">${nome}</text>`;
      let x = L;
      segs.forEach(([k, n]) => {
        const w = n / tot * W;
        s += `<rect x="${x}" y="${y}" width="${w}" height="34" fill="${COR[k]}" fill-opacity=".85" stroke="${C.tinta}" stroke-width="1" filter="url(#aquarela)"/>`;
        s += w > 34 ? `<text class="val-i" x="${x + w / 2}" y="${y + 23}">${fi(n)}</text>` : `<text class="val-g" x="${x + w / 2}" y="${y - 6}">${fi(n)}</text>`;
        x += w;
      });
    });
    $('#g-recusas').innerHTML = svg('0 0 560 240', s, `Tradutores: Claude Haiku 4.5 traduziu ${a.traduziu} e recusou ${a.recusou} de ${a.total}; DeepSeek sem as marcas traduziu ${b.traduziu}, recusou ${b.recusou} e executou o ataque em ${b.executou} de ${b.total}; com as marcas traduziu ${c.traduziu}.`);

    const i = D.instrucaoLargada, X = v => 190 + v / 15 * 330;
    const bs = [['inglês', i.fnIngles, C.en], ['DeepSeek, como traduzido', i.fnComoTraduzido, C.pt], ['instrução reposta', i.fnReposta, '#d9a94f']];
    let t = `<path class="traco moldura" pathLength="1" d="M190 8 L190 112"/>`;
    bs.forEach(([n, v, c2], k) => {
      const y = 14 + k * 34;
      t += `<text class="rot-s" x="182" y="${y + 19}" text-anchor="end">${n}</text>`;
      t += `<rect x="190" y="${y}" width="${X(v) - 190}" height="26" fill="${c2}" fill-opacity=".85" stroke="${C.tinta}" stroke-width="1" filter="url(#aquarela)"/>`;
      t += `<text class="val" x="${X(v) + 8}" y="${y + 19}">${f(v)}%</text>`;
    });
    $('#g-largada').innerHTML = svg('0 0 560 120', t, `Llama Guard 3 no ReliableBench com o DeepSeek: ${f(i.fnComoTraduzido)}% como traduzido, ${f(i.fnReposta)}% com a instrução reposta, inglês ${f(i.fnIngles)}%.`);
  })();

  // linha do tempo: o plano da Atividade 3 contra o que cada entrega fez, e o dia de hoje
  const P = D.plano;
  const pagina = n => P.paginas.includes(n) ? `relatorios/atividade${n}.html` : P.apresentacoes.includes(n) ? `apresentacoes/atividade${n}.html` : `#biblioteca`;
  const EST = { feito: 'feito', parte: 'em parte', nao: 'não começou', andamento: 'em andamento' };
  const COR_EST = { feito: C.seguro, parte: C.pt, nao: C.fio, andamento: C.en };
  (function () {
    const dia = s => new Date(`${s}T12:00:00`);
    const t0 = dia('2026-08-20'), t1 = dia('2026-12-26');
    const W = 1120, L = 340, R = W - 16, topo = 96, alt = 64;
    const X = s => L + (dia(s) - t0) / (t1 - t0) * (R - L);
    const mais = (s, sem) => { const d = dia(s); d.setDate(d.getDate() + 7 * sem); return d.toISOString().slice(0, 10); };
    const alt2 = 44, sep = 50;
    const H = topo + P.etapas.length * alt + sep + P.extras.length * alt2 + 6;
    let s = '';
    [['2026-09-01', 'setembro'], ['2026-10-01', 'outubro'], ['2026-11-01', 'novembro'], ['2026-12-01', 'dezembro']].forEach(([d, nome]) => {
      s += `<line class="mes" x1="${X(d)}" y1="${topo - 22}" x2="${X(d)}" y2="${H}"/><text class="mes-t" x="${X(d) + 6}" y="${topo - 10}">${nome}</text>`;
    });
    s += `<text class="col-t" x="12" y="${topo - 10}">Etapa do plano</text>`;
    // as 13 entregas num trilho, cada uma no seu dia; as do mesmo dia se afastam
    s += `<path class="traco trilho" pathLength="1" d="M${L} 40 L${R} 40"/>`;
    let ultimo = -99;
    Object.keys(P.datas).map(Number).sort((a, b) => P.datas[a][0].localeCompare(P.datas[b][0]) || a - b).forEach(n => {
      const ds = P.datas[n], xd = X(ds[0]);
      const x = Math.max(xd, ultimo + 25);
      ultimo = x;
      const span = ds.length > 1 ? `<path class="vao" d="M${X(ds[0])} 40 L${X(ds[1])} 40"/>` : '';
      s += `<a href="${pagina(n)}" class="ent-pino" style="--i:${n}">${span}<line class="haste" x1="${xd}" y1="40" x2="${x}" y2="26"/>` +
        `<circle cx="${x}" cy="18" r="11"/><text x="${x}" y="22.5" text-anchor="middle">${n}</text>` +
        `<title>Atividade ${n}: ${D.atividades.find(a => a.n === n).titulo}</title></a>`;
    });
    s += `<text class="col-t" x="12" y="22">Entregas</text>`;
    let ini = P.inicio;
    P.etapas.forEach((e, i) => {
      const y = topo + i * alt, fim = mais(ini, e.semanas);
      s += `<line class="faixa" x1="12" y1="${y + alt - 4}" x2="${R}" y2="${y + alt - 4}"/>`;
      s += `<text class="et-nome" x="12" y="${y + 22}"><tspan class="et-n">${e.n}</tspan> ${e.nome}</text>`;
      s += `<text class="et-est" x="34" y="${y + 44}" fill="${({ feito: C.seguro, parte: "#87591a", nao: C.sepia, andamento: C.en })[e.estado]}">${EST[e.estado]}</text>`;
      s += `<rect class="planejado" x="${X(ini)}" y="${y + 8}" width="${X(fim) - X(ini)}" height="30" rx="3"><title>Planejado: ${e.semanas} ${e.semanas > 1 ? 'semanas' : 'semana'}, para entregar ${e.entrega} (${P.fonte})</title></rect>`;
      // cada entrega que fez algo da etapa vira uma etiqueta no dia dela; as do mesmo dia se afastam
      // se colidem, a segunda vai para a faixa de baixo
      const ocupado = [-99, -99];
      const pos = e.feito.map(f2 => {
        const larg = f2.a > 9 ? 44 : 36, xd = X(P.datas[f2.a][0]);
        const faixa = xd >= ocupado[0] + 3 ? 0 : xd >= ocupado[1] + 3 ? 1 : 0;
        const x0 = Math.max(xd, ocupado[faixa] + 3);
        ocupado[faixa] = x0 + larg;
        return { f2, larg, x0, faixa };
      });
      const duas = pos.some(p => p.faixa === 1);
      pos.forEach(({ f2, larg, x0, faixa }) => {
        const yy = y + (duas ? (faixa ? 30 : 7) : 14), claro = e.estado === 'parte';
        s += `<a href="${pagina(f2.a)}" class="marca-feita" style="--i:${i}"><rect x="${x0}" y="${yy}" width="${larg}" height="21" rx="3" fill="${COR_EST[e.estado]}" filter="url(#aquarela)"/>` +
          `<text x="${x0 + larg / 2}" y="${yy + 15.5}" text-anchor="middle" fill="${claro ? C.tinta : '#fff'}">A${f2.a}</text><title>Atividade ${f2.a}: ${f2.txt} (${f2.fonte})</title></a>`;
      });
      if (e.curta) s += `<text class="falta" x="${X(P.hoje) + 8}" y="${y + 54}">falta ${e.curta}</text>`;
      ini = fim;
    });
    // o que não estava no combinado: uma linha por frente, etiqueta preta com a estrela
    const y0 = topo + P.etapas.length * alt;
    s += `<text class="extra-t" x="12" y="${y0 + 32}">✦ A mais, fora do combinado</text>`;
    P.extras.forEach((x, k) => {
      const y = y0 + sep + k * alt2;
      s += `<line class="faixa" x1="12" y1="${y + alt2 - 4}" x2="${R}" y2="${y + alt2 - 4}"/>`;
      s += `<text class="et-nome" x="12" y="${y + 25}"><tspan class="estrela">✦</tspan> ${x.nome}</text>`;
      let ocup = -99;
      [...new Set(x.feito.map(f2 => f2.a))].forEach(a => {
        const itens = x.feito.filter(f2 => f2.a === a), larg = a > 9 ? 44 : 36;
        const x0 = Math.max(X(P.datas[a][0]), ocup + 3);
        ocup = x0 + larg;
        s += `<a href="${pagina(a)}" class="marca-feita extra" style="--i:${P.etapas.length + k}"><rect x="${x0}" y="${y + 10}" width="${larg}" height="21" rx="3"/>` +
          `<text x="${x0 + larg / 2}" y="${y + 25.5}" text-anchor="middle">A${a}</text><title>Atividade ${a}: ${itens.map(f2 => `${f2.txt} (${f2.fonte})`).join('; ')}</title></a>`;
      });
    });
    const xh = X(P.hoje);
    s += `<line class="hoje" x1="${xh}" y1="${topo - 26}" x2="${xh}" y2="${H}"/><text class="hoje-t" x="${xh}" y="${topo - 30}" text-anchor="middle">hoje, 09/11</text>`;
    $('#plano').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Linha do tempo do plano contra a execução: etapas 1, 2 e 3 feitas, 4 e 5 em parte, 6 não começou, 7 em andamento; e seis frentes a mais, fora do combinado.">${s}</svg>`;
  })();

  // o combinado contra o que existe hoje, com o tamanho do corpus em pontos
  (function () {
    const K = P.combinado, c = K.corpus, cada = 20;
    let s = '';
    const ponto = (x, y, cls, i) => `<circle class="${cls}" cx="${x}" cy="${y}" r="3.6" style="--i:${i}"/>`;
    // combinado: de 100 a 300 pares, 5 cheios e 10 vazados
    for (let i = 0; i < c.prometido[1] / cada; i++) {
      s += ponto(14 + (i % 5) * 10, 58 + Math.floor(i / 5) * 10, i < c.prometido[0] / cada ? 'pt-cheio' : 'pt-vazio', i);
    }
    s += `<text class="w-rot" x="8" y="30">combinado</text><text class="w-num" x="8" y="122">100 a 300 pares</text>`;
    // hoje: 6.560 pares
    const n = Math.round(c.feito / cada), cols = 41;
    for (let i = 0; i < n; i++) s += ponto(150 + (i % cols) * 10, 58 + Math.floor(i / cols) * 10, 'feito-p', i);
    s += `<text class="w-rot" x="144" y="30">traduzido até hoje</text><text class="w-num" x="144" y="152">${fi(c.feito)} pares, por ${c.tradutores} tradutores</text>`;
    s += `<text class="w-leg" x="560" y="30" text-anchor="end">cada ponto, ${cada} pares</text>`;
    const linhas = K.itens.map(it => `<tr><td>${it.prometido} <span class="fnt">${it.fonte}</span></td><td>${it.hoje} <span class="fnt">${it.hojeFonte}</span></td></tr>`).join('');
    $('#combinado').innerHTML = `
      <figure class="comb-corpus"><svg viewBox="0 0 570 166" role="img" aria-label="Combinado: 100 a 300 pares. Traduzido até hoje: ${fi(c.feito)} pares, por ${c.tradutores} tradutores.">${s}</svg>
        <figcaption>Traduzido até hoje: quase ${Math.ceil(c.feito / c.prometido[1])} vezes o máximo combinado. Fonte: ${c.fonte} (combinado), ${c.feitoFonte} (traduzido).</figcaption></figure>
      <div class="comb-tab"><table><thead><tr><th scope="col">O que foi combinado</th><th scope="col">Onde está hoje</th></tr></thead><tbody>${linhas}</tbody></table>
        <p class="comb-extra"><a href="#extras-t">✦ E ${P.extras.length} frentes a mais, que não estavam no combinado</a>: ${P.extras.map(x => x.curta).join(', ')}.</p></div>`;
  })();

  // o que fizemos a mais, frente por frente
  (function () {
    $('#extras').innerHTML = P.extras.map(x => `<li class="extra"><h4><span class="estrela">✦</span> ${x.nome}</h4><ul>${x.feito.map(f2 =>
      `<li><a class="chip" href="${pagina(f2.a)}">A${f2.a}</a> ${f2.txt}. <span class="fnt">${f2.fonte}</span></li>`).join('')}</ul></li>`).join('');
  })();

  // a mesma linha do tempo em texto: planejado, executado e onde está, etapa por etapa
  $('#onde').innerHTML = P.etapas.map(e => `
    <li class="etapa ${e.estado}">
      <div class="pl"><span class="et-num">${e.n}</span><h4>${e.nome}</h4><p>${e.semanas} ${e.semanas > 1 ? "semanas" : "semana"}, para entregar ${e.entrega}.</p></div>
      <div class="ex">${e.feito.length ? `<ul>${e.feito.map(f2 => `<li><a class="chip" href="${pagina(f2.a)}">A${f2.a}</a> ${f2.txt}. <span class="fnt">${f2.fonte}</span></li>`).join('')}</ul>` : '<p class="nada">Nada ainda.</p>'}</div>
      <div class="st"><span class="estado" style="--c:${COR_EST[e.estado]}">${EST[e.estado]}</span>${e.falta ? `<p>Falta ${e.falta}. <span class="fnt">${e.faltaFonte}</span></p>` : ''}</div>
    </li>`).join('');

  // páginas dos PDFs originais e telas dos slides, para os links da estante
  const relat = { 1: 3, 2: 3, 3: 5, 5: 3, 6: 4, 7: 2, 8: 2, 9: 3, 10: 3, 11: 24 };
  const slides = { 4: 12, 6: 13, 9: 11, 10: 12 };

  // portas da capa e a estante: relatórios, vídeos e apresentações, tudo à vista
  (function () {
    const tem = (lista, n) => lista.includes(n);
    const conta = { relatorios: P.paginas.length, videos: P.videos.length, apresentacoes: P.apresentacoes.length };
    document.querySelectorAll('[data-conta]').forEach(el => { el.textContent = conta[el.dataset.conta]; });
    const nums = D.atividades.map(a => a.n).filter(n => tem(P.paginas, n) || tem(P.videos, n) || tem(P.apresentacoes, n));
    $('#estante').innerHTML = nums.map(n => {
      const a = D.atividades.find(x => x.n === n);
      const capa = tem(P.videos, n)
        ? `<button class="capa-video" type="button" data-video="${n}" aria-label="Ver o vídeo da Atividade ${n}"><img src="assets/video/atividade${n}-pt.jpg" alt="Quadro do vídeo da Atividade ${n}" loading="lazy" width="1280" height="720"><span class="play" aria-hidden="true"></span><span class="dur">vídeo, 3 min</span></button>`
        : tem(P.apresentacoes, n)
          ? `<a class="capa-video" href="apresentacoes/atividade${n}.html" aria-label="Abrir a apresentação da Atividade ${n}"><img src="assets/img/apresentacao${n}.jpg" alt="Primeira tela da apresentação da Atividade ${n}" loading="lazy" width="960" height="540"><span class="dur">apresentação animada</span></a>`
          : `<a class="capa-video sem" href="relatorios/atividade${n}.html"><span>vídeo em produção</span></a>`;
      const acoes = [];
      if (tem(P.paginas, n)) acoes.push(`<a class="btn-l forte" href="relatorios/atividade${n}.html">Ler o relatório</a>`);
      if (tem(P.videos, n)) acoes.push(`<button class="btn-l" type="button" data-video="${n}">Ver o vídeo</button>`);
      if (tem(P.apresentacoes, n)) acoes.push(`<a class="btn-l" href="apresentacoes/atividade${n}.html">Apresentação</a>`);
      const pdfs = [];
      if (relat[n]) pdfs.push(`<a href="assets/docs/atividade${n}.pdf">PDF do relatório (${relat[n]} p.)</a>`);
      if (slides[n]) pdfs.push(`<a href="assets/docs/atividade${n}-apresentacao.pdf">slides em PDF (${slides[n]} telas)</a>`);
      const amais = P.extras.some(x => x.feito.some(f2 => f2.a === n)) ? ' <a class="selo-extra" href="#extras-t" title="Fez coisas além do combinado">✦ a mais</a>' : '';
      return `<li class="livro" id="ent-${n}"><div class="capa-l">${capa}</div><p class="ativ">Atividade ${n} &middot; ${a.data}${amais}</p><h3>${a.titulo}</h3>` +
        `<p class="res">${a.resultado || a.feito}</p><p class="acoes">${acoes.join('')}</p>` +
        (pdfs.length ? `<p class="pdfs">${pdfs.join(' &middot; ')}</p>` : '') + '</li>';
    }).join('');

    // o vídeo abre por cima da página, sem sair dela; a legenda vem desligada
    const dlg = $('#tocador');
    if (!dlg || !dlg.showModal) return;
    const vid = dlg.querySelector('video'), trilha = dlg.querySelector('track');
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-video]');
      if (!b) return;
      const n = +b.dataset.video, a = D.atividades.find(x => x.n === n);
      dlg.querySelector('.t').textContent = `Atividade ${n}: ${a.titulo}`;
      dlg.querySelector('.ler-r').href = `relatorios/atividade${n}.html`;
      vid.poster = `assets/video/atividade${n}-pt.jpg`;
      vid.src = `assets/video/atividade${n}-pt.mp4`;
      trilha.src = `assets/video/atividade${n}-pt.vtt`;
      dlg.showModal();
      vid.play().catch(() => {});
    });
    dlg.addEventListener('close', () => { vid.pause(); vid.removeAttribute('src'); vid.load(); });
    dlg.querySelector('.fechar').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  })();

  const icones = ['s-lupa', 's-escudo', 's-linguas'];
  $('#proximas').innerHTML = D.proximos.map((p, i) =>
    `<li><svg class="ico" aria-hidden="true"><use href="#${icones[i]}"/></svg><p>${p}</p></li>`).join('');

  // entrada das aquarelas e dos traços, uma vez
  const alvos = document.querySelectorAll('.rev');
  const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parado || !('IntersectionObserver' in window)) {
    alvos.forEach(a => a.classList.add('visto'));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    alvos.forEach(a => io.observe(a));
  }
})();
