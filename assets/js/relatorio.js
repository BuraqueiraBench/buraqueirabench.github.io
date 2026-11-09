// Página de relatório: sumário que acompanha a leitura, citação e nota que abrem no lugar,
// tabelas que se ordenam e mostram a barra do valor, figuras que se desenham ao entrar na tela.
(function () {
  const raiz = document.documentElement;
  raiz.classList.add('js');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const semHover = matchMedia('(hover: none)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // pontas das setas, no ângulo do fim de cada traço
  $$('svg.desenho path.seta').forEach(p => {
    const L = p.getTotalLength();
    const a = p.getPointAtLength(L), b = p.getPointAtLength(Math.max(0, L - 4));
    const ang = Math.atan2(a.y - b.y, a.x - b.x), t = p.classList.contains('grossa') ? 13 : 11, ab = .42;
    const x1 = a.x - t * Math.cos(ang - ab), y1 = a.y - t * Math.sin(ang - ab);
    const x2 = a.x - t * Math.cos(ang + ab), y2 = a.y - t * Math.sin(ang + ab);
    const h = document.createElementNS(NS, 'path');
    h.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} L${a.x.toFixed(1)} ${a.y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`);
    h.setAttribute('class', 'ponta' + (p.classList.contains('pt') ? ' pt' : '') + (p.classList.contains('nocivo') ? ' nocivo' : '') +(p.classList.contains('grossa') ? ' grossa' : ''));
    const d = parseFloat(p.style.getPropertyValue('--d')) || 0;
    h.style.setProperty('--d2', `${d + 1}s`);
    p.after(h);
  });

  // tabelas: colunas numéricas, barra do valor quando é taxa, ordenar pelo cabeçalho
  const numero = txt => {
    const s = txt.replace(/\s/g, '').replace(/[()]/g, '');
    if (!/^[-+]?(\d{1,3}(\.\d{3})+|\d+)(,\d+)?%?$/.test(s)) return null;
    return parseFloat(s.replace(/\.(?=\d{3})/g, '').replace(',', '.').replace('%', ''));
  };
  $$('table.t').forEach(tab => {
    const linhasCab = $$('thead tr', tab);
    const cabMulti = linhasCab.length > 1;
    const cab = linhasCab.length ? $$('th', linhasCab[linhasCab.length - 1]) : [];
    const linhas = $$('tbody tr', tab);
    if (!linhas.length) return;
    const ncol = Math.max(...linhas.map(l => l.cells.length));
    for (let c = 0; c < ncol; c++) {
      const cel = linhas.map(l => l.cells[c]).filter(Boolean);
      const vals = cel.map(td => numero(td.textContent.trim()));
      const ok = vals.filter(v => v !== null);
      cel.forEach(td => { if (td.textContent.trim() === '?') { td.classList.add('interroga'); td.innerHTML = `<span>${td.innerHTML}</span>`; } });
      if (ok.length < Math.max(2, cel.length * .7)) continue;
      cel.forEach((td, i) => { if (vals[i] !== null) td.classList.add('num'); });
      if (cab[c]) cab[c].classList.add('num');
      const pct = cel.some(td => td.textContent.includes('%'));
      const taxa = pct || ok.every(v => v >= 0 && v <= 1);
      if (!taxa) continue;
      const nome = cab[c] ? cab[c].textContent : '';
      const cor = /PT|portugu/i.test(nome) ? 'pt' : /EN\b|ingl/i.test(nome) ? 'en' : 'neutro';
      cel.forEach((td, i) => {
        if (vals[i] === null) return;
        // régua pequena de 0 a 1 (ou 0 a 100%) ao lado do número
        const v = Math.min(1, pct ? vals[i] / 100 : vals[i]);
        td.classList.add('barra', cor);
        td.innerHTML = `<span class="val">${td.innerHTML}</span><span class="regua" aria-hidden="true"><i style="--v:${v}"></i></span>`;
      });
    }
    if (linhas.length < 4 || !cab.length || cabMulti) return;
    cab.forEach((th, c) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = th.innerHTML;
      b.setAttribute('aria-label', `Ordenar por ${th.textContent.trim()}`);
      th.innerHTML = '';
      th.appendChild(b);
      b.addEventListener('click', () => {
        const desc = th.getAttribute('aria-sort') === 'ascending';
        cab.forEach(o => o.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', desc ? 'descending' : 'ascending');
        const corpo = tab.tBodies[0];
        const ord = $$('tr', corpo).sort((x, y) => {
          const a = x.cells[c] ? x.cells[c].textContent.trim() : '', bb = y.cells[c] ? y.cells[c].textContent.trim() : '';
          const na = numero(a), nb = numero(bb);
          const r = na !== null && nb !== null ? na - nb : a.localeCompare(bb, 'pt-BR', { numeric: true });
          return desc ? -r : r;
        });
        ord.forEach(tr => corpo.appendChild(tr));
      });
    });
  });

  // blocos de prompt com botão de copiar
  $$('article pre').forEach(pre => {
    if (!navigator.clipboard) return;
    const b = document.createElement('button');
    b.className = 'copiar';
    b.type = 'button';
    b.textContent = 'copiar';
    b.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.innerText.replace(/copiar$/, '').trimEnd()).then(() => {
        b.textContent = 'copiado';
        setTimeout(() => { b.textContent = 'copiar'; }, 1600);
      });
    });
    pre.appendChild(b);
  });

  // citação, nota e referência cruzada abrem um cartão no lugar
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.setAttribute('role', 'tooltip');
  document.body.appendChild(pop);
  let dono = null, fechar = null;
  function abrir(a) {
    const alvo = document.getElementById(a.dataset.nota);
    if (!alvo) return;
    const copia = alvo.cloneNode(true);
    copia.querySelectorAll('.footnote-back').forEach(e => e.remove());
    copia.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
    const ehRef = a.classList.contains('cite');
    pop.innerHTML = (ehRef ? `<b>[${a.textContent}]</b> ` : '') + copia.innerHTML +
      `<br><a class="ir" href="#${alvo.id}">${ehRef ? 'ver nas referências' : 'ver nas notas'}</a>`;
    const r = a.getBoundingClientRect();
    pop.style.left = '0px';
    pop.style.top = '0px';
    pop.classList.add('aberto');
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let x = window.scrollX + r.left + r.width / 2 - w / 2;
    x = Math.max(window.scrollX + 16, Math.min(x, window.scrollX + document.documentElement.clientWidth - w - 16));
    let y = window.scrollY + r.bottom + 8;
    if (r.bottom + h + 16 > innerHeight && r.top - h - 8 > 0) y = window.scrollY + r.top - h - 8;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    dono = a;
  }
  function sumir() { pop.classList.remove('aberto'); dono = null; }
  $$('a[data-nota]').forEach(a => {
    a.addEventListener('mouseenter', () => { clearTimeout(fechar); abrir(a); });
    a.addEventListener('mouseleave', () => { fechar = setTimeout(sumir, 220); });
    a.addEventListener('focus', () => abrir(a));
    a.addEventListener('blur', () => { fechar = setTimeout(sumir, 220); });
    a.addEventListener('click', e => {
      if (semHover && dono !== a) { e.preventDefault(); abrir(a); }
    });
  });
  pop.addEventListener('mouseenter', () => clearTimeout(fechar));
  pop.addEventListener('mouseleave', () => { fechar = setTimeout(sumir, 220); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sumir(); });
  document.addEventListener('click', e => { if (dono && !pop.contains(e.target) && e.target !== dono && !dono.contains(e.target)) sumir(); });

  // o destino de um link interno acende por um instante
  function acender() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el || !el.matches('li, figure')) return;
    el.classList.add('aceso');
    setTimeout(() => el.classList.remove('aceso'), 1800);
    sumir();
  }
  addEventListener('hashchange', acender);
  acender();

  // barra de leitura
  const barra = document.querySelector('.progresso span');
  const texto = document.getElementById('texto');
  function progresso() {
    const r = texto.getBoundingClientRect();
    const total = r.height - innerHeight * .6;
    const f = Math.min(1, Math.max(0, -r.top / total));
    barra.style.transform = `scaleX(${f})`;
  }
  addEventListener('scroll', progresso, { passive: true });
  progresso();

  // sumário marca a seção que está sendo lida
  const links = $$('.sumario a[data-alvo]');
  const sumario = document.querySelector('.sumario');
  const marcar = id => links.forEach(a => {
    if (a.dataset.alvo !== id) { a.removeAttribute('aria-current'); return; }
    a.setAttribute('aria-current', 'true');
    // o sumário longo (a Atividade 11 tem 27 seções) rola sozinho para mostrar a seção atual
    if (sumario && sumario.scrollHeight > sumario.clientHeight) {
      const topo = a.getBoundingClientRect().top - sumario.getBoundingClientRect().top + sumario.scrollTop, alvo = topo - sumario.clientHeight / 3;
      if (topo < sumario.scrollTop || topo > sumario.scrollTop + sumario.clientHeight - 40) sumario.scrollTo({ top: alvo, behavior: 'smooth' });
    }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) marcar(e.target.id); }),
      { rootMargin: '-30% 0px -65% 0px' });
    links.forEach(a => { const s = document.getElementById(a.dataset.alvo); if (s) io.observe(s); });

    // seções, figuras e tabelas entram quando chegam na tela
    const vis = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visto');
      vis.unobserve(e.target);
      const pontos = e.target.querySelectorAll('animateMotion');
      if (pontos.length && !reduz) {
        setTimeout(() => {
          e.target.classList.add('rodando');
          pontos.forEach((m, i) => { try { m.beginElement(); } catch (_) { /* sem SMIL */ } });
        }, 2600);
      }
    }), { threshold: 0, rootMargin: '0px 0px -4% 0px' });
    $$('article > section, figure').forEach(el => vis.observe(el));
  } else {
    $$('article > section, figure').forEach(el => el.classList.add('visto'));
  }
})();
