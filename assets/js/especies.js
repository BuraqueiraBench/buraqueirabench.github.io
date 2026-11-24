// As doze espécies (uma coruja por juiz), a ficha de cada uma, as Pranchas VI e VII, a validação humana e a frase
// final. Todo número vem de dados-juizes.js (gerado por ferramentas/dados_juizes.py) ou de dados.js.
(function () {
  const D = window.DADOS, J = window.JUIZES, L = window.LIMIAR, CM = window.COMITE, CT = window.CONTROLES;
  const f = window.fmt, fi = window.fmtInt;
  const C = { en: '#3f6e9e', pt: '#c08a2e', nocivo: '#a8402c', seguro: '#5d7d3a', tinta: '#2e261d', sepia: '#6b5640', fio: '#b9ad95', cinza: '#9a8f7c' };
  const $ = (s, r = document) => r.querySelector(s);
  const svg = (vb, inner, rotulo) => `<svg viewBox="${vb}" role="img" aria-label="${rotulo}">${inner}</svg>`;
  const dot = (x, y, cor, r = 6) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}" fill-opacity=".88" stroke="${C.tinta}" stroke-width=".9" filter="url(#aquarela)"/>`;
  const TR = [['nllb', 'NLLB-200'], ['opus', 'Opus-MT'], ['deepseek', 'DeepSeek']];
  const CONDS = [['en', 'Inglês'], ...TR, ['swh', 'Suaíli (exploratório)']];
  const nomeTr = id => (TR.find(t => t[0] === id) || ['', 'suaíli'])[1];
  const sinal = v => (v > 0 ? '+' : v < 0 ? '−' : '') + f(Math.abs(v));
  const umOuUma = sp => /^(coruja|corujinha|suindara)/.test(sp) ? 'uma' : 'um';
  const porId = Object.fromEntries(J.map(j => [j.id, j]));

  // ---------- mini gráfico de cada espécie: nocivas liberadas e seguras barradas, inglês e três traduções ----------
  function mini(j) {
    const X = v => 8 + v / 100 * 244;
    let s = '';
    [['fnr', 'nocivas liberadas', 40], ['fpr', 'seguras barradas', 118]].forEach(([m, rot, y]) => {
      const en = j.taxas.en[m], pts = TR.map(([k]) => j.taxas[k][m]);
      const lo = Math.min(...pts), hi = Math.max(...pts);
      s += `<text class="rot-mini" x="8" y="${y - 17}">${rot}</text>`;
      s += `<line class="eixo" x1="8" x2="252" y1="${y}" y2="${y}"/>`;
      [0, 50, 100].forEach(v => { s += `<line class="eixo" x1="${X(v)}" x2="${X(v)}" y1="${y - 4}" y2="${y + 4}"/>`; });
      s += `<path class="faixa-pt" d="M${X(lo)} ${y} L${X(hi)} ${y}"/>`;
      pts.forEach(v => { s += dot(X(v), y, C.pt, 5.5); });
      s += dot(X(en), y, C.en, 7);
      s += `<text class="val-p" x="8" y="${y + 25}"><tspan class="en">inglês ${f(en)}%</tspan> · <tspan class="pt">português ${lo === hi ? f(lo) : `${f(lo)} a ${f(hi)}`}%</tspan></text>`;
    });
    const t = j.taxas;
    return svg('0 0 260 152', s, `${j.nome}, no ReliableBench: nocivas liberadas ${f(t.en.fnr)}% em inglês, ${TR.map(([k, n]) => `${f(t[k].fnr)}% com o ${n}`).join(', ')}; seguras barradas ${f(t.en.fpr)}% em inglês, ${TR.map(([k, n]) => `${f(t[k].fpr)}% com o ${n}`).join(', ')}.`);
  }

  // ---------- galeria das doze espécies ----------
  function cartao(j, i) {
    return `<button class="especie" type="button" data-j="${j.id}" aria-haspopup="dialog" style="--i:${i}">
      <img class="pinta" loading="lazy" src="${j.img}" width="1024" height="1024" alt="Aquarela de ${umOuUma(j.especie)} ${j.especie}" onerror="this.classList.add('falta')">
      <span class="etiqueta"><svg class="cordao" viewBox="0 0 40 50" aria-hidden="true"><path class="traco" pathLength="1" d="M8 48 C0 36 14 28 20 4"/></svg><span class="nome-j${j.nome.length > 15 ? ' longo' : ''}">${j.nome}</span></span>
      <span class="sp">${j.especie}, <i>${j.cientifico}</i></span>
      <span class="comp">${j.comp}</span>
      <span class="mini">${mini(j)}</span>
      <span class="abrir">abrir a ficha</span>
    </button>`;
  }
  const grupos = [['origem', 'Os quatro do plano', 'os juízes que Schwinn et al. usaram em inglês'],
                  ['novo', 'Oito juízes novos, de 17/11', 'moderação treinada em várias línguas, modelos de decisão e um LLM com rubrica']];
  $('#especies').innerHTML = grupos.map(([g, t, sub]) =>
    `<div class="grupo-esp"><h3 class="grupo-t">${t}<small>${sub}</small></h3><div class="especies">${J.filter(j => j.grupo === g).map(cartao).join('')}</div></div>`).join('');

  // ---------- ficha de cada juiz ----------
  const dlg = $('#ficha');
  function ficha(id) {
    const j = porId[id], k = J.indexOf(j), ant = J[(k + J.length - 1) % J.length], prox = J[(k + 1) % J.length];
    const linhas = CONDS.map(([c, n]) => {
      const t = j.taxas[c];
      return `<tr${c === 'swh' ? ' class="expl"' : ''}><th scope="row">${n}</th><td>${f(t.fnr)}%</td><td>${f(t.fpr)}%</td><td>${f(t.auroc, 3)}</td></tr>`;
    }).join('');
    const parte = p => {
      const cls = !p[3] ? 'zero' : p[0] < 0 ? 'cai' : 'sobe';
      return `<span class="pt-${cls}">${sinal(p[0])}</span> <span class="ic">[${sinal(p[1])}; ${sinal(p[2])}]</span>`;
    };
    const partes = [...TR, ['swh', 'Suaíli (exploratório)']].map(([c, n]) =>
      `<tr${c === 'swh' ? ' class="expl"' : ''}><th scope="row">${n}</th><td>${parte(j.partes[c].auroc.lingua)}</td><td>${parte(j.partes[c].auroc.reescrita)}</td></tr>`).join('');
    const lim = [...TR, ['swh', 'Suaíli (exploratório)']].map(([c, n]) => {
      const l = j.limiar[c];
      return `<tr${c === 'swh' ? ' class="expl"' : ''}><th scope="row">${n}</th><td>${sinal(l.antes)}</td><td class="${Math.abs(l.depois) <= 5 ? 'ok5' : 'fora5'}">${sinal(l.depois)}</td></tr>`;
    }).join('');
    $('.ficha-in', dlg).innerHTML = `
      <div class="ficha-topo"><p class="ficha-grupo">${j.grupo === 'origem' ? 'Juiz do plano' : 'Juiz novo, de 17/11'}</p><button class="btn-l fechar" type="button">Fechar</button></div>
      <div class="ficha-grade">
        <img class="ficha-img" src="${j.img}" width="1024" height="1024" alt="Aquarela de ${umOuUma(j.especie)} ${j.especie}">
        <div class="ficha-txt">
          <h3 id="ficha-nome">${j.nome}</h3>
          <p class="sp">${j.especie}, <i>${j.cientifico}</i></p>
          <p class="sobre">${j.sobre}</p>
          <p class="comp-f">${j.comp}</p>
          <table class="ficha-tab"><caption>No ReliableBench: 887 nocivas e 143 seguras.</caption>
            <thead><tr><th scope="col"></th><th scope="col">nocivas liberadas</th><th scope="col">seguras barradas</th><th scope="col">AUROC</th></tr></thead>
            <tbody>${linhas}</tbody></table>
        </div>
      </div>
      <div class="ficha-duas">
        <div><h4>De onde vem a mudança na AUROC</h4>
          <table class="ficha-tab"><thead><tr><th scope="col"></th><th scope="col">parte da língua</th><th scope="col">parte da reescrita</th></tr></thead><tbody>${partes}</tbody></table>
          <p class="nota-pe">Em centésimos de AUROC, com o intervalo de 95%. Língua: português menos a volta ao inglês; reescrita: a volta menos o inglês. Em vermelho, o intervalo fica todo abaixo do zero; em verde, todo acima.</p></div>
        <div><h4>Com um limiar ajustado na língua</h4>
          <table class="ficha-tab"><thead><tr><th scope="col"></th><th scope="col">limiar 0,5</th><th scope="col">limiar ajustado</th></tr></thead><tbody>${lim}</tbody></table>
          <p class="nota-pe">Pontos de nocivas liberadas a mais (ou a menos) que em inglês. O limiar ajustado é escolhido com 100 pares rotulados da língua, para barrar a mesma fração de seguras que em inglês; em verde, a até 5 pontos do inglês.</p></div>
      </div>
      <nav class="ficha-nav" aria-label="Outras espécies"><button type="button" class="btn-l" data-ir="${ant.id}">← ${ant.nome}</button><button type="button" class="btn-l" data-ir="${prox.id}">${prox.nome} →</button></nav>`;
  }
  if (dlg && dlg.showModal) {
    document.addEventListener('click', e => {
      const b = e.target.closest('.especie[data-j]');
      if (b) { ficha(b.dataset.j); dlg.showModal(); $('.fechar', dlg).focus(); }
    });
    dlg.addEventListener('click', e => {
      if (e.target === dlg || e.target.closest('.fechar')) { dlg.close(); return; }
      const ir = e.target.closest('[data-ir]');
      if (ir) { ficha(ir.dataset.ir); $('.ficha-in', dlg).scrollTop = 0; dlg.scrollTop = 0; }
    });
  }

  // ---------- Prancha VI: a parte da língua (ou da reescrita) na AUROC, juiz por juiz ----------
  const casosPt = J.flatMap(j => TR.map(([c]) => j.partes[c].auroc.lingua));
  const incluiZero = casosPt.filter(p => !p[3]).length, abaixo = casosPt.filter(p => p[3] && p[0] < 0).length;
  const acima = casosPt.length - incluiZero - abaixo;
  let parteSel = 'lingua', tradSel = 'nllb';
  function floresta() {
    const ps = J.map(j => j.partes[tradSel].auroc[parteSel]);
    let lo = Math.min(0, ...ps.map(p => p[1])), hi = Math.max(0, ...ps.map(p => p[2]));
    lo = Math.floor(lo / 5) * 5; hi = Math.ceil(hi / 5) * 5;
    if (hi - lo < 15) hi = lo + 15;
    const E = 190, Dr = 620, topo = 26, alt = 29, X = v => E + (v - lo) / (hi - lo) * (Dr - E);
    const H = topo + J.length * alt + 46;
    let s = '';
    for (let v = lo; v <= hi; v += 5) {
      s += `<line class="${v === 0 ? 'zero-l' : 'grade-l'}" x1="${X(v)}" x2="${X(v)}" y1="${topo - 10}" y2="${topo + J.length * alt}"/>`;
      s += `<text class="tk" x="${X(v)}" y="${topo + J.length * alt + 18}" text-anchor="middle">${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}</text>`;
    }
    s += `<text class="rot" x="${X(lo)}" y="${H - 6}">separa pior</text><text class="rot" x="${X(hi)}" y="${H - 6}" text-anchor="end">separa melhor</text>`;
    J.forEach((j, i) => {
      const y = topo + i * alt + alt / 2, p = ps[i];
      const cor = !p[3] ? C.cinza : p[0] < 0 ? C.nocivo : C.seguro;
      if (i === 4) s += `<line class="sep-g" x1="8" x2="${Dr}" y1="${y - alt / 2}" y2="${y - alt / 2}"/>`;
      s += `<g class="lin-f" data-j="${j.id}"><title>${j.nome}: ${sinal(p[0])} [${sinal(p[1])}; ${sinal(p[2])}]</title>`;
      s += `<text class="rot-f${j.grupo === 'novo' ? ' novo' : ''}" x="${E - 12}" y="${y + 4.5}" text-anchor="end">${j.nome}</text>`;
      s += `<line x1="${X(p[1])}" x2="${X(p[2])}" y1="${y}" y2="${y}" stroke="${cor}" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
      s += dot(X(p[0]), y, cor, 6) + `</g>`;
    });
    $('#g-floresta').innerHTML = svg(`0 0 640 ${H}`, s, `Parte da ${parteSel === 'lingua' ? 'língua' : 'reescrita'} na AUROC com o ${nomeTr(tradSel)}, por juiz: ${J.map((j, i) => `${j.nome} ${sinal(ps[i][0])}`).join(', ')}.`);
    const nz = ps.filter(p => !p[3]).length;
    const qual = parteSel === 'lingua' ? 'da língua' : 'da reescrita';
    $('#conta-lingua').innerHTML = `${tradSel === 'swh' ? 'No suaíli' : `Com o ${nomeTr(tradSel)}`}, o intervalo da parte ${qual} inclui o zero em <b>${nz} de ${J.length}</b> juízes.` +
      (parteSel === 'lingua' ? ` Nos ${casosPt.length} casos em português, ${incluiZero} incluem o zero, ${abaixo} ficam abaixo e ${acima} acima.` : '');
    document.querySelectorAll('#sel-parte button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === parteSel)));
    document.querySelectorAll('#sel-trad6 button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === tradSel)));
  }
  $('#sel-parte').innerHTML = [['lingua', 'parte da língua'], ['reescrita', 'parte da reescrita']].map(([v, n]) => `<button type="button" data-v="${v}">${n}</button>`).join('');
  $('#sel-trad6').innerHTML = [...TR, ['swh', 'suaíli (exploratório)']].map(([v, n]) => `<button type="button" data-v="${v}">${n}</button>`).join('');
  $('#sel-parte').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { parteSel = b.dataset.v; floresta(); } });
  $('#sel-trad6').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { tradSel = b.dataset.v; floresta(); } });
  floresta();
  $('#g-floresta').addEventListener('click', e => {
    const g = e.target.closest('.lin-f');
    if (g && dlg && dlg.showModal) { ficha(g.dataset.j); dlg.showModal(); }
  });

  // ---------- Prancha VII: limiar de fábrica contra limiar ajustado na língua ----------
  const P = L.pontos, grupo = Object.fromEntries(J.map(j => [j.id, j.grupo]));
  const mantem = P.filter(p => p.dauroc > -2), cai = P.filter(p => p.dauroc <= -2);
  const ate5 = (ps, campo) => ps.filter(p => Math.abs(p[campo]) <= 5).length;
  console.assert(mantem.length === L.mantem.n && ate5(mantem, 'depois') === L.mantem.ate5_depois && ate5(cai, 'depois') === L.cai.ate5_depois, 'LIMIAR não bate com os pontos');
  (function () {
    const xs = P.map(p => p.dauroc), ys = P.flatMap(p => [p.antes, p.depois]);
    const x0 = Math.floor(Math.min(...xs) / 2) * 2, x1 = Math.ceil(Math.max(...xs, 2) / 2) * 2;
    const y0 = Math.floor(Math.min(...ys, -6) / 5) * 5, y1 = Math.ceil(Math.max(...ys, 6) / 5) * 5;
    const E = 64, Dr = 588, T = 18, B = 360, X = v => E + (v - x0) / (x1 - x0) * (Dr - E), Y = v => T + (y1 - v) / (y1 - y0) * (B - T);
    let s = `<rect class="faixa5" x="${E}" y="${Y(5)}" width="${Dr - E}" height="${Y(-5) - Y(5)}"/>`;
    for (let v = y0; v <= y1; v += 5) {
      s += `<line class="${v === 0 ? 'zero-l' : 'grade-l'}" x1="${E}" x2="${Dr}" y1="${Y(v)}" y2="${Y(v)}"/><text class="tk" x="${E - 8}" y="${Y(v) + 4}" text-anchor="end">${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}</text>`;
    }
    for (let v = x0; v <= x1; v += 2) s += `<text class="tk" x="${X(v)}" y="${B + 18}" text-anchor="middle">${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}</text>`;
    s += `<line class="corte-l" x1="${X(-2)}" x2="${X(-2)}" y1="${T}" y2="${B}"/>`;
    s += `<text class="rot" x="${X(-2) - 8}" y="${T + 14}" text-anchor="end">perde a ordenação</text><text class="rot" x="${X(-2) + 8}" y="${T + 14}">mantém</text>`;
    s += `<text class="rot-m" x="${(E + Dr) / 2}" y="${B + 40}">mudança na AUROC, do inglês para o português (centésimos)</text>`;
    s += `<text class="rot-m" transform="translate(16 ${(T + B) / 2}) rotate(-90)">nocivas liberadas, pontos a mais que em inglês</text>`;
    P.forEach(p => {
      const j = porId[p.j], cor = p.dauroc > -2 ? C.seguro : C.nocivo, x = X(p.dauroc);
      const forma = grupo[p.j] === 'origem'
        ? `<circle r="6" fill="${cor}" fill-opacity=".85" stroke="${C.tinta}" stroke-width=".9"/>`
        : `<rect x="-5.5" y="-5.5" width="11" height="11" fill="${cor}" fill-opacity=".85" stroke="${C.tinta}" stroke-width=".9"/>`;
      s += `<g class="pt-l" data-antes="${Y(p.antes)}" data-depois="${Y(p.depois)}" style="transform:translate(${x}px,${Y(p.antes)}px)"><title>${j.nome} com o ${nomeTr(p.cond)}: AUROC ${sinal(p.dauroc)}; com o limiar 0,5, ${sinal(p.antes)} pontos; com o limiar ajustado, ${sinal(p.depois)}</title>${forma}</g>`;
    });
    $('#g-limiar').innerHTML = svg('0 0 600 410', s, `Os 36 casos em português: com o limiar ajustado, ${L.mantem.ate5_depois} dos ${L.mantem.n} que mantêm a ordenação e ${L.cai.ate5_depois} dos ${L.cai.n} que a perdem ficam a até 5 pontos do inglês.`);
  })();
  const comiteMax = Math.max(...TR.map(([c]) => Math.abs(CM[c].depois)));
  function limiar(qual) {
    document.querySelectorAll('#g-limiar .pt-l').forEach(g => {
      const m = /translate\(([-\d.]+)px/.exec(g.style.transform);
      g.style.transform = `translate(${m[1]}px,${g.dataset[qual]}px)`;
    });
    const campo = qual;
    $('#conta-limiar').innerHTML = qual === 'antes'
      ? `Com o limiar de fábrica (0,5), <b>${ate5(mantem, campo)} dos ${mantem.length}</b> casos em que o juiz mantém a ordenação ficam a até 5 pontos do inglês, e <b>${ate5(cai, campo)} dos ${cai.length}</b> em que ele a perde.`
      : `Com o limiar ajustado na língua, <b>${ate5(mantem, campo)} dos ${mantem.length}</b> casos que mantêm a ordenação ficam a até 5 pontos do inglês; dos ${cai.length} que a perdem, só <b>${ate5(cai, campo)}</b>. O comitê dos quatro juízes do plano, com o limiar ajustado, fica a até ${f(comiteMax)} ponto do inglês com os três tradutores.`;
    document.querySelectorAll('#sel-limiar button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === qual)));
  }
  $('#sel-limiar').innerHTML = [['antes', 'limiar de fábrica, 0,5'], ['depois', 'limiar ajustado com 100 pares']].map(([v, n]) => `<button type="button" data-v="${v}">${n}</button>`).join('');
  $('#sel-limiar').addEventListener('click', e => { const b = e.target.closest('button'); if (b) limiar(b.dataset.v); });
  limiar('antes');
  // ao entrar na tela, os pontos andam sozinhos do limiar de fábrica para o ajustado, uma vez
  const pr7 = $('#prancha-limiar'), parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parado || !('IntersectionObserver' in window)) limiar('depois');
  else {
    const io7 = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { setTimeout(() => limiar('depois'), 1400); io7.disconnect(); }
    }), { threshold: 0.45 });
    io7.observe(pr7);
  }

  // ---------- frase final, com as contagens ----------
  const resp = $('#resposta');
  if (resp) resp.textContent = `Depende do juiz. Em ${incluiZero} de ${casosPt.length} casos, a língua sozinha não tira do juiz a capacidade de separar nocivas de seguras; ela muda o corte. Ajustado com 100 pares da língua, o corte volta para perto do inglês em ${L.mantem.ate5_depois} dos ${L.mantem.n} casos em que o juiz ainda separa bem.`;

  // ---------- validação humana ----------
  const V = D.validacao, pi = V.piloto, pl = V.plano;
  $('#val-piloto').innerHTML = `${pi.pares} pares do ReliableBench nas traduções, sem o original em inglês: <b>${pi.versoes} versões</b>, rotuladas às cegas por ${pi.anotador}. As traduções de cada par ficaram com o mesmo rótulo, e o inglês, rotulado por ele em ${pi.ingles.data} (já tendo lido as traduções), teve esse rótulo nos ${pi.ingles.iguais}. Com os rótulos travados, cada tradução ganhou uma nota de fidelidade de 1 (sentido perdido) a 4 (fiel):`;
  (function () {
    const cores = ['#a8402c', '#c08a2e', '#a3b585', '#5d7d3a'], W = 420, L0 = 110;
    let s = '';
    [['deepseek', 'DeepSeek'], ['nllb', 'NLLB-200'], ['opus', 'Opus-MT']].forEach(([k, n], i) => {
      const y = 12 + i * 44, fd = pi.fidelidade[k], tot = fd.reduce((a, b) => a + b, 0);
      s += `<text class="rot-s" x="${L0 - 10}" y="${y + 20}" text-anchor="end">${n}</text>`;
      let x = L0;
      fd.forEach((c, nota) => {
        if (!c) return;
        const w = c / tot * W;
        s += `<rect x="${x}" y="${y}" width="${w}" height="28" fill="${cores[nota]}" fill-opacity=".86" stroke="${C.tinta}" stroke-width="1" filter="url(#aquarela)"/>`;
        s += `<text class="val-i" x="${x + w / 2}" y="${y + 19}">${w < 110 ? c : `${c} com nota ${nota + 1}`}</text>`;
        x += w;
      });
    });
    // legenda das notas, uma cor por nota
    [['1', 'sentido perdido'], ['2', ''], ['3', ''], ['4', 'fiel']].forEach(([n, t], i) => {
      const x = [100, 296, 378, 460][i];
      s += `<rect x="${x}" y="150" width="16" height="16" fill="${cores[i]}" fill-opacity=".86" stroke="${C.tinta}" stroke-width=".8"/><text class="rot-s" x="${x + 22}" y="163">nota ${n}${t ? `, ${t}` : ''}</text>`;
    });
    $('#g-fidelidade').innerHTML = svg('0 0 560 176', s, `Notas de fidelidade no piloto: DeepSeek, 8 com nota 4; NLLB-200, 7 com nota 3 e 1 com nota 2; Opus-MT, 5 com nota 3 e 3 com nota 2.`);
  })();
  $('#val-tempo').textContent = `Tempo por versão no piloto: mediana de ${f(pi.segundos.p1)} s na passada às cegas e ${f(pi.segundos.p2)} s na de fidelidade, de quem já conhecia os textos. Quem lê pela primeira vez deve levar mais; a página de anotação registra o tempo de cada item.`;
  (function () {
    // as quatro duplas cruzadas: autores nas linhas, anotadores de fora nas colunas
    const cx = [250, 400], cy = [92, 176];
    let s = `<text class="rot-m" x="325" y="18">anotadores de fora do projeto</text>`;
    ['C', 'D'].forEach((n, i) => { s += `<circle cx="${cx[i]}" cy="44" r="17" fill="${C.en}" fill-opacity=".85" stroke="${C.tinta}" filter="url(#aquarela)"/><text class="val-i" x="${cx[i]}" y="50">${n}</text>`; });
    s += `<text class="rot-m" transform="translate(28 134) rotate(-90)">autores</text>`;
    ['A', 'B'].forEach((n, i) => { s += `<circle cx="88" cy="${cy[i]}" r="17" fill="${C.pt}" fill-opacity=".9" stroke="${C.tinta}" filter="url(#aquarela)"/><text class="val-i" x="88" y="${cy[i] + 6}">${n}</text>`; });
    // em cada casa, os pares novos da dupla (os do piloto, os quatro rotulam)
    cy.forEach((y, i) => cx.forEach((x, j) => {
      const n = pl.duplas['AB'[i]]['CD'[j]];
      s += `<rect x="${x - 66}" y="${y - 34}" width="132" height="68" rx="4" fill="#efe6d2" stroke="${C.tinta}" stroke-width="1" filter="url(#aquarela)"/>`;
      s += `<text class="val-g" x="${x}" y="${y - 2}">${n}</text><text class="rot-s" x="${x}" y="${y + 20}" text-anchor="middle">pares novos</text>`;
    }));
    s += `<text class="rot-m" x="325" y="238">cada par: o rótulo de um autor e o de alguém de fora</text>`;
    const dd = pl.duplas;
    $('#g-duplas').innerHTML = svg('0 0 480 250', s, `Quatro duplas cruzadas de autor e anotador de fora, em pares novos: A e C, ${dd.A.C}; A e D, ${dd.A.D}; B e C, ${dd.B.C}; B e D, ${dd.B.D}. Os ${pl.piloto} pares do piloto, os quatro rotulam; ${pl.pares} pares no total.`);
  })();
  $('#val-plano').innerHTML = [
    `<b>${pl.pares} pares</b> do ReliableBench, contando os ${pl.piloto} do piloto, cada um em inglês e nas três traduções. Entram todos os ${pl.seguros} seguros com rótulo unânime e ${pl.nocivos} nocivos: numa taxa perto de 30%, a margem fica em ±${pl.margem.seguros} pontos nas seguras e ±${pl.margem.nocivos} nas nocivas.`,
    `<b>Quatro anotadores nativos</b>, dois autores e dois de fora do projeto, cada um com ${pl.novosPorAnotador} pares novos. As duplas se cruzam, para que um anotador mais rigoroso não pese só numa metade da amostra; quando a dupla discorda, decide o outro anotador de fora.`,
    `<b>Calibração</b> nos ${pl.calibracao} originais em inglês do piloto. Depois, cada um rotula uma lista só, embaralhada, com duas versões do mesmo par a pelo menos ${pl.distancia} itens uma da outra, para não repetir o rótulo que acabou de dar.`,
    `A concordância entre as pessoas (alfa de Krippendorff com os quatro, kappa de Cohen e AC1 de Gwet por dupla) é o teto contra o qual se lê a de cada juiz.`,
    `<b>A página de anotação está pronta</b>, com aviso de conteúdo, opção de pular qualquer item e uso no celular. O primeiro autor fez a calibração em ${pl.calibracaoFeita}.`,
    `As versões são longas: mediana de ${fi(pl.palavras.medianaIngles)} palavras no inglês e até ${fi(pl.palavras.maximo)} numa tradução; cada anotador lê de ${pl.palavras.passada1[0]} a ${pl.palavras.passada1[1]} mil palavras só na primeira passada.`
  ].map(t => `<li>${t}</li>`).join('');

  // ---------- o que ainda não se pode afirmar: o ruído ----------
  const rj = CT.jev, rr = CT.jailjudge, lr = $('#limite-ruido');
  if (lr) lr.insertAdjacentHTML('beforeend', ` Só reescrever, sem trocar de língua, já mexe: no Jev, a paráfrase em inglês muda ${rj.parafrase} dos ${fi(rj.pares)} vereditos, quase o mesmo que a tradução (${rj.traducao}). E o JailJudge, rodado ${rr.rodadas} vezes nos mesmos ${fi(rr.pares)} pares em inglês, muda de veredito em ${rr.mudaEmAlguma} deles em alguma rodada. Por isso a Prancha VI separa a língua da reescrita e mostra o intervalo.`);

  // ---------- contas da capa ----------
  const minutos = Object.values(window.DURACOES || {});
  document.querySelectorAll('[data-conta="juizes"]').forEach(el => { el.textContent = J.length; });
  if (minutos.length) document.querySelectorAll('[data-conta="minutos"]').forEach(el => {
    el.textContent = `de ${Math.floor(Math.min(...minutos) / 60)} a ${Math.ceil(Math.max(...minutos) / 60)}`;
  });
})();
