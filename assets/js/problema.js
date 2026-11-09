// Página "O problema". Fontes: Ak:linha = atividadek.tex (ver conteudo.md, seção 2).
(function () {
  // as setas se desenham uma a uma, a da língua por último, com o "?"
  const d = document.getElementById('deslocs');
  if (!d) return;
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto || !('IntersectionObserver' in window)) return;
  d.classList.add('arma');
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) {
      requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('vai')));
      io.disconnect();
    }
  }, { threshold: 0.5 });
  io.observe(d);
})();
