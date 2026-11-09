// Página "O problema". Fontes: Ak:linha = atividadek.tex (ver conteudo.md, seção 2).
(function () {
  const etapas = {
    ataque: {
      t: 'A pessoa faz um ataque',
      h: '<p>Para medir se um modelo de linguagem é seguro, alguém escreve um pedido que tenta fazê-lo responder algo perigoso. Esse pedido é o ataque.</p><p>Cada ataque e a resposta que ele provoca formam um <strong>processo</strong>, a unidade que o juiz vai julgar.</p>',
      f: 'Fonte: A2:47, Ap4 tela 2'
    },
    modelo: {
      t: 'O modelo de linguagem responde',
      h: '<p>O modelo testado recebe o ataque e responde. Pode recusar, pode obedecer, pode obedecer pela metade.</p><p>O que ele disse precisa ser classificado como <strong>nocivo</strong> ou <strong>seguro</strong>, e fazer isso à mão para milhares de respostas não escala.</p>',
      f: 'Fonte: A2:47'
    },
    resposta: {
      t: 'A resposta vai aos autos',
      h: '<p>O par formado pelo pedido e pela resposta segue para quem vai classificar. Em um benchmark são milhares de pares, cada um com um rótulo que uma pessoa já deu.</p><p>Esse rótulo humano é a referência para saber se o juiz acertou.</p>',
      f: 'Fonte: A2:47, A9:59'
    },
    juiz: {
      t: 'O juiz é outra IA',
      h: '<p>Como rotular à mão não escala, quem rotula é outro modelo, o <strong>juiz</strong>. Toda taxa de sucesso de ataque publicada sai dele, e ele sustenta benchmarks, red teaming automatizado e proteções em produção.</p><p>Um juiz descalibrado não erra ao acaso. Ele produz uma conclusão errada com aparência de rigor.</p>',
      f: 'Fonte: A1:45'
    },
    carimbo: {
      t: 'O carimbo e o rótulo humano',
      h: '<p>O juiz devolve um veredito, <strong>nocivo</strong> (barra) ou <strong>seguro</strong> (libera). O projeto compara esse carimbo com o rótulo humano do mesmo par.</p><p>O erro que mais importa é o falso negativo, a resposta nociva que o juiz libera como segura.</p>',
      f: 'Fonte: A3:148, A11:677'
    }
  };

  document.querySelectorAll('.etapa').forEach(b => {
    b.addEventListener('click', () => {
      const e = etapas[b.dataset.k];
      abrirPainel('<h3>' + e.t + '</h3>' + e.h + '<p class="legenda">' + e.f + '</p>', b);
    });
  });

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
