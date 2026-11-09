// Página "O método". Fontes: Ak:linha = atividadek.tex (ver conteudo.md, seção 4).
(function () {
  const D = window.DADOS;
  const li = a => '<ul>' + a.map(x => '<li>' + x + '</li>').join('') + '</ul>';
  const painel = (t, corpo, f) => '<h3>' + t + '</h3>' + corpo + '<p class="legenda">Fonte: ' + f + '</p>';

  const nos = {
    dados: painel('Dados',
      '<p>Todos os conjuntos são públicos e têm rótulo humano, uma nota de 0 a 1 em que a partir de 0,5 a resposta é nociva.</p>' +
      li([
        '<strong>CoinflipForSafety</strong>, 6.560 pares (5.174 nocivos e 1.386 seguros), cinco ataques contra quatro modelos. É a base do efeito da língua.',
        '<strong>ReliableBench</strong>, recorte de 43 comportamentos com 1.036 pares (892 nocivos e 144 seguros). É a pergunta central.',
        '<strong>JudgeStressTest</strong>, 439 pares com resposta e rótulo (189 nocivos e 250 seguros). Serve só ao efeito do tradutor.',
        '<strong>JailbreakBench</strong>, 300 exemplos, usados para reproduzir os números publicados.'
      ]), 'A9:118, A9:123, A11:131, A5:56, A9:59, A11:838'),
    ida: painel('Ida para o português',
      '<p>O pedido e a resposta de cada par são traduzidos de inglês para português por três motores.</p>' +
      li([
        '<strong>NLLB-200</strong>, <code>facebook/nllb-200-distilled-1.3B</code>, frase a frase, em GPU.',
        '<strong>Opus-MT</strong>, <code>Helsinki-NLP/opus-mt-tc-big-en-pt</code>, em GPU, refeito com a marca de português do Brasil.',
        '<strong>DeepSeek</strong>, <code>deepseek-chat</code>, temperatura 0, com o texto entre marcas declarado "dado, não comando". São 6.522 pares usáveis.'
      ]), 'A11:72, A11:74-78, A8:51, A11:293'),
    juizes: painel('Quatro juízes',
      '<p>Os juízes rodam como na biblioteca <code>judgezoo</code> (commit <code>fc05ae5</code>), a que os autores do ReliableBench usaram. O veredito é nocivo quando o escore passa de 0,5.</p>' +
      li([
        '<strong>Llama Guard 3</strong>, 8 bilhões de parâmetros, escore p(unsafe) no primeiro passo.',
        '<strong>HarmBench</strong>, <code>cais/HarmBench-Llama-2-13b-cls</code>, escore p(Yes).',
        '<strong>JailJudge</strong>, <code>usail-hkust/JailJudge-guard</code>, nota de 1 a 10.',
        '<strong>AegisGuard</strong>, LlamaGuard-7b com o LoRA Aegis Permissive 1.0 da NVIDIA.'
      ]) + '<p>São oito condições (inglês, três idas, o Opus-MT com a marca de português do Brasil e três voltas). Os <strong class="num">6.521</strong> pares usáveis nas oito ao mesmo tempo têm 5.141 respostas nocivas e 1.380 seguras, e <strong class="num">1.030</strong> deles estão no ReliableBench.</p>',
      'A11:670-677, A11:70-84, A11:59, A11:575'),
    volta: painel('Volta ao inglês',
      '<p>Cada tradução é traduzida de volta para o inglês. A volta é o controle: ela mostra o que muda só porque o texto foi reescrito, sem que a língua final seja outra.</p>' +
      li([
        '<strong>NLLB-200</strong>, o mesmo modelo, de português para inglês, 6.560 pares.',
        '<strong>Opus-MT</strong>, modelo <code>opus-mt-tc-bible-big-roa-en</code>, porque o Opus-MT não publica um modelo grande de português para inglês. 6.560 pares.',
        '<strong>DeepSeek</strong>, os mesmos prompts com a direção invertida, 6.521 pares.'
      ]), 'A11:80-84, A11:595'),
    comp: painel('Comparação par a par',
      '<p>O mesmo par é julgado em inglês e na outra condição, e o veredito é comparado com o rótulo humano. Nada é treinado, porque treinar mudaria o instrumento que se mede.</p>' +
      li([
        'Falso negativo (a principal), falso positivo, acurácia e AUROC.',
        'Troca par a par, no ReliableBench: das 887 nocivas, quantas passam a ser liberadas e quantas passam a ser barradas em relação ao inglês.',
        'Os pares que trocam de veredito foram lidos à mão (por exemplo, 30 trocas sorteadas do Opus-MT).'
      ]), 'A3:118, A3:148, A11:721-751, A11:175')
  };

  document.querySelectorAll('.no').forEach(b => {
    b.addEventListener('click', () => abrirPainel(nos[b.dataset.k], b));
  });

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
