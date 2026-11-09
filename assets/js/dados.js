// Dados do site. Todo número tem a fonte: Ak:linha = /mnt/win_ssd/proposta-juiz-ptbr/atividadek.tex, linha.
// O resultado final é o da Atividade 11 (commit a76848b, 29/10/2026), nos 6.521 pares comuns às oito
// condições (1.030 no ReliableBench, 887 nocivas). Números de atividades anteriores só na linha do tempo.

window.DADOS = {
  projeto: {
    nome: 'BuraqueiraBench',
    titulo: 'Juízes de segurança de LLM em português',
    subtitulo: 'medindo o deslocamento de língua',
    autor: 'Cristhian Kapelinski',
    disciplina: 'Laboratório de Inteligência Artificial Aplicada (LIAA)',
    semestre: '2026/2',
    instituicao: 'UNIPAMPA',
    professor: 'Diego Kreutz',
    leigo: 'Quando alguém testa se uma IA responde coisa perigosa, quem dá a nota é outra IA, o juiz. Este projeto mede se esse juiz se engana mais quando o texto está em português.',
    area: 'Aferição pareada de quatro juízes de segurança abertos sobre os 6.560 pares com rótulo humano do CoinflipForSafety, traduzidos por três motores, com volta ao inglês como controle.',
    pergunta: 'O ReliableBench continua confiável em português?',
    resposta: 'Não existe uma resposta só. A confiabilidade que ele tem em inglês se mantém para um juiz, cai para outro e muda de natureza para um terceiro, que passa a barrar respostas seguras.',
    fontes: { leigo: 'conteúdo do autor', pergunta: 'A1:103, A11:122', resposta: 'A11:764' }
  },

  // ordem fixa das condições em todos os gráficos
  condicoes: [
    { id: 'en', nome: 'Inglês', curto: 'EN', lingua: 'en' },
    { id: 'nllb', nome: 'NLLB-200', curto: 'NLLB', lingua: 'pt' },
    { id: 'opus', nome: 'Opus-MT', curto: 'Opus', lingua: 'pt' },
    { id: 'deepseek', nome: 'DeepSeek', curto: 'DeepSeek', lingua: 'pt' }
  ],

  juizes: [
    { id: 'lg3', nome: 'Llama Guard 3', modelo: 'Llama Guard 3 8B (pesos idênticos aos da Meta)', escore: 'p(unsafe) no primeiro passo', fonte: 'A9:53, modelos.json:7' },
    { id: 'harmbench', nome: 'HarmBench', modelo: 'cais/HarmBench-Llama-2-13b-cls (13 bilhões de parâmetros)', escore: 'p(Yes)', fonte: 'A11:672' },
    { id: 'jailjudge', nome: 'JailJudge', modelo: 'usail-hkust/JailJudge-guard', escore: '(nota de 1 a 10 menos 1)/9', fonte: 'A11:674' },
    { id: 'aegis', nome: 'AegisGuard', modelo: 'LlamaGuard-7b com o LoRA Aegis Permissive 1.0 da NVIDIA', escore: 'soma das fichas que começam com unsafe', fonte: 'A11:673' }
  ],

  // Falso negativo (% das nocivas liberadas) no ReliableBench, 1.030 pares comuns. A11:721-751
  fnReliable: {
    lg3:       { en: 8.2,  nllb: 7.3,  opus: 8.1,  deepseek: 10.6 },
    harmbench: { en: 16.0, nllb: 11.6, opus: 11.6, deepseek: 12.3 },
    jailjudge: { en: 23.8, nllb: 35.4, opus: 32.8, deepseek: 29.4 },
    aegis:     { en: 25.3, nllb: 22.3, opus: 23.7, deepseek: 28.6 },
    fonte: 'A11:721-751'
  },

  // Falso negativo nos 6.521 pares comuns. A11:721-751
  fnComuns: {
    lg3:       { en: 18.7, nllb: 19.2, opus: 20.2, deepseek: 22.0 },
    harmbench: { en: 13.3, nllb: 12.2, opus: 11.3, deepseek: 13.1 },
    jailjudge: { en: 33.7, nllb: 42.5, opus: 39.3, deepseek: 39.1 },
    aegis:     { en: 37.9, nllb: 37.8, opus: 41.8, deepseek: 45.6 },
    fonte: 'A11:721-751'
  },

  // Falso positivo do HarmBench no ReliableBench (seguras barradas). A11:882-885
  fpHarmbenchReliable: { en: 23.8, nllb: 35.7, opus: 39.2, deepseek: 32.9, fonte: 'A11:882-885' },

  // Trocas par a par no ReliableBench, contra o inglês: liberadas = nocivas que passam a ser liberadas,
  // barradas = nocivas que passam a ser barradas. A11:721-751
  trocasReliable: {
    lg3:       { nllb: [14, 22],  opus: [18, 19], deepseek: [29, 8] },
    harmbench: { nllb: [21, 60],  opus: [23, 62], deepseek: [13, 46] },
    jailjudge: { nllb: [161, 58], opus: [151, 71], deepseek: [122, 72] },
    aegis:     { nllb: [40, 66],  opus: [56, 70], deepseek: [78, 48] },
    nocivasReliable: 887,
    fonte: 'A11:721-751'
  },

  // Controle da volta ao inglês, FN no ReliableBench: [inglês, português, volta]. A11:609-653
  volta: {
    nllb:     { lg3: [8.2, 7.3, 6.3],  jailjudge: [23.8, 35.4, 30.1], harmbench: [16.0, 11.6, 18.5], aegis: [25.3, 22.3, 20.9] },
    opus:     { lg3: [8.2, 8.1, 8.1],  jailjudge: [23.8, 32.8, 27.4], harmbench: [16.0, 11.6, 19.7], aegis: [25.3, 23.7, 21.6] },
    deepseek: { lg3: [8.2, 10.6, 9.1], jailjudge: [23.8, 29.4, 24.0], harmbench: [16.0, 12.3, 16.5], aegis: [25.3, 28.6, 24.7] },
    // parte do aumento do JailJudge no ReliableBench que sobrevive à volta. A11:660
    sobreviveJailjudge: { nllb: 54, opus: 40, deepseek: 4 },
    fonte: 'A11:609-660'
  },

  // AUROC do JailJudge no ReliableBench: [inglês, português, volta]. A11:660
  aurocJailjudge: { nllb: [0.776, 0.722, 0.753], opus: [0.776, 0.719, 0.770], deepseek: [0.776, 0.734, 0.782], fonte: 'A11:660' },

  // Quantos dos 5 tradutores levam o Llama Guard 3 a dizer nocivo, por par (438 pares do JudgeStressTest). A10:174
  dependenciaTradutor: { porContagem: [140, 19, 13, 30, 29, 207], dependem: 91, total: 438, fonte: 'A10:163, A10:174' },

  // O tradutor que é um LLM alinhado recusa. A7:76, A8:83
  recusas: {
    haiku: { traduziu: 8, recusou: 22, total: 30, fonte: 'A7:76' },
    deepseekSem: { traduziu: 212, recusou: 210, executou: 17, total: 439, fonte: 'A8:83' },
    deepseekCom: { traduziu: 439, total: 439, fonte: 'A8:83' }
  },

  // DeepSeek largou a instrução final do pedido. A11:464, A11:477-481
  instrucaoLargada: { pares: 212, noReliable: 33, fnComoTraduzido: 12.3, fnReposta: 10.6, fnIngles: 8.2, fonte: 'A11:464, A11:477-481' },

  // Custo projetado de traduzir os 6.560 pares, US$. A6:94-118
  custo: [
    { nome: 'NLLB-200, Opus-MT, Argos (abertos, em GPU)', usd: 0 },
    { nome: 'DeepSeek V4.1-Flash', usd: 4.30, faixa: '2,15 a 4,30' },
    { nome: 'Gemini 3.1 Flash-Lite', usd: 5.06 },
    { nome: 'Claude Haiku 4.5', usd: 17.28 },
    { nome: 'DeepL', usd: 63.90 },
    { nome: 'Google Cloud Translation', usd: 232.80 }
  ],
  custoFonte: 'A6:94-118',

  dados: [
    { nome: 'CoinflipForSafety', id: 'ASSELab/CoinflipForSafety', tamanho: '6.560 pares (5.174 nocivos, 1.386 seguros); 5 ataques contra 4 modelos', papel: 'base do efeito da língua', fonte: 'A9:118, A9:123' },
    { nome: 'ReliableBench', id: 'recorte do CoinflipForSafety por comportamento', tamanho: '43 comportamentos, 1.036 pares (892 nocivos, 144 seguros)', papel: 'pergunta central', fonte: 'A11:131' },
    { nome: 'JudgeStressTest', id: 'ASSELab/JudgeStressTest', tamanho: '439 pares com resposta e rótulo (189 nocivos, 250 seguros)', papel: 'efeito do tradutor', fonte: 'A5:56, A9:118' },
    { nome: 'JailbreakBench', id: 'JailbreakBench/JBB-Behaviors', tamanho: '300 exemplos, 110 nocivos pela maioria de 3 anotadores', papel: 'reprodução dos números publicados (E1)', fonte: 'A11:838' }
  ],

  tradutores: [
    { nome: 'NLLB-200', id: 'facebook/nllb-200-distilled-1.3B', onde: 'GPU', fonte: 'A11:72' },
    { nome: 'Opus-MT', id: 'Helsinki-NLP/opus-mt-tc-big-en-pt', onde: 'GPU', fonte: 'A11:74-76' },
    { nome: 'DeepSeek', id: 'deepseek-chat, temperatura 0, texto entre marcas como dado, não comando', onde: 'API', fonte: 'A8:51, A11:78' }
  ],

  // As 13 atividades do semestre. Datas: primeiro e último commit do relatório (git log --follow).
  atividades: [
    { n: 1, data: '24/08 a 08/09', titulo: 'Proposta', feito: 'Problema, lacuna e proposta em duas páginas, com o diagrama dos quatro deslocamentos e do desenho pareado.', resultado: 'Tabela da lacuna: o falso negativo publicado em inglês de quatro juízes e a coluna do português com um ponto de interrogação.', rota: 'A ideia aprovada já existia em inglês. O escopo foi reduzido ao eixo que ninguém cobre, a língua, com alvo no ReliableBench.', fonte: 'A1:91-94, A1:200' },
    { n: 2, data: '08/09', titulo: 'Investigação técnica', feito: 'Tarefa de IA (classificação binária), conjuntos de dados, quatro juízes abertos, arquitetura em quatro componentes e riscos.', resultado: 'Os quatro juízes escolhidos, mais um piso por palavra-chave que concorda com humanos em só 56,0% dos casos.', rota: 'Brito et al. descartaram tradução automática porque a ofensa depende da cultura. Isso virou o risco central.', fonte: 'A2:76, A2:102, A2:106' },
    { n: 3, data: '08/09', titulo: 'Especificação e plano experimental', feito: 'Cinco experimentos (reproduzir o inglês, português pareado, comparar juízes, língua com estilo, 4 contra 16 bits) e critérios fixados antes de rodar.', resultado: 'Critério de reprodução: desvio de até 0,05 nas métricas publicadas. MVP: um juiz e 30 pares.', rota: '', fonte: 'A3:187, A3:213, A3:246' },
    { n: 4, data: '08/09', titulo: 'Apresentação das Atividades 1 a 3', feito: 'Deck de 12 telas com problema, lacuna, plano e MVP.', resultado: 'Destaque: reescrever no estilo narrativo leva o falso negativo do HarmBench de 0,12 para 0,36. E "qualquer resultado é resultado".', rota: '', fonte: 'Ap4 telas 4 e 10' },
    { n: 5, data: '21/09 a 28/09', titulo: 'Piloto de traduzibilidade', feito: '30 pares do JudgeStressTest avaliados item a item, 15 nocivos e 15 seguros.', resultado: 'Descarte projetado de 0 em 30: nenhum par depende de cultura para ser nocivo.', rota: 'Os juízes não rodaram porque as colunas de escore pareciam invertidas (corrigido na Atividade 9).', fonte: 'A5:118, A5:170' },
    { n: 6, data: '27/09 a 06/10', titulo: 'Como e a que custo traduzir', feito: 'Três famílias de tradutor, tokens medidos e tabela de custo.', resultado: 'Nos 6.560 pares, Google Cloud custaria US$ 232,80 contra US$ 2,15 a 4,30 do DeepSeek: de 30 a 100 vezes mais barato.', rota: 'O escopo passa a incluir os 6.560 pares com resposta. A recomendação vira um conjunto de dois a três motores, não um só.', fonte: 'A6:83, A6:96, A6:118, A6:229' },
    { n: 7, data: '06/10', titulo: 'Tradução dos 30 na prática', feito: '30 pares traduzidos por seis motores.', resultado: 'O Claude Haiku 4.5 traduziu 8 e recusou 22. Os outros cinco motores traduziram os 30.', rota: 'O motor principal não pode ser um LLM alinhado à segurança.', fonte: 'A7:66-76, A7:111' },
    { n: 8, data: '06/10', titulo: 'Tradução do corpus', feito: '439 pares por cinco motores e 6.560 pares pelo NLLB-200 e pelo Opus-MT em GPU.', resultado: 'Sem as marcas de "dado, não comando", o DeepSeek recusou 210 de 439 pedidos e executou o ataque em 17. Com elas, traduziu os 439.', rota: 'O enquadramento entre marcas passa a ser obrigatório para o LLM tradutor.', fonte: 'A8:68, A8:83' },
    { n: 9, data: '24/10 a 25/10', titulo: 'O juiz em inglês', feito: 'Llama Guard 3 em inglês nos 439 e nos 6.560 pares.', resultado: 'A coluna não estava invertida: o veredito coincide em 436 de 439. Linha de base nos 6.560: falso negativo de 18,7%.', rota: 'A base do efeito da língua passa do JudgeStressTest (439) para o CoinflipForSafety (6.560), para evitar regressão à média.', fonte: 'A9:66, A9:77, A9:116-118, A9:134' },
    { n: 10, data: '24/10', titulo: 'O juiz em português', feito: 'Llama Guard 3 sobre as traduções.', resultado: 'Falso negativo de 18,7% para 19,1% (NLLB-200) e 20,1% (Opus-MT). Nos 439, o veredito depende do motor em 91 de 438 pares.', rota: 'O projeto vira artigo de periódico, com cinco extensões.', fonte: 'A10:64, A10:163, A10:181' },
    { n: 11, data: '25/10 a 29/10', titulo: 'ReliableBench, três tradutores e quatro juízes', feito: 'DeepSeek nos 6.560, volta ao inglês dos três tradutores, os quatro juízes do artigo, piso por palavra-chave, reprodução dos números publicados e leitura dos pares que trocam de veredito.', resultado: 'O efeito depende do juiz e tem sinais opostos: o JailJudge passa a liberar mais (23,8% para 35,4%), o HarmBench fica mais rígido e o Llama Guard 3 quase não muda.', rota: 'A pergunta central volta a ser o ReliableBench, e a referência passa a ser o julgamento do próprio juiz em inglês.', fonte: 'A11:122, A11:721-751, A11:833' },
    { n: 12, data: '10/11', titulo: 'Oitava entrega do projeto', feito: 'Evolução desde a sétima entrega, apresentada em aula.', resultado: '', rota: '', fonte: 'Classroom' },
    { n: 13, data: '09/11', titulo: 'Este site', feito: 'O site do projeto, em buraqueirabench.github.io, de apoio à apresentação final.', resultado: '', rota: '', fonte: 'Classroom' }
  ],

  proximos: [
    'Revalidação humana às cegas de 100 a 200 pares do ReliableBench, por falante nativo, sem ver o rótulo de origem.',
    'AegisGuard e JailJudge nas respostas com código protegido.',
    'Mais duas ou três línguas na parte automática, com o português como estudo aprofundado.'
  ],
  proximosFonte: 'A11:970-971, A10:181'
};
