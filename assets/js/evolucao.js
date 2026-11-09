// Evolução: as 13 atividades à vista, em quatro fases. Texto e números vêm de window.DADOS (fonte em cada atividade).
(function () {
  const D = window.DADOS;
  const ICONES = {
    1: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    2: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    3: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    4: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    5: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    6: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
    7: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    8: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    9: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    10: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    11: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    12: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    13: '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>'
  };
  const FASES = [
    { nome: 'Definir o problema', de: 1, ate: 4, icone: ICONES[2] },
    { nome: 'Traduzir', de: 5, ate: 8, icone: ICONES[7] },
    { nome: 'Julgar', de: 9, ate: 11, icone: ICONES[9] },
    { nome: 'Mostrar', de: 12, ate: 13, icone: ICONES[4] }
  ];

  const svgIcone = p => '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';

  // negrito nos números do resultado (percentuais, valores em US$, contagens e "N de M")
  function negrito(txt) {
    const esc = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return esc.replace(/(US\$\s?)?\d[\d.]*(?:,\d+)?%?/g, (m, _u, pos, tudo) => {
      const simples = /^\d$/.test(m);
      const antes = tudo.slice(0, pos).match(/([A-Za-zÀ-ú]+)\s$/);
      if (simples && antes && /^[A-ZÀ-Ú]/.test(antes[1])) return m;
      if (simples && tudo[pos - 1] === '.') return m;
      return '<strong>' + m.replace(/\.$/, '') + '</strong>' + (m.endsWith('.') ? '.' : '');
    });
  }
  const simples = txt => txt.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function cartao(a) {
    let h = '<article class="ativ papel" aria-labelledby="ativ-' + a.n + '">' +
      '<div class="ativ-topo">' + svgIcone(ICONES[a.n]) + '<b>Atividade ' + a.n + '</b><span class="num">' + a.data + '</span></div>' +
      '<h4 id="ativ-' + a.n + '">' + a.titulo + '</h4>' +
      '<p><b>O que foi feito.</b> ' + negrito(a.feito) + '</p>';
    if (a.resultado) h += '<p><b>Resultado.</b> ' + negrito(a.resultado) + '</p>';
    if (a.rota) h += '<p class="decisao">Decisão: ' + simples(a.rota) + '</p>';
    h += '<p class="fonte">Fonte: ' + a.fonte + '</p></article>';
    return h;
  }

  const caixa = document.getElementById('atividades');
  if (caixa) {
    caixa.innerHTML = FASES.map(f => {
      const doGrupo = D.atividades.filter(a => a.n >= f.de && a.n <= f.ate);
      return '<section class="fase-grupo" aria-label="' + f.nome + '">' +
        '<h3 class="fase-cab">' + svgIcone(f.icone) + '<span>' + f.nome + '</span><small>A' + f.de + (f.ate > f.de ? ' a A' + f.ate : '') + '</small></h3>' +
        '<div class="ativs">' + doGrupo.map(cartao).join('') + '</div></section>';
    }).join('');
  }

  const ul = document.getElementById('proximos');
  if (ul) D.proximos.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
})();
