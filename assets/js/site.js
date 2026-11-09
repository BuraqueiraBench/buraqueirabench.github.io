// Comum à página: formatação de número em pt-BR e menu que marca a seção visível ao rolar.
(function () {
  // número no formato do português: 23,8 e 6.521
  window.fmt = (v, casas = 1) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  window.fmtInt = v => Number(v).toLocaleString('pt-BR');

  const links = Array.from(document.querySelectorAll('[data-s]'));
  const secoes = Array.from(document.querySelectorAll('[data-nav]'));

  function marcar(id) {
    links.forEach(a => {
      if (a.dataset.s === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  marcar('inicio');
  if (!('IntersectionObserver' in window)) return;

  // a seção que cruza a faixa do meio da tela é a atual
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) marcar(e.target.dataset.nav); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach(s => io.observe(s));
})();
