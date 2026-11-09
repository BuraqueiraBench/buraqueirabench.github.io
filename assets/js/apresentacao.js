// Apresentação: uma tela por vez, que se monta sozinha ao entrar. Seta, espaço, clique ou deslizar
// passam; se a tela ainda está se montando, a primeira seta só termina a montagem.
(function () {
  const telas = Array.from(document.querySelectorAll('.tela'));
  const palco = document.getElementById('palco');
  const cont = document.getElementById('cont');
  const barra = document.querySelector('.ap-prog span');
  const visao = document.getElementById('visao');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (v, c) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
  let i = 0, montada = false, relogio = null;

  function contar(t, ja) {
    t.querySelectorAll('[data-ate]').forEach(el => {
      const ate = parseFloat(el.dataset.ate), c = parseInt(el.dataset.casas || '0', 10);
      if (ja || reduz) { el.textContent = fmt(ate, c); return; }
      const atraso = (parseFloat(el.dataset.d) || 0) * 1000, dur = 1000;
      el.textContent = fmt(0, c);
      clearTimeout(el._t);
      el._t = setTimeout(() => {
        const t0 = performance.now();
        const passo = agora => {
          const f = Math.min(1, (agora - t0) / dur);
          el.textContent = fmt(ate * (1 - Math.pow(1 - f, 3)), c);
          if (f < 1 && t.classList.contains('atual')) requestAnimationFrame(passo);
          else el.textContent = fmt(ate, c);
        };
        requestAnimationFrame(passo);
      }, atraso);
    });
  }

  function ir(n) {
    n = Math.max(0, Math.min(telas.length - 1, n));
    telas[i].classList.remove('atual', 'pronto');
    i = n;
    const t = telas[i];
    void t.offsetWidth;
    t.classList.add('atual');
    if (reduz) t.classList.add('pronto');
    t.querySelectorAll('animateMotion').forEach(m => { try { m.beginElement(); } catch (_) { /* sem SMIL */ } });
    montada = reduz;
    clearTimeout(relogio);
    relogio = setTimeout(() => { montada = true; }, (parseFloat(t.dataset.dur) || 1.5) * 1000);
    contar(t, false);
    cont.textContent = `${String(i + 1).padStart(2, '0')} / ${String(telas.length).padStart(2, '0')}`;
    barra.style.width = `${(i + 1) / telas.length * 100}%`;
    history.replaceState(null, '', `#${i + 1}`);
  }
  function proxima() {
    if (!montada) {
      telas[i].classList.add('pronto');
      contar(telas[i], true);
      montada = true;
      return;
    }
    if (i < telas.length - 1) ir(i + 1);
  }
  const anterior = () => { if (i > 0) ir(i - 1); };

  function abrirVisao() {
    visao.hidden = false;
    visao.querySelectorAll('button').forEach((b, k) => k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
    const atual = visao.querySelector('[aria-current]');
    if (atual) atual.focus();
  }
  const fecharVisao = () => { visao.hidden = true; palco.focus(); };

  // visão de todas as telas, montada a partir das próprias telas
  visao.querySelector('ol').innerHTML = telas.map((t, k) => {
    const h = t.querySelector('h1, h2'), kk = t.querySelector('.kicker');
    return `<li><button type="button" data-ir="${k}"><span class="n">${String(k + 1).padStart(2, '0')}</span>` +
      (kk ? `<span class="k">${kk.textContent}</span>` : '') + `<span class="h">${h ? h.textContent : ''}</span></button></li>`;
  }).join('');
  visao.addEventListener('click', e => {
    const b = e.target.closest('[data-ir]');
    if (b) { ir(parseInt(b.dataset.ir, 10)); fecharVisao(); }
  });
  document.getElementById('b-visao').addEventListener('click', abrirVisao);
  document.getElementById('b-fechar').addEventListener('click', fecharVisao);
  document.getElementById('b-tela').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  });
  document.getElementById('ant').addEventListener('click', anterior);
  document.getElementById('prox').addEventListener('click', proxima);

  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (!visao.hidden) { if (e.key === 'Escape') fecharVisao(); return; }
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); proxima(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); anterior(); }
    else if (e.key === 'Home') ir(0);
    else if (e.key === 'End') ir(telas.length - 1);
    else if (e.key === 'Escape' || e.key === 'g') abrirVisao();
    else if (e.key === 'f') document.getElementById('b-tela').click();
  });
  palco.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const r = palco.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) anterior(); else proxima();
  });
  let x0 = null;
  palco.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  palco.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { dx < 0 ? proxima() : anterior(); }
    x0 = null;
  });

  const deHash = parseInt(location.hash.slice(1), 10);
  ir(Number.isFinite(deHash) ? deHash - 1 : 0);
})();
