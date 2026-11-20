// A milonga do projeto: a letra (texto da página da disciplina) e o verso cantado em destaque enquanto o clipe toca.
// O tempo de cada verso vem da legenda do clipe (assets/video/milonga-da-buraqueira.vtt).
(function () {
  const LETRA = [
    ['Verso 1', ['Abri o guia de campo na prancha número um', 'A buraqueira no cupim não tem medo de nenhum',
      'Seis mil quinhentos e sessenta pedidos em inglês', 'Três tradutores na lida pra virar pro português']],
    ['Pré-refrão', ['O mesmo processo, em inglês e em português', 'O juiz decide igual, ou muda de uma vez?']],
    ['Refrão', ['Buraqueira, buraqueira, BuraqueiraBench, meu chão', 'Quatro corujas de guarda julgando a tradução',
      'Suindara, corujinha, caburé e mocho-diabo', 'Quem troca de idioma às vezes troca de lado']],
    ['Verso 2', ['A suindara é firme, quase não muda de opinião', 'A corujinha endurece e barra até quem tem razão',
      'O caburé afrouxa e deixa o nocivo passar', 'E o mocho-diabo vai conforme o tradutor mandar']],
    ['Pré-refrão', ['O mesmo processo, em inglês e em português', 'O juiz decide igual, ou muda de uma vez?']],
    ['Refrão', ['Buraqueira, buraqueira, BuraqueiraBench, meu chão', 'Quatro corujas de guarda julgando a tradução',
      'Suindara, corujinha, caburé e mocho-diabo', 'Quem troca de idioma às vezes troca de lado']],
    ['Ponte', ['Traduziu, recusou, executou o ataque', 'O DeepSeek fez de tudo, e eu anotei cada detalhe',
      'Rodei de novo e trezentos e cinquenta e um viraram', 'Qualquer resultado é resultado, as corujas me ensinaram']],
    ['Refrão', ['Buraqueira, buraqueira, BuraqueiraBench, meu chão', 'Quatro corujas de guarda julgando a tradução',
      'Suindara, corujinha, caburé e mocho-diabo', 'Quem troca de idioma às vezes troca de lado']],
    ['Final', ['Buraqueira, buraqueira, o juiz decide igual?', 'Buraqueira, buraqueira, cuida a nossa tradução']]
  ];
  const caixa = document.getElementById('letra');
  if (!caixa) return;
  let k = 0;
  caixa.innerHTML = LETRA.map(([parte, versos]) =>
    `<div class="estrofe${parte === 'Refrão' ? ' refrao' : ''}"><p class="parte">${parte}</p>${versos.map(v => `<p class="verso" data-k="${k++}">${v}</p>`).join('')}</div>`).join('');

  // o verso cantado em destaque: a n-ésima legenda do clipe é o n-ésimo verso da letra, conferido pelo texto
  const video = document.getElementById('clipe');
  const versos = Array.from(caixa.querySelectorAll('.verso'));
  const norm = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
  if (!video || !video.textTracks) return;
  function ligar(trilha) {
    trilha.mode = 'hidden';
    const mapa = new Map();
    trilha.addEventListener('cuechange', () => {
      const cues = trilha.cues ? Array.from(trilha.cues) : [];
      if (!mapa.size) {
        // casa cada legenda com o primeiro verso de mesmo texto que ainda não foi usado, na ordem
        let j = 0;
        cues.forEach((c, i) => {
          const t = norm(c.text.replace(/<[^>]+>/g, ' '));
          for (let x = j; x < versos.length; x++) if (norm(versos[x].textContent) === t) { mapa.set(i, x); j = x + 1; break; }
        });
      }
      versos.forEach(v => v.classList.remove('agora'));
      Array.from(trilha.activeCues || []).forEach(c => {
        const x = mapa.get(cues.indexOf(c));
        if (x === undefined) return;
        versos[x].classList.add('agora');
        // rola só a caixa da letra (nunca a página) para o verso cantado ficar à vista
        const alvo = versos[x].offsetTop - caixa.offsetTop - caixa.clientHeight / 3;
        caixa.scrollTo({ top: Math.max(0, alvo), behavior: 'smooth' });
      });
    });
  }
  const t0 = video.textTracks[0];
  if (t0) ligar(t0);
  else video.textTracks.addEventListener('addtrack', e => ligar(e.track), { once: true });
  video.addEventListener('ended', () => versos.forEach(v => v.classList.remove('agora')));
})();
