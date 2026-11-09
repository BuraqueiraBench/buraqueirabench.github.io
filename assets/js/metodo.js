// Página "O método". Fontes: Ak:linha = atividadek.tex (ver conteudo.md, seção 4).
(function () {
  const D = window.DADOS;
  // ---- momento autoral: uma folha EN percorre o fluxo, vira PT na ida e volta a EN na volta ----
  const fluxo = document.getElementById('fluxo');
  const folha = document.getElementById('folha');
  const et = document.getElementById('folha-et');
  const ancoras = [...document.querySelectorAll('.ancora')];
  const L = ['l0', 'l1', 'l2', 'l3'].map(id => document.getElementById(id));
  const mk = document.getElementById('mk-volta');
  const svg = document.getElementById('fio-svg');
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pts = [], seg = [], total = 0, cheio = false, raf = 0, t0 = 0, lingua = 'EN';

  function medir() {
    const r = fluxo.getBoundingClientRect();
    pts = ancoras.map(a => { const b = a.getBoundingClientRect(); return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2]; });
    svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
    seg = []; total = 0;
    L.forEach((l, i) => {
      const a = pts[i], b = pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
      seg.push({ s: total, len });
      total += len;
    });
    mk.setAttribute('x1', pts[3][0]); mk.setAttribute('y1', pts[3][1]); mk.setAttribute('x2', pts[4][0]); mk.setAttribute('y2', pts[4][1]);
  }

  function pinta(d) {
    L.forEach((l, i) => {
      const f = Math.max(0, Math.min(1, (d - seg[i].s) / seg[i].len));
      const alvo = i === 3 ? mk : l;
      alvo.style.strokeDasharray = seg[i].len;
      alvo.style.strokeDashoffset = seg[i].len * (1 - f);
    });
    let i = 0;
    while (i < 3 && d > seg[i].s + seg[i].len) i++;
    const f = Math.max(0, Math.min(1, (d - seg[i].s) / seg[i].len));
    const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
    const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
    folha.style.left = x + 'px'; folha.style.top = y + 'px';
    const nova = (d >= seg[1].s && d < seg[3].s) ? 'PT' : 'EN';
    if (nova !== lingua) {
      lingua = nova;
      et.textContent = nova;
      et.className = 'etiqueta-lingua ' + (nova === 'PT' ? 'pt' : 'en');
      folha.classList.remove('troca'); void folha.offsetWidth; folha.classList.add('troca');
    }
  }

  function passo(ts) {
    if (!t0) t0 = ts;
    const p = Math.min(1, (ts - t0) / 6500);
    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    pinta(total * (0.15 * p + 0.85 * e));
    if (p < 1) raf = requestAnimationFrame(passo);
    else { cheio = true; folha.classList.add('fim'); }
  }

  function estatico() {
    pinta(total); folha.classList.add('fim'); cheio = true;
  }

  function iniciar() {
    medir();
    if (quieto) { estatico(); return; }
    pinta(0);
    folha.classList.add('pronta');
    setTimeout(() => { raf = requestAnimationFrame(passo); }, 500);
  }

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { medir(); if (cheio) pinta(total); }, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(iniciar); else window.addEventListener('load', iniciar);
})();
