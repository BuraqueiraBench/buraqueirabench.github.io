"""Gera assets/js/dados-juizes.js: os doze juízes no ReliableBench, a parte da língua e a da reescrita, e o limiar
por língua, lidos dos JSONs de resultado do projeto.

Uso: /mnt/cache/venvs/xlsx/bin/python -I ferramentas/dados_juizes.py <quatro.json> <suaili.json> <novos.json> \
         <limiar.json> <controles.json>

Os cinco JSONs de resultado do projeto, nesta ordem: os quatro juízes originais em inglês e nas três traduções; os
quatro no suaíli; os oito juízes novos em todas as condições; o limiar por língua contra a mudança na AUROC; e os
controles do ruído. Todas as taxas são do ReliableBench (1.030 pares comuns às condições, 887 nocivos e 143 seguros). A parte da língua
é a métrica na língua menos a métrica na volta ao inglês; a da reescrita, a volta menos o inglês; o intervalo é de
95% por reamostragem de comportamentos. O limiar por língua é recalibrado com 100 pares rotulados da própria língua
para igualar a taxa de seguras barradas do inglês (média de repetições, em pontos de falso negativo contra o inglês).
"""
import json
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
SUB = 'reliablebench'
TRADS = ['nllb', 'opus', 'deepseek']

# id, nome, grupo, espécie, nome científico, imagem, quem fez e o que é
JUIZES = [
    ('lg3', 'Llama Guard 3', 'origem', 'suindara', 'Tyto furcata', 'suindara.jpg',
     'Meta. Modelo de moderação de 8 bilhões de parâmetros.'),
    ('harmbench', 'HarmBench', 'origem', 'corujinha-do-mato', 'Megascops choliba', 'corujinha.jpg',
     'Classificador do HarmBench, um Llama 2 de 13 bilhões de parâmetros. A regra dele exige texto em inglês.'),
    ('jailjudge', 'JailJudge', 'origem', 'caburé', 'Glaucidium brasilianum', 'cabure.jpg',
     'Dá uma nota de 1 a 10 ao ataque; a nota vira escore de 0 a 1.'),
    ('aegis', 'AegisGuard', 'origem', 'mocho-diabo', 'Asio stygius', 'mocho.jpg',
     'NVIDIA. LlamaGuard de 7 bilhões com o ajuste Aegis Permissive.'),
    ('polyguard', 'PolyGuard', 'novo', 'murucututu', 'Pulsatrix perspicillata', 'murucututu.jpg',
     'Treinado para moderar em 17 línguas, o português entre elas.'),
    ('qwen3guard', 'Qwen3Guard', 'novo', 'coruja-orelhuda', 'Asio clamator', 'orelhuda.jpg',
     'Qwen. Moderação em 119 línguas; aqui no modo estrito, em que o duvidoso conta como nocivo.'),
    ('nemotron', 'Nemotron Safety Guard', 'novo', 'coruja-do-mato', 'Strix virgata', 'coruja-do-mato.jpg',
     'NVIDIA. O sucessor multilíngue do AegisGuard.'),
    ('granite', 'Granite Guardian', 'novo', 'coruja-listrada', 'Strix hylophila', 'listrada.jpg',
     'IBM. Julga a resposta pelo critério de dano que vem com o modelo.'),
    ('jev', 'Jev', 'novo', 'jacurutu', 'Bubo virginianus', 'jacurutu.jpg',
     'TypeSafe, por API. Modelo de decisão: responde a uma pergunta com uma probabilidade calibrada.'),
    ('lev', 'Lev', 'novo', 'mocho-dos-banhados', 'Asio flammeus', 'mocho-dos-banhados.jpg',
     'Modelo de decisão aberto, de 4 bilhões de parâmetros, com a mesma pergunta do Jev.'),
    ('laya', 'Laya', 'novo', 'coruja-preta', 'Strix huhula', 'coruja-preta.jpg',
     'Convai. Modelo de decisão aberto, na versão multilíngue, com a mesma pergunta do Jev.'),
    ('llm-rubrica', 'Qwen3 com rubrica', 'novo', 'corujinha-do-sul', 'Megascops sanctaecatarinae', 'corujinha-do-sul.jpg',
     'Um LLM comum de 8 bilhões de parâmetros, que julga com a rubrica do HarmBench, sem a regra do inglês.'),
]


def taxa(r):
    return {'fnr': round(100 * r['FN'] / r['nocivos'], 1), 'fpr': round(100 * r['FP'] / r['seguros'], 1),
            'auroc': round(r['AUROC'], 3)}


def parte(e, escala):
    """[estimativa, início, fim do intervalo, o intervalo exclui zero]; taxas em pontos, AUROC em pontos de 0,01."""
    lo, hi = e['ic_cluster']
    return [round(e['est'] * escala, 1), round(lo * escala, 1), round(hi * escala, 1), bool(e['exclui_zero_cluster'])]


def partes(lingua, reescrita):
    return {k: {'lingua': parte(lingua[m], 100), 'reescrita': parte(reescrita[m], 100)}
            for k, m in (('fnr', 'FNR'), ('fpr', 'FPR'), ('auroc', 'AUROC'))}


def limiar(cal):
    c = cal['100']
    return {'antes': round(100 * c['lacuna_antes']['FNR'], 1), 'depois': round(100 * c['lacuna_depois']['fpr_en']['FNR'], 1),
            'fprAntes': round(100 * c['lacuna_antes']['FPR'], 1), 'fprDepois': round(100 * c['lacuna_depois']['fpr_en']['FPR'], 1)}


def main():
    if len(sys.argv) != 6:
        sys.exit(__doc__)
    A, X, M, T, C = (json.load(open(Path(a), encoding='utf-8')) for a in sys.argv[1:6])

    saida = []
    for jid, nome, grupo, especie, cientifico, img, sobre in JUIZES:
        d = {'id': jid, 'nome': nome, 'grupo': grupo, 'especie': especie, 'cientifico': cientifico,
             'img': 'assets/img/guia/' + img, 'sobre': sobre, 'taxas': {}, 'partes': {}, 'limiar': {}}
        if grupo == 'origem':
            met = A['metricas'][SUB][jid]
            for c in ['en'] + TRADS:
                d['taxas'][c] = taxa(met[c])
            d['taxas']['swh'] = taxa(X['metricas'][SUB][jid]['swh'])
            for c in TRADS:
                dd = A['decomposicao'][SUB][jid][c]['deslocamentos']
                d['partes'][c] = partes(dd['pt_menos_back'], dd['shift_back'])
                d['limiar'][c] = limiar(A['calibracao'][SUB][jid][c])
            ds = X['suaili'][SUB][jid]['deslocamentos']
            d['partes']['swh'] = partes(ds['swh_menos_back'], ds['shift_back'])
            d['limiar']['swh'] = limiar(X['calibracao'][SUB][jid]['swh'])
        else:
            met = M['metricas'][SUB][jid]
            for c in ['en'] + TRADS + ['swh']:
                d['taxas'][c] = taxa(met[c])
            for c in TRADS + ['swh']:
                pa = M['partes'][SUB][jid][c]
                d['partes'][c] = partes(pa['lingua'], pa['reescrita'])
                d['limiar'][c] = limiar(M['calibracao'][SUB][jid][c])
        n = met['en']
        assert (n['n'], n['nocivos'], n['seguros']) == (1030, 887, 143), (jid, n['n'], n['nocivos'], n['seguros'])
        saida.append(d)

    # limiar por língua contra a mudança na AUROC, nos 36 casos em português (12 juízes x 3 tradutores)
    nomes = {d['id']: d['nome'] for d in saida}
    pontos = [{'j': p['juiz'], 'cond': p['cond'], 'dauroc': round(p['dauroc'], 1), 'antes': round(p['antes'], 1),
               'depois': round(p['depois'], 1)} for p in T['pontos'] if p['cond'] in TRADS]
    assert len(pontos) == T['n_portugues'] == 36, len(pontos)
    assert all(p['j'] in nomes for p in pontos), {p['j'] for p in pontos} - set(nomes)
    limiar_geral = {'mantem': T['mantem'], 'cai': T['cai'], 'spearman': round(T['spearman_dauroc_lacuna_depois'], 2),
                    'pontos': pontos}

    # o comitê dos quatro (média dos escores), com o limiar por língua
    comite = {c: limiar((X if c == 'swh' else A)['calibracao'][SUB]['comite_media'][c]) for c in TRADS + ['swh']}

    # controles do ruído: a paráfrase em inglês contra a tradução (Jev, nos pares que todas as condições têm) e o
    # JailJudge rodado cinco vezes nos mesmos pares
    cj = C['juizes']['jev']
    tr = C['jailjudge_rodadas']['trocas_entre_duas_execucoes']['en']
    controles = {'jev': {'pares': cj['pares'], 'parafrase': cj['trocas']['en~en-para'], 'traducao': cj['trocas']['en~deepseek'],
                         'volta': cj['trocas']['en~deepseek-volta'], 'segunda': cj['trocas']['deepseek~deepseek-2']},
                 'jailjudge': {'rodadas': len(C['jailjudge_rodadas']['execucoes']), 'pares': C['jailjudge_rodadas']['pares'],
                               'mudaEmAlguma': C['jailjudge_rodadas']['muda_em_alguma']['en'], 'entreDuas': [min(tr), max(tr)]}}

    # frase de cada espécie, com os números do próprio dado; cada afirmação é conferida aqui
    por = {d['id']: d for d in saida}
    f1 = lambda v: f'{v:.1f}'.replace('.', ',')
    f3 = lambda v: f'{v:.3f}'.replace('.', ',')
    t = lambda j, c, m: por[j]['taxas'][c][m]
    lingua_cai = lambda j, c: por[j]['partes'][c]['auroc']['lingua'][3] and por[j]['partes'][c]['auroc']['lingua'][0] < 0
    melhor = max(saida, key=lambda d: d['taxas']['en']['auroc'])
    pior = min(saida, key=lambda d: d['taxas']['en']['auroc'])
    assert melhor['id'] == 'jev' and pior['id'] == 'laya'
    assert not any(lingua_cai('jev', c) for c in TRADS) and not any(lingua_cai('lg3', c) for c in TRADS)
    assert lingua_cai('nemotron', 'nllb') and lingua_cai('nemotron', 'deepseek')
    assert lingua_cai('lev', 'opus') and lingua_cai('lev', 'deepseek')
    for j in ('qwen3guard', 'granite', 'polyguard'):
        assert not any(lingua_cai(j, c) for c in TRADS), j
    assert t('harmbench', 'nllb', 'fpr') > t('harmbench', 'en', 'fpr') and t('jailjudge', 'nllb', 'fnr') > t('jailjudge', 'en', 'fnr')
    comp = {
        'lg3': f"Já em inglês barra {f1(t('lg3', 'en', 'fpr'))}% das seguras. Em português quase não muda.",
        'harmbench': f"Em português fica mais rígido: barra {f1(t('harmbench', 'nllb', 'fpr'))}% das seguras com o NLLB-200, contra {f1(t('harmbench', 'en', 'fpr'))}% em inglês.",
        'jailjudge': f"Em português passa a liberar mais nocivas: {f1(t('jailjudge', 'nllb', 'fnr'))}% com o NLLB-200, contra {f1(t('jailjudge', 'en', 'fnr'))}% em inglês.",
        'aegis': 'Depende do tradutor: com dois libera menos nocivas, com o DeepSeek libera mais.',
        'polyguard': f"Barra {f1(t('polyguard', 'en', 'fpr'))}% das seguras já em inglês, até uma recusa clara.",
        'qwen3guard': f"Barra {f1(t('qwen3guard', 'en', 'fpr'))}% das seguras já em inglês. Em português ordena como em inglês.",
        'nemotron': 'Em português perde um pouco da capacidade de separar nocivas de seguras, com o NLLB-200 e o DeepSeek.',
        'granite': f"Barra {f1(t('granite', 'en', 'fpr'))}% das seguras já em inglês. Em português ordena como em inglês.",
        'jev': f"O que melhor separa nocivas de seguras em inglês (AUROC {f3(t('jev', 'en', 'auroc'))}), e continua assim em português.",
        'lev': f"Rígido em inglês (barra {f1(t('lev', 'en', 'fpr'))}% das seguras) e perde a ordenação em português com o Opus-MT e o DeepSeek.",
        'laya': f"Ordena quase ao acaso já em inglês (AUROC {f3(t('laya', 'en', 'auroc'))}).",
        'llm-rubrica': f"Em português a AUROC cai de {f3(t('llm-rubrica', 'en', 'auroc'))} para {f3(t('llm-rubrica', 'nllb', 'auroc'))} com o NLLB-200, pela reescrita e não pela língua.",
    }
    # o texto da Atividade 16 em dados.js diz "em 29 de 36 casos a língua sozinha não muda" a AUROC
    inclui_zero = sum(not d['partes'][c]['auroc']['lingua'][3] for d in saida for c in TRADS)
    assert inclui_zero == 29, f'{inclui_zero} de 36: atualize o texto da Atividade 16 em dados.js'
    pa = por['llm-rubrica']['partes']['nllb']['auroc']
    assert not pa['lingua'][3] and pa['reescrita'][0] < 0, pa
    assert t('aegis', 'nllb', 'fnr') < t('aegis', 'en', 'fnr') and t('aegis', 'opus', 'fnr') < t('aegis', 'en', 'fnr') \
        and t('aegis', 'deepseek', 'fnr') > t('aegis', 'en', 'fnr')
    for d in saida:
        d['comp'] = comp[d['id']]

    js = ('// Gerado por ferramentas/dados_juizes.py a partir dos JSONs de resultado do projeto. Não editar à mão.\n'
          '// Taxas em %, no ReliableBench (1.030 pares: 887 nocivos e 143 seguros). Partes e limiar em pontos;\n'
          '// cada parte é [estimativa, início e fim do intervalo de 95% por comportamento, o intervalo exclui zero].\n'
          'window.JUIZES = ' + json.dumps(saida, ensure_ascii=False, indent=1) + ';\n'
          'window.LIMIAR = ' + json.dumps(limiar_geral, ensure_ascii=False, indent=1) + ';\n'
          'window.COMITE = ' + json.dumps(comite, ensure_ascii=False) + ';\n'
          'window.CONTROLES = ' + json.dumps(controles, ensure_ascii=False) + ';\n')
    destino = SITE / 'assets' / 'js' / 'dados-juizes.js'
    destino.write_text(js, encoding='utf-8')

    print(f'{destino}')
    print(f"{'juiz':22} {'FN en':>6} {'FP en':>6} {'AUC en':>6} | {'FN nllb':>7} {'FP nllb':>7} {'AUC nllb':>8} | "
          f"{'lingAUC nllb':>14} {'lingAUC opus':>14} {'lingAUC ds':>14} {'lingAUC swh':>14} | lim nllb")
    for d in saida:
        t, p = d['taxas'], d['partes']
        la = lambda c: f"{p[c]['auroc']['lingua'][0]:+.1f}{'*' if p[c]['auroc']['lingua'][3] else ' '}"
        print(f"{d['nome']:22} {t['en']['fnr']:6.1f} {t['en']['fpr']:6.1f} {t['en']['auroc']:6.3f} | {t['nllb']['fnr']:7.1f} "
              f"{t['nllb']['fpr']:7.1f} {t['nllb']['auroc']:8.3f} | {la('nllb'):>14} {la('opus'):>14} {la('deepseek'):>14} "
              f"{la('swh'):>14} | {d['limiar']['nllb']['antes']:+.1f} -> {d['limiar']['nllb']['depois']:+.1f}")


if __name__ == '__main__':
    main()
