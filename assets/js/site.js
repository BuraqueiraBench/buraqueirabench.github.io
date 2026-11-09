// Comum a todas as páginas: marca a página atual no menu, painel lateral e formatação de número.
(function () {
  const pagina = document.body.dataset.pagina;
  document.querySelectorAll('[data-p]').forEach(a => {
    if (a.dataset.p === pagina) a.setAttribute('aria-current', 'page');
  });

  // número no formato do português: 23,8 e 6.521
  window.fmt = (v, casas = 1) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  window.fmtInt = v => Number(v).toLocaleString('pt-BR');

  // painel lateral: abre com conteúdo HTML, fecha com Esc, clique no X ou fora
  const painel = document.querySelector('.painel-lateral');
  if (painel) {
    const corpo = painel.querySelector('.painel-corpo');
    let origem = null;
    window.abrirPainel = (html, de) => {
      corpo.innerHTML = html;
      painel.classList.add('aberto');
      painel.setAttribute('aria-hidden', 'false');
      origem = de || document.activeElement;
      painel.querySelector('.fechar').focus();
    };
    window.fecharPainel = () => {
      painel.classList.remove('aberto');
      painel.setAttribute('aria-hidden', 'true');
      if (origem) origem.focus();
    };
    painel.querySelector('.fechar').addEventListener('click', window.fecharPainel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && painel.classList.contains('aberto')) window.fecharPainel(); });
  }
})();
