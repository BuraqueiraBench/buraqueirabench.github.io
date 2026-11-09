// Página inicial: a cena da juíza (momento autoral), o registro em unidades, as fichas e as prévias das portas.
(function () {
  const D = window.DADOS;
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const curva = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const espera = ms => new Promise(r => setTimeout(r, ms));

  // ---------- a cena: processo em inglês, carimbo, tradução, carimbo de novo ----------
  const mesa = document.querySelector('.mesa');
  const proc = mesa.querySelector('.processo');
  const juiza = mesa.querySelector('.juiza');
  const lingua = proc.querySelector('[data-lingua]');
  const num = proc.querySelector('[data-num]');
  const cEn = proc.querySelector('[data-carimbo-en]');
  const cPt = proc.querySelector('[data-carimbo-pt]');
  const mudou = proc.querySelector('[data-mudou]');
  const faixa = proc.querySelector('.faixa-traducao');
  const linhas = [...proc.querySelectorAll('.bloco i')];

  // processos ilustrativos (esquema); os números reais estão no registro logo abaixo
  const casos = [
    { en: 'nocivo', pt: 'seguro' },
    { en: 'nocivo', pt: 'nocivo' },
    { en: 'seguro', pt: 'nocivo' },
    { en: 'nocivo', pt: 'nocivo' }
  ];
  const nomeVeredito = v => (v === 'nocivo' ? 'Nocivo' : 'Seguro');

  function carimbo(el, v, comLingua) {
    el.className = (el === cEn ? 'carimbo-en' : 'carimbo-pt') + ' carimbo ' + v;
    el.innerHTML = (comLingua ? '<span class="lingua">EN</span>' : '') + nomeVeredito(v);
  }
  function limpar() {
    cEn.className = 'carimbo-en'; cEn.textContent = '';
    cPt.className = 'carimbo-pt'; cPt.textContent = '';
    mudou.style.opacity = 0;
    lingua.className = 'etiqueta-lingua en'; lingua.textContent = 'EN';
    linhas.forEach(l => l.style.removeProperty('width'));
  }
  async function bater(el) {
    // a coruja desce o carimbo; o carimbo aparece com a pancada
    juiza.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-14px) rotate(-3deg)', offset: .45 }, { transform: 'translateY(6px) rotate(1deg)', offset: .8 }, { transform: 'translateY(0) rotate(0)' }], { duration: 520, easing: curva });
    await espera(330);
    el.animate([{ transform: 'scale(1.7) rotate(-14deg)', opacity: 0 }, { transform: 'scale(1) rotate(-7deg)', opacity: 1 }], { duration: 170, easing: 'cubic-bezier(.2,.9,.3,1.3)', fill: 'both' });
    proc.animate([{ transform: 'rotate(-2deg) translateY(0)' }, { transform: 'rotate(-2deg) translateY(3px)' }, { transform: 'rotate(-2deg) translateY(0)' }], { duration: 160 });
  }

  let rodando = false;
  let visivel = true;
  async function ciclo() {
    if (rodando) return;
    rodando = true;
    let i = 0;
    while (visivel) {
      const c = casos[i % casos.length];
      limpar();
      num.textContent = 'processo ' + (i % casos.length + 1);
      await proc.animate([{ transform: 'translateX(-130%) rotate(-8deg)', opacity: 0 }, { transform: 'translateX(0) rotate(-2deg)', opacity: 1 }], { duration: 650, easing: curva, fill: 'both' }).finished;
      await espera(350);
      carimbo(cPt, c.en, false);
      await bater(cPt);
      await espera(1100);
      // tradução: o carimbo do inglês vai para o canto, a faixa ocre passa e as linhas mudam
      carimbo(cEn, c.en, true);
      cPt.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'both' });
      faixa.animate([{ left: '-34%', opacity: 1 }, { left: '100%', opacity: 1 }], { duration: 700, easing: 'ease-in-out' });
      await espera(260);
      lingua.className = 'etiqueta-lingua pt'; lingua.textContent = 'PT';
      linhas.forEach(l => { l.style.width = (40 + Math.round(Math.random() * 55)) + '%'; });
      await espera(700);
      carimbo(cPt, c.pt, false);
      cPt.getAnimations().forEach(a => a.cancel());
      await bater(cPt);
      if (c.pt !== c.en) {
        await espera(250);
        mudou.animate([{ opacity: 0, transform: 'translateX(-50%) translateY(8px) rotate(2deg)' }, { opacity: 1, transform: 'translateX(-50%) translateY(0) rotate(2deg)' }], { duration: 300, easing: curva, fill: 'both' });
      }
      await espera(1900);
      await proc.animate([{ transform: 'translateX(0) rotate(-2deg)', opacity: 1 }, { transform: 'translateX(40%) translateY(-40px) rotate(6deg)', opacity: 0 }], { duration: 420, easing: 'ease-in', fill: 'both' }).finished;
      mudou.getAnimations().forEach(a => a.cancel());
      i += 1;
    }
    rodando = false;
  }

  if (reduzido) {
    // versão parada: o primeiro processo já com os dois vereditos e o aviso
    lingua.className = 'etiqueta-lingua pt'; lingua.textContent = 'PT';
    carimbo(cEn, 'nocivo', true);
    carimbo(cPt, 'seguro', false);
    mudou.style.opacity = 1;
  } else {
    new IntersectionObserver(es => {
      visivel = es[0].isIntersecting && !document.hidden;
      if (visivel) ciclo();
    }, { threshold: .15 }).observe(mesa);
    document.addEventListener('visibilitychange', () => { visivel = !document.hidden; if (visivel) ciclo(); });
    // a coruja vira um pouco para o lado do mouse
    window.addEventListener('pointermove', e => {
      const r = juiza.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      juiza.style.transform = 'rotate(' + (dx * 8).toFixed(2) + 'deg)';
    }, { passive: true });
  }

  // ---------- registro: 887 nocivas, 161 passam a ser liberadas e 58 passam a ser barradas ----------
  const t = D.trocasReliable;
  const [libera, barra] = t.jailjudge.nllb;
  const total = t.nocivasReliable;
  const caixa = document.getElementById('unidades');
  // ordem embaralhada fixa para os quadrados coloridos não ficarem em bloco
  const idx = [...Array(total).keys()];
  let s = 20261109;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let k = idx.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [idx[k], idx[j]] = [idx[j], idx[k]]; }
  const tipo = new Array(total).fill('');
  idx.slice(0, libera).forEach(k => { tipo[k] = 'libera'; });
  idx.slice(libera, libera + barra).forEach(k => { tipo[k] = 'barra'; });
  const quadrados = tipo.map(() => { const q = document.createElement('span'); caixa.appendChild(q); return q; });
  const pintar = () => quadrados.forEach((q, k) => { if (tipo[k]) q.className = tipo[k]; });
  if (reduzido) pintar();
  else {
    const obs = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      obs.disconnect();
      // os quadrados que trocam acendem em ondas, como carimbos sendo batidos
      const marcados = quadrados.map((q, k) => [q, k]).filter(([, k]) => tipo[k]);
      marcados.forEach(([q, k], n) => setTimeout(() => { q.className = tipo[k]; }, 300 + n * 7));
    }, { threshold: .35 });
    obs.observe(caixa);
  }

  // ---------- fichas dos juízes ----------
  const formas = {
    lg3: (x, y, r, cor) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cor}"/>`,
    harmbench: (x, y, r, cor) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" fill="${cor}"/>`,
    jailjudge: (x, y, r, cor) => `<path d="M${x} ${y - r - 1} L${x + r + 1} ${y + r} L${x - r - 1} ${y + r} Z" fill="${cor}"/>`,
    aegis: (x, y, r, cor) => `<path d="M${x} ${y - r - 1} L${x + r + 1} ${y} L${x} ${y + r + 1} L${x - r - 1} ${y} Z" fill="${cor}"/>`
  };
  const reacoes = {
    lg3: ['igual', 'quase não muda'],
    harmbench: ['rigido', 'fica mais rígido'],
    jailjudge: ['libera', 'libera mais nocivas'],
    aegis: ['depende', 'depende do tradutor']
  };
  const notas = {
    lg3: `Inglês ${fmt(8.2)}%, traduções de ${fmt(7.3)}% a ${fmt(10.6)}%.`,
    harmbench: `Libera menos nocivas, mas barra mais seguras: falso positivo de ${fmt(23.8)}% para ${fmt(35.7)}% com o NLLB-200.`,
    jailjudge: `De ${fmt(23.8)}% para até ${fmt(35.4)}% com o NLLB-200.`,
    aegis: `Cai com o NLLB-200 e o Opus-MT, sobe para ${fmt(28.6)}% com o DeepSeek.`
  };
  const fichas = document.getElementById('fichas');
  const X = v => 10 + (v / 40) * 280; // escala de 0% a 40%
  D.juizes.forEach(j => {
    const v = D.fnReliable[j.id];
    let marcas = '';
    ['nllb', 'opus', 'deepseek'].forEach(c => { marcas += formas[j.id](X(v[c]), 30, 6, '#a35f14'); });
    marcas += formas[j.id](X(v.en), 30, 7, '#2f5d8a');
    const svg = `<svg class="escala" viewBox="0 0 300 58" aria-hidden="true">
      <line x1="10" y1="30" x2="290" y2="30" stroke="#cdbfa8" stroke-width="2"/>
      ${[0, 10, 20, 30, 40].map(p => `<line x1="${X(p)}" y1="24" x2="${X(p)}" y2="36" stroke="#b5a68e" stroke-width="1"/><text x="${X(p)}" y="54" font-size="11" text-anchor="middle" fill="#4a3f35">${p}%</text>`).join('')}
      <line x1="${X(v.en)}" y1="30" x2="${X(Math.max(v.nllb, v.opus, v.deepseek))}" y2="30" stroke="#a35f14" stroke-width="3" opacity=".35"/>
      <line x1="${X(v.en)}" y1="30" x2="${X(Math.min(v.nllb, v.opus, v.deepseek))}" y2="30" stroke="#a35f14" stroke-width="3" opacity=".35"/>
      ${marcas}
      <text x="${X(v.en)}" y="14" font-size="12" font-weight="700" text-anchor="middle" fill="#2f5d8a">${fmt(v.en)}</text>
    </svg>`;
    const a = document.createElement('a');
    a.className = 'ficha papel porta';
    a.href = 'resultados.html';
    a.innerHTML = `<h3><svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>${j.nome}</h3>
      <p class="reacao ${reacoes[j.id][0]}">${reacoes[j.id][1]}</p>${svg}<p class="nota">${notas[j.id]}</p>`;
    fichas.appendChild(a);
  });

  // ---------- prévias das portas ----------
  const pr = document.getElementById('previa-resultados');
  if (pr) {
    const v = D.fnReliable;
    const linhasPrevia = D.juizes.map((j, k) => {
      const y = 16 + k * 22;
      return `<line x1="${10 + v[j.id].en * 4.6}" y1="${y}" x2="${10 + v[j.id].nllb * 4.6}" y2="${y}" stroke="#a35f14" stroke-width="3"/>` +
        formas[j.id](10 + v[j.id].en * 4.6, y, 5, '#2f5d8a') + formas[j.id](10 + v[j.id].nllb * 4.6, y, 5, '#a35f14');
    }).join('');
    pr.innerHTML = `<svg viewBox="0 0 200 96">${linhasPrevia}</svg>`;
  }
  const pe = document.getElementById('previa-evolucao');
  if (pe) {
    const pastas = D.atividades.map((a, k) => {
      const x = 8 + k * 14.5;
      const cor = a.rota ? '#a35f14' : '#4a3f35';
      return `<rect x="${x}" y="${30 + (k % 2) * 6}" width="12" height="46" rx="2" fill="${cor}" opacity="${a.rota ? 1 : .55}"/><rect x="${x + 2}" y="${24 + (k % 2) * 6}" width="7" height="8" rx="1.5" fill="${cor}" opacity="${a.rota ? 1 : .55}"/>`;
    }).join('');
    pe.innerHTML = `<svg viewBox="0 0 200 96">${pastas}</svg>`;
  }
})();
