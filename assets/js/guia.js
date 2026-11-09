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

  // diário de campo: quatro fases, tudo à vista
  const relat = { 1: 3, 2: 3, 3: 5, 5: 3, 6: 4, 7: 2, 8: 2, 9: 3, 10: 3, 11: 24 };
  const slides = { 4: 12, 6: 13, 9: 11, 10: 12 };
  const fases = [['Definir o problema', 1, 4], ['Traduzir', 5, 8], ['Julgar', 9, 11], ['Mostrar', 12, 13]];
  const negrito = tx => tx.replace(/\d+(?:[.,]\d+)*%?/g, m => `<b>${m}</b>`);
  const doc = '<svg class="doc" viewBox="0 0 64 64" aria-hidden="true"><use href="#s-doc"/></svg>';
  $('#diario').innerHTML = fases.map(([nome, de, ate]) => {
    const itens = D.atividades.filter(a => a.n >= de && a.n <= ate).map(a => {
      const links = [];
      if (relat[a.n]) links.push(`<a href="assets/docs/atividade${a.n}.pdf" target="_blank" rel="noopener">${doc}Relatório (${relat[a.n]} p.)</a>`);
      if (slides[a.n]) links.push(`<a href="assets/docs/atividade${a.n}-apresentacao.pdf" target="_blank" rel="noopener">${doc}Slides (${slides[a.n]} telas)</a>`);
      return `<li class="entrada"><span class="dia">${a.data}</span><div><h4>${a.titulo}</h4><p>${a.feito}</p>` +
        (a.resultado ? `<p class="res">${negrito(a.resultado)}</p>` : '') +
        (a.rota ? `<p class="dec">Nota: ${a.rota}</p>` : '') +
        (links.length ? `<p class="docs">${links.join('')}</p>` : '') + '</div></li>';
    }).join('');
    return `<section class="fase"><h3>${nome} <small>Atividades ${de} a ${ate}</small></h3><ol class="paginas">${itens}</ol></section>`;
  }).join('');

  const icones = ['s-lupa', 's-escudo', 's-linguas'];
  $('#proximas').innerHTML = D.proximos.map((p, i) =>
    `<li><svg class="ico" aria-hidden="true"><use href="#${icones[i]}"/></svg><p>${p}</p></li>`).join('');

  // notas
  const T = (cab, linhas) => `<div class="tabela"><table><thead><tr>${cab.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${linhas.map(l => `<tr>${l.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const fonteP = s => `<p class="fonte">Fonte: ${s}</p>`;
  const conds = D.condicoes.map(c => c.nome);
  const porJuiz = obj => D.juizes.map(j => [j.nome, ...D.condicoes.map(c => f(obj[j.id][c.id]))]);
  const N = (titulo, corpo) => `<details><summary>${titulo}</summary><div class="nota-corpo">${corpo}</div></details>`;
  const trocas = [];
  D.juizes.forEach(j => ['nllb', 'opus', 'deepseek'].forEach(k => {
    const v = D.trocasReliable[j.id][k];
    trocas.push([j.nome, trads.find(x => x[0] === k)[1], fi(v[0]), fi(v[1])]);
  }));
  const volta = [];
  trads.forEach(([k, n]) => D.juizes.forEach(j => { const v = D.volta[k][j.id]; volta.push([n, j.nome, f(v[0]), f(v[1]), f(v[2])]); }));
  const rotas = D.atividades.filter(a => a.rota).map(a => `<li><b>Atividade ${a.n}, ${a.titulo}.</b> ${a.rota}</li>`).join('');

  $('#notas-corpo').innerHTML = [
    N('Conjuntos de dados', T(['Nome', 'Identificador', 'Tamanho', 'Papel', 'Fonte'], D.dados.map(d => [d.nome, d.id, d.tamanho, d.papel, d.fonte]))),
    N('Tradutores', T(['Nome', 'Identificador', 'Onde roda', 'Fonte'], D.tradutores.map(d => [d.nome, d.id, d.onde, d.fonte]))),
    N('Juízes', T(['Nome', 'Modelo', 'Escore', 'Fonte'], D.juizes.map(j => [j.nome, j.modelo, j.escore, j.fonte]))),
    N('Métricas', `<ul>
      <li><b>Falso negativo:</b> parcela das respostas nocivas que o juiz libera.</li>
      <li><b>Falso positivo:</b> parcela das respostas seguras que o juiz barra.</li>
      <li><b>Pares comuns:</b> os 6.521 pares que têm veredito nas oito condições (quatro juízes, em inglês e em português). Dentro deles, 1.030 pertencem ao ReliableBench, com 887 respostas nocivas.</li>
      <li><b>Referência das trocas:</b> o veredito do próprio juiz em inglês. Liberadas são as nocivas que passam a ser liberadas, barradas são as nocivas que passam a ser barradas.</li>
      <li><b>Volta ao inglês:</b> a tradução para o português é traduzida de volta para o inglês e julgada de novo. Serve de controle da reescrita.</li>
      <li><b>AUROC:</b> área sob a curva ROC do escore do juiz, usada para o JailJudge.</li></ul>`),
    N('Tabelas dos gráficos', `
      <h4>Nocivas liberadas no ReliableBench, em %</h4>${T(['Juiz', ...conds], porJuiz(D.fnReliable))}${fonteP(D.fnReliable.fonte)}
      <h4>Nocivas liberadas nos 6.521 pares comuns, em %</h4>${T(['Juiz', ...conds], porJuiz(D.fnComuns))}${fonteP(D.fnComuns.fonte)}
      <h4>Seguras barradas pelo HarmBench no ReliableBench, em %</h4>${T(['Juiz', ...conds], [['HarmBench', ...D.condicoes.map(c => f(D.fpHarmbenchReliable[c.id]))]])}${fonteP(D.fpHarmbenchReliable.fonte)}
      <h4>Trocas de veredito contra o inglês, nas 887 nocivas do ReliableBench</h4>${T(['Juiz', 'Tradutor', 'Passam a ser liberadas', 'Passam a ser barradas'], trocas)}${fonteP(D.trocasReliable.fonte)}
      <h4>Controle da volta ao inglês, nocivas liberadas no ReliableBench, em %</h4>${T(['Tradutor', 'Juiz', 'Inglês', 'Português', 'Volta'], volta)}${fonteP(D.volta.fonte)}
      <h4>Parte do aumento do JailJudge que sobrevive à volta, em %</h4>${T(['', ...trads.map(x => x[1])], [['Sobrevive', ...trads.map(x => D.volta.sobreviveJailjudge[x[0]])]])}
      <h4>AUROC do JailJudge no ReliableBench</h4>${T(['Tradutor', 'Inglês', 'Português', 'Volta'], trads.map(([k, n]) => [n, ...D.aurocJailjudge[k].map(v => fmt(v, 3))]))}${fonteP(D.aurocJailjudge.fonte)}
      <h4>Quantos de cinco tradutores levam o Llama Guard 3 a dizer nocivo, nos ${dep.total} processos do JudgeStressTest</h4>${T(['Tradutores', '0', '1', '2', '3', '4', '5'], [['Processos', ...dep.porContagem.map(fi)]])}<p>Dependem do tradutor (de 1 a 4): ${dep.dependem}.</p>${fonteP(dep.fonte)}
      <h4>Custo projetado de traduzir os 6.560 processos, em US$</h4>${T(['Tradutor', 'Custo'], D.custo.map(c => [c.nome, c.faixa || f(c.usd, 2)]))}${fonteP(D.custoFonte)}`),
    N('Mudanças de rota', `<ul>${rotas}</ul>`),
    N('Fontes dos números', `<p>As siglas apontam para as linhas dos relatórios do semestre: A11:721 é a linha 721 do relatório da Atividade 11. O resultado final é o da Atividade 11 (commit a76848b, 29/10/2026). Números de atividades anteriores aparecem só no diário.</p>
      ${T(['Item', 'Fonte'], [['A pergunta', D.projeto.fontes.pergunta], ['A resposta', D.projeto.fontes.resposta], ['Os próximos passos', D.proximosFonte], ...D.atividades.map(a => [`Atividade ${a.n}, ${a.titulo}`, a.fonte])])}`)
  ].join('');

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
