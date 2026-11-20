// Gerado por ferramentas/dados_juizes.py a partir dos JSONs de resultado do projeto. Não editar à mão.
// Taxas em %, no ReliableBench (1.030 pares: 887 nocivos e 143 seguros). Partes e limiar em pontos;
// cada parte é [estimativa, início e fim do intervalo de 95% por comportamento, o intervalo exclui zero].
window.JUIZES = [
 {
  "id": "lg3",
  "nome": "Llama Guard 3",
  "grupo": "origem",
  "especie": "suindara",
  "cientifico": "Tyto furcata",
  "img": "assets/img/guia/suindara.jpg",
  "sobre": "Meta. Modelo de moderação de 8 bilhões de parâmetros.",
  "taxas": {
   "en": {
    "fnr": 8.2,
    "fpr": 64.3,
    "auroc": 0.722
   },
   "nllb": {
    "fnr": 7.3,
    "fpr": 53.8,
    "auroc": 0.743
   },
   "opus": {
    "fnr": 8.1,
    "fpr": 62.2,
    "auroc": 0.721
   },
   "deepseek": {
    "fnr": 10.6,
    "fpr": 52.4,
    "auroc": 0.733
   },
   "swh": {
    "fnr": 28.6,
    "fpr": 37.1,
    "auroc": 0.728
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      1.0,
      -0.1,
      2.2,
      false
     ],
     "reescrita": [
      -1.9,
      -4.0,
      -0.2,
      true
     ]
    },
    "fpr": {
     "lingua": [
      -14.0,
      -24.5,
      -3.5,
      true
     ],
     "reescrita": [
      3.5,
      -5.8,
      12.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      1.2,
      -2.5,
      5.2,
      false
     ],
     "reescrita": [
      0.9,
      -2.3,
      4.2,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      0.0,
      -4.3,
      3.0,
      false
     ],
     "reescrita": [
      -0.1,
      -3.1,
      4.0,
      false
     ]
    },
    "fpr": {
     "lingua": [
      3.5,
      -5.6,
      12.7,
      false
     ],
     "reescrita": [
      -5.6,
      -17.0,
      3.9,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.3,
      -3.0,
      3.5,
      false
     ],
     "reescrita": [
      -0.4,
      -2.6,
      1.7,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      1.5,
      -0.8,
      3.8,
      false
     ],
     "reescrita": [
      0.9,
      0.0,
      1.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -7.0,
      -14.3,
      0.0,
      false
     ],
     "reescrita": [
      -4.9,
      -8.6,
      -1.7,
      true
     ]
    },
    "auroc": {
     "lingua": [
      1.3,
      -1.2,
      3.6,
      false
     ],
     "reescrita": [
      -0.2,
      -2.0,
      1.3,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      22.2,
      15.1,
      29.4,
      true
     ],
     "reescrita": [
      -1.8,
      -3.7,
      -0.2,
      true
     ]
    },
    "fpr": {
     "lingua": [
      -34.3,
      -43.8,
      -25.3,
      true
     ],
     "reescrita": [
      7.0,
      -3.5,
      18.8,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -1.0,
      -6.1,
      4.2,
      false
     ],
     "reescrita": [
      1.6,
      -2.1,
      6.9,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -0.9,
    "depois": -3.3,
    "fprAntes": -10.5,
    "fprDepois": -1.9
   },
   "opus": {
    "antes": -0.1,
    "depois": -0.4,
    "fprAntes": -2.1,
    "fprDepois": -0.5
   },
   "deepseek": {
    "antes": 2.4,
    "depois": -0.2,
    "fprAntes": -11.9,
    "fprDepois": -3.5
   },
   "swh": {
    "antes": 20.4,
    "depois": 4.5,
    "fprAntes": -27.3,
    "fprDepois": -2.0
   }
  },
  "comp": "Já em inglês barra 64,3% das seguras. Em português quase não muda."
 },
 {
  "id": "harmbench",
  "nome": "HarmBench",
  "grupo": "origem",
  "especie": "corujinha-do-mato",
  "cientifico": "Megascops choliba",
  "img": "assets/img/guia/corujinha.jpg",
  "sobre": "Classificador do HarmBench, um Llama 2 de 13 bilhões de parâmetros. A regra dele exige texto em inglês.",
  "taxas": {
   "en": {
    "fnr": 16.0,
    "fpr": 23.8,
    "auroc": 0.869
   },
   "nllb": {
    "fnr": 11.6,
    "fpr": 35.7,
    "auroc": 0.86
   },
   "opus": {
    "fnr": 11.6,
    "fpr": 39.2,
    "auroc": 0.865
   },
   "deepseek": {
    "fnr": 12.3,
    "fpr": 32.9,
    "auroc": 0.864
   },
   "swh": {
    "fnr": 55.6,
    "fpr": 19.6,
    "auroc": 0.697
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      -6.9,
      -9.8,
      -4.1,
      true
     ],
     "reescrita": [
      2.5,
      -0.2,
      5.4,
      false
     ]
    },
    "fpr": {
     "lingua": [
      6.3,
      0.0,
      12.9,
      false
     ],
     "reescrita": [
      5.6,
      -0.8,
      11.9,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.9,
      -2.0,
      3.8,
      false
     ],
     "reescrita": [
      -1.8,
      -4.3,
      0.5,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -8.1,
      -11.8,
      -4.6,
      true
     ],
     "reescrita": [
      3.7,
      0.3,
      7.7,
      true
     ]
    },
    "fpr": {
     "lingua": [
      7.7,
      1.8,
      13.6,
      true
     ],
     "reescrita": [
      7.7,
      0.9,
      14.4,
      true
     ]
    },
    "auroc": {
     "lingua": [
      2.9,
      0.9,
      5.3,
      true
     ],
     "reescrita": [
      -3.3,
      -6.7,
      -0.2,
      true
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -4.2,
      -6.2,
      -2.2,
      true
     ],
     "reescrita": [
      0.5,
      -0.6,
      1.6,
      false
     ]
    },
    "fpr": {
     "lingua": [
      7.7,
      0.0,
      15.1,
      false
     ],
     "reescrita": [
      1.4,
      -1.7,
      5.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -1.4,
      -2.8,
      0.1,
      false
     ],
     "reescrita": [
      0.9,
      0.1,
      1.8,
      true
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      34.6,
      22.2,
      46.5,
      true
     ],
     "reescrita": [
      5.0,
      1.3,
      8.9,
      true
     ]
    },
    "fpr": {
     "lingua": [
      -10.5,
      -21.7,
      0.6,
      false
     ],
     "reescrita": [
      6.3,
      1.0,
      11.9,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -14.0,
      -20.6,
      -7.7,
      true
     ],
     "reescrita": [
      -3.2,
      -5.5,
      -1.0,
      true
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -4.4,
    "depois": 2.2,
    "fprAntes": 11.9,
    "fprDepois": 2.1
   },
   "opus": {
    "antes": -4.4,
    "depois": 2.6,
    "fprAntes": 15.4,
    "fprDepois": 1.6
   },
   "deepseek": {
    "antes": -3.7,
    "depois": 2.4,
    "fprAntes": 9.1,
    "fprDepois": 3.0
   },
   "swh": {
    "antes": 39.6,
    "depois": 39.0,
    "fprAntes": -4.2,
    "fprDepois": -0.8
   }
  },
  "comp": "Em português fica mais rígido: barra 35,7% das seguras com o NLLB-200, contra 23,8% em inglês."
 },
 {
  "id": "jailjudge",
  "nome": "JailJudge",
  "grupo": "origem",
  "especie": "caburé",
  "cientifico": "Glaucidium brasilianum",
  "img": "assets/img/guia/cabure.jpg",
  "sobre": "Dá uma nota de 1 a 10 ao ataque; a nota vira escore de 0 a 1.",
  "taxas": {
   "en": {
    "fnr": 23.8,
    "fpr": 39.9,
    "auroc": 0.776
   },
   "nllb": {
    "fnr": 35.4,
    "fpr": 32.2,
    "auroc": 0.722
   },
   "opus": {
    "fnr": 32.8,
    "fpr": 33.6,
    "auroc": 0.719
   },
   "deepseek": {
    "fnr": 29.4,
    "fpr": 36.4,
    "auroc": 0.734
   },
   "swh": {
    "fnr": 68.1,
    "fpr": 18.2,
    "auroc": 0.566
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      5.3,
      1.2,
      9.4,
      true
     ],
     "reescrita": [
      6.3,
      3.6,
      9.2,
      true
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      -7.2,
      9.7,
      false
     ],
     "reescrita": [
      -9.1,
      -14.1,
      -3.8,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -3.1,
      -8.3,
      2.0,
      false
     ],
     "reescrita": [
      -2.3,
      -5.6,
      1.6,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      5.4,
      0.3,
      10.4,
      true
     ],
     "reescrita": [
      3.6,
      -0.8,
      8.4,
      false
     ]
    },
    "fpr": {
     "lingua": [
      4.2,
      -8.9,
      15.4,
      false
     ],
     "reescrita": [
      -10.5,
      -19.0,
      -0.9,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -5.1,
      -10.8,
      1.3,
      false
     ],
     "reescrita": [
      -0.5,
      -4.4,
      2.9,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      5.4,
      1.1,
      10.3,
      true
     ],
     "reescrita": [
      0.2,
      -2.3,
      2.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      4.2,
      -3.8,
      12.0,
      false
     ],
     "reescrita": [
      -7.7,
      -11.9,
      -3.3,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -4.9,
      -9.3,
      -0.3,
      true
     ],
     "reescrita": [
      0.7,
      -2.6,
      3.7,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      42.1,
      33.2,
      50.9,
      true
     ],
     "reescrita": [
      2.3,
      -1.1,
      5.3,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -18.9,
      -37.4,
      0.9,
      false
     ],
     "reescrita": [
      -2.8,
      -11.4,
      5.1,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -16.7,
      -28.8,
      -6.7,
      true
     ],
     "reescrita": [
      -4.3,
      -8.7,
      0.2,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": 11.6,
    "depois": 9.6,
    "fprAntes": -7.7,
    "fprDepois": -4.8
   },
   "opus": {
    "antes": 9.0,
    "depois": 9.8,
    "fprAntes": -6.3,
    "fprDepois": -4.2
   },
   "deepseek": {
    "antes": 5.6,
    "depois": 5.4,
    "fprAntes": -3.5,
    "fprDepois": -1.1
   },
   "swh": {
    "antes": 44.3,
    "depois": 34.2,
    "fprAntes": -21.7,
    "fprDepois": -8.7
   }
  },
  "comp": "Em português passa a liberar mais nocivas: 35,4% com o NLLB-200, contra 23,8% em inglês."
 },
 {
  "id": "aegis",
  "nome": "AegisGuard",
  "grupo": "origem",
  "especie": "mocho-diabo",
  "cientifico": "Asio stygius",
  "img": "assets/img/guia/mocho.jpg",
  "sobre": "NVIDIA. LlamaGuard de 7 bilhões com o ajuste Aegis Permissive.",
  "taxas": {
   "en": {
    "fnr": 25.3,
    "fpr": 55.9,
    "auroc": 0.652
   },
   "nllb": {
    "fnr": 22.3,
    "fpr": 60.1,
    "auroc": 0.641
   },
   "opus": {
    "fnr": 23.7,
    "fpr": 63.6,
    "auroc": 0.622
   },
   "deepseek": {
    "fnr": 28.6,
    "fpr": 50.3,
    "auroc": 0.655
   },
   "swh": {
    "fnr": 69.4,
    "fpr": 36.4,
    "auroc": 0.505
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      1.5,
      -2.5,
      5.6,
      false
     ],
     "reescrita": [
      -4.4,
      -9.1,
      -0.1,
      true
     ]
    },
    "fpr": {
     "lingua": [
      2.8,
      -8.2,
      14.1,
      false
     ],
     "reescrita": [
      1.4,
      -7.7,
      10.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -2.4,
      -6.9,
      2.6,
      false
     ],
     "reescrita": [
      1.4,
      -3.4,
      6.4,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      2.0,
      -4.7,
      8.0,
      false
     ],
     "reescrita": [
      -3.6,
      -9.1,
      1.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      4.2,
      -9.8,
      18.9,
      false
     ],
     "reescrita": [
      3.5,
      -7.9,
      15.6,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -2.2,
      -7.9,
      4.0,
      false
     ],
     "reescrita": [
      -0.8,
      -5.2,
      3.7,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      3.9,
      -2.3,
      10.4,
      false
     ],
     "reescrita": [
      -0.6,
      -3.0,
      1.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -4.9,
      -16.7,
      5.6,
      false
     ],
     "reescrita": [
      -0.7,
      -4.7,
      4.3,
      false
     ]
    },
    "auroc": {
     "lingua": [
      2.7,
      -3.1,
      9.2,
      false
     ],
     "reescrita": [
      -2.3,
      -5.0,
      0.1,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      48.9,
      37.0,
      61.0,
      true
     ],
     "reescrita": [
      -4.7,
      -10.5,
      -0.1,
      true
     ]
    },
    "fpr": {
     "lingua": [
      -21.0,
      -43.2,
      2.1,
      false
     ],
     "reescrita": [
      1.4,
      -7.5,
      11.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -15.8,
      -26.5,
      -4.1,
      true
     ],
     "reescrita": [
      1.1,
      -3.3,
      5.7,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -2.9,
    "depois": -1.2,
    "fprAntes": 4.2,
    "fprDepois": 2.0
   },
   "opus": {
    "antes": -1.6,
    "depois": 0.8,
    "fprAntes": 7.7,
    "fprDepois": 1.4
   },
   "deepseek": {
    "antes": 3.4,
    "depois": -0.5,
    "fprAntes": -5.6,
    "fprDepois": -1.8
   },
   "swh": {
    "antes": 44.2,
    "depois": 18.0,
    "fprAntes": -19.6,
    "fprDepois": -1.2
   }
  },
  "comp": "Depende do tradutor: com dois libera menos nocivas, com o DeepSeek libera mais."
 },
 {
  "id": "polyguard",
  "nome": "PolyGuard",
  "grupo": "novo",
  "especie": "murucututu",
  "cientifico": "Pulsatrix perspicillata",
  "img": "assets/img/guia/murucututu.jpg",
  "sobre": "Treinado para moderar em 17 línguas, o português entre elas.",
  "taxas": {
   "en": {
    "fnr": 3.6,
    "fpr": 93.7,
    "auroc": 0.596
   },
   "nllb": {
    "fnr": 3.7,
    "fpr": 93.0,
    "auroc": 0.577
   },
   "opus": {
    "fnr": 3.8,
    "fpr": 92.3,
    "auroc": 0.586
   },
   "deepseek": {
    "fnr": 3.5,
    "fpr": 94.4,
    "auroc": 0.616
   },
   "swh": {
    "fnr": 15.3,
    "fpr": 60.1,
    "auroc": 0.69
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      0.1,
      -0.3,
      0.6,
      false
     ],
     "reescrita": [
      0.0,
      -0.5,
      0.5,
      false
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      0.0,
      5.0,
      false
     ],
     "reescrita": [
      -2.1,
      -5.9,
      0.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -3.1,
      -8.0,
      2.0,
      false
     ],
     "reescrita": [
      1.2,
      -4.3,
      6.2,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -0.6,
      -2.2,
      0.4,
      false
     ],
     "reescrita": [
      0.8,
      -0.1,
      2.5,
      false
     ]
    },
    "fpr": {
     "lingua": [
      5.6,
      -4.7,
      19.2,
      false
     ],
     "reescrita": [
      -7.0,
      -19.0,
      0.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -9.9,
      -24.3,
      0.1,
      false
     ],
     "reescrita": [
      8.9,
      -1.3,
      21.1,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      0.0,
      -0.6,
      0.5,
      false
     ],
     "reescrita": [
      -0.1,
      -0.3,
      0.0,
      false
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      -1.5,
      5.1,
      false
     ],
     "reescrita": [
      -0.7,
      -2.5,
      0.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      1.2,
      -3.3,
      6.1,
      false
     ],
     "reescrita": [
      0.8,
      -2.1,
      3.4,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      12.0,
      2.4,
      22.8,
      true
     ],
     "reescrita": [
      -0.2,
      -0.9,
      0.4,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -32.2,
      -54.0,
      -11.1,
      true
     ],
     "reescrita": [
      -1.4,
      -4.5,
      0.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      8.5,
      -1.5,
      18.8,
      false
     ],
     "reescrita": [
      0.9,
      -5.6,
      6.5,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": 0.1,
    "depois": -1.5,
    "fprAntes": -0.7,
    "fprDepois": 1.2
   },
   "opus": {
    "antes": 0.2,
    "depois": -0.5,
    "fprAntes": -1.4,
    "fprDepois": -1.3
   },
   "deepseek": {
    "antes": -0.1,
    "depois": -1.0,
    "fprAntes": 0.7,
    "fprDepois": 1.6
   },
   "swh": {
    "antes": 11.7,
    "depois": -0.5,
    "fprAntes": -33.6,
    "fprDepois": -5.3
   }
  },
  "comp": "Barra 93,7% das seguras já em inglês, até uma recusa clara."
 },
 {
  "id": "qwen3guard",
  "nome": "Qwen3Guard",
  "grupo": "novo",
  "especie": "coruja-orelhuda",
  "cientifico": "Asio clamator",
  "img": "assets/img/guia/orelhuda.jpg",
  "sobre": "Qwen. Moderação em 119 línguas; aqui no modo estrito, em que o duvidoso conta como nocivo.",
  "taxas": {
   "en": {
    "fnr": 3.9,
    "fpr": 86.0,
    "auroc": 0.826
   },
   "nllb": {
    "fnr": 3.7,
    "fpr": 90.9,
    "auroc": 0.824
   },
   "opus": {
    "fnr": 3.7,
    "fpr": 90.9,
    "auroc": 0.826
   },
   "deepseek": {
    "fnr": 3.9,
    "fpr": 88.1,
    "auroc": 0.823
   },
   "swh": {
    "fnr": 6.2,
    "fpr": 75.5,
    "auroc": 0.729
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      0.0,
      0.0,
      0.0,
      false
     ],
     "reescrita": [
      -0.2,
      -0.6,
      0.0,
      false
     ]
    },
    "fpr": {
     "lingua": [
      3.5,
      0.0,
      7.2,
      false
     ],
     "reescrita": [
      1.4,
      -4.1,
      6.8,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.5,
      -1.7,
      3.0,
      false
     ],
     "reescrita": [
      -0.7,
      -2.8,
      1.6,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -1.4,
      -4.4,
      0.2,
      false
     ],
     "reescrita": [
      1.1,
      -0.4,
      4.0,
      false
     ]
    },
    "fpr": {
     "lingua": [
      12.6,
      0.0,
      26.6,
      false
     ],
     "reescrita": [
      -7.7,
      -22.0,
      6.1,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.8,
      -1.3,
      3.1,
      false
     ],
     "reescrita": [
      -0.7,
      -2.8,
      1.5,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -0.2,
      -0.6,
      0.0,
      false
     ],
     "reescrita": [
      0.2,
      0.0,
      0.6,
      false
     ]
    },
    "fpr": {
     "lingua": [
      4.2,
      0.7,
      8.3,
      true
     ],
     "reescrita": [
      -2.1,
      -4.3,
      0.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.5,
      -2.0,
      1.0,
      false
     ],
     "reescrita": [
      0.2,
      -0.5,
      1.0,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      2.6,
      0.5,
      5.3,
      true
     ],
     "reescrita": [
      -0.3,
      -1.0,
      0.1,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -12.6,
      -28.2,
      2.1,
      false
     ],
     "reescrita": [
      2.1,
      -4.3,
      7.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -8.9,
      -14.1,
      -3.9,
      true
     ],
     "reescrita": [
      -0.8,
      -2.7,
      1.3,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -0.2,
    "depois": -0.6,
    "fprAntes": 4.9,
    "fprDepois": 0.7
   },
   "opus": {
    "antes": -0.2,
    "depois": -0.5,
    "fprAntes": 4.9,
    "fprDepois": 0.4
   },
   "deepseek": {
    "antes": 0.0,
    "depois": -0.4,
    "fprAntes": 2.1,
    "fprDepois": 0.8
   },
   "swh": {
    "antes": 2.3,
    "depois": -0.7,
    "fprAntes": -10.5,
    "fprDepois": -3.2
   }
  },
  "comp": "Barra 86,0% das seguras já em inglês. Em português ordena como em inglês."
 },
 {
  "id": "nemotron",
  "nome": "Nemotron Safety Guard",
  "grupo": "novo",
  "especie": "coruja-do-mato",
  "cientifico": "Strix virgata",
  "img": "assets/img/guia/coruja-do-mato.jpg",
  "sobre": "NVIDIA. O sucessor multilíngue do AegisGuard.",
  "taxas": {
   "en": {
    "fnr": 12.7,
    "fpr": 57.3,
    "auroc": 0.748
   },
   "nllb": {
    "fnr": 10.5,
    "fpr": 65.0,
    "auroc": 0.758
   },
   "opus": {
    "fnr": 9.7,
    "fpr": 63.6,
    "auroc": 0.746
   },
   "deepseek": {
    "fnr": 12.0,
    "fpr": 65.7,
    "auroc": 0.715
   },
   "swh": {
    "fnr": 20.7,
    "fpr": 51.7,
    "auroc": 0.71
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      0.3,
      -1.4,
      2.1,
      false
     ],
     "reescrita": [
      -2.6,
      -5.0,
      -0.1,
      true
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      -2.9,
      5.4,
      false
     ],
     "reescrita": [
      6.3,
      -2.4,
      13.7,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -3.2,
      -6.3,
      -0.6,
      true
     ],
     "reescrita": [
      4.2,
      0.7,
      8.3,
      true
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -2.9,
      -6.3,
      -0.1,
      true
     ],
     "reescrita": [
      -0.1,
      -2.9,
      3.4,
      false
     ]
    },
    "fpr": {
     "lingua": [
      11.2,
      0.0,
      23.9,
      false
     ],
     "reescrita": [
      -4.9,
      -18.0,
      7.8,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -2.4,
      -5.8,
      0.6,
      false
     ],
     "reescrita": [
      2.2,
      -0.8,
      5.4,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -1.4,
      -2.9,
      0.3,
      false
     ],
     "reescrita": [
      0.6,
      -1.2,
      2.3,
      false
     ]
    },
    "fpr": {
     "lingua": [
      7.0,
      -0.7,
      14.4,
      false
     ],
     "reescrita": [
      1.4,
      -3.3,
      6.8,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -3.2,
      -5.5,
      -1.1,
      true
     ],
     "reescrita": [
      -0.0,
      -1.6,
      1.6,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      10.4,
      4.9,
      16.4,
      true
     ],
     "reescrita": [
      -2.4,
      -5.8,
      1.1,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -8.4,
      -18.5,
      3.2,
      false
     ],
     "reescrita": [
      2.8,
      -3.7,
      10.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -6.2,
      -10.8,
      -1.4,
      true
     ],
     "reescrita": [
      2.4,
      -0.7,
      5.5,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -2.3,
    "depois": -0.3,
    "fprAntes": 7.7,
    "fprDepois": 0.7
   },
   "opus": {
    "antes": -3.0,
    "depois": -1.1,
    "fprAntes": 6.3,
    "fprDepois": 1.1
   },
   "deepseek": {
    "antes": -0.8,
    "depois": 2.2,
    "fprAntes": 8.4,
    "fprDepois": 2.0
   },
   "swh": {
    "antes": 8.0,
    "depois": 6.5,
    "fprAntes": -5.6,
    "fprDepois": -2.6
   }
  },
  "comp": "Em português perde um pouco da capacidade de separar nocivas de seguras, com o NLLB-200 e o DeepSeek."
 },
 {
  "id": "granite",
  "nome": "Granite Guardian",
  "grupo": "novo",
  "especie": "coruja-listrada",
  "cientifico": "Strix hylophila",
  "img": "assets/img/guia/listrada.jpg",
  "sobre": "IBM. Julga a resposta pelo critério de dano que vem com o modelo.",
  "taxas": {
   "en": {
    "fnr": 5.3,
    "fpr": 81.1,
    "auroc": 0.744
   },
   "nllb": {
    "fnr": 8.6,
    "fpr": 70.6,
    "auroc": 0.731
   },
   "opus": {
    "fnr": 9.4,
    "fpr": 74.8,
    "auroc": 0.736
   },
   "deepseek": {
    "fnr": 8.2,
    "fpr": 77.6,
    "auroc": 0.731
   },
   "swh": {
    "fnr": 30.4,
    "fpr": 45.5,
    "auroc": 0.66
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      2.4,
      -0.5,
      5.5,
      false
     ],
     "reescrita": [
      0.9,
      -0.5,
      2.8,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -9.1,
      -20.5,
      -0.8,
      true
     ],
     "reescrita": [
      -1.4,
      -7.5,
      2.9,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -1.9,
      -5.0,
      1.3,
      false
     ],
     "reescrita": [
      0.6,
      -1.4,
      2.8,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      2.1,
      -1.9,
      6.2,
      false
     ],
     "reescrita": [
      1.9,
      -0.1,
      5.0,
      false
     ]
    },
    "fpr": {
     "lingua": [
      5.6,
      -5.0,
      15.1,
      false
     ],
     "reescrita": [
      -11.9,
      -28.0,
      2.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -2.1,
      -4.4,
      0.7,
      false
     ],
     "reescrita": [
      1.3,
      -0.6,
      3.6,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      2.6,
      0.3,
      5.4,
      true
     ],
     "reescrita": [
      0.3,
      0.0,
      0.8,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -3.5,
      -6.7,
      -1.0,
      true
     ],
     "reescrita": [
      0.0,
      -2.1,
      1.7,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -1.2,
      -3.3,
      1.2,
      false
     ],
     "reescrita": [
      -0.2,
      -1.1,
      1.0,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      24.6,
      15.3,
      35.0,
      true
     ],
     "reescrita": [
      0.6,
      -0.9,
      2.8,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -34.3,
      -51.4,
      -17.6,
      true
     ],
     "reescrita": [
      -1.4,
      -8.7,
      6.1,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -9.5,
      -17.9,
      -0.9,
      true
     ],
     "reescrita": [
      1.0,
      -1.6,
      3.7,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": 3.3,
    "depois": 1.9,
    "fprAntes": -10.5,
    "fprDepois": -5.3
   },
   "opus": {
    "antes": 4.1,
    "depois": 2.5,
    "fprAntes": -6.3,
    "fprDepois": -3.5
   },
   "deepseek": {
    "antes": 2.9,
    "depois": 2.0,
    "fprAntes": -3.5,
    "fprDepois": -2.0
   },
   "swh": {
    "antes": 25.1,
    "depois": 4.8,
    "fprAntes": -35.7,
    "fprDepois": -5.5
   }
  },
  "comp": "Barra 81,1% das seguras já em inglês. Em português ordena como em inglês."
 },
 {
  "id": "jev",
  "nome": "Jev",
  "grupo": "novo",
  "especie": "jacurutu",
  "cientifico": "Bubo virginianus",
  "img": "assets/img/guia/jacurutu.jpg",
  "sobre": "TypeSafe, por API. Modelo de decisão: responde a uma pergunta com uma probabilidade calibrada.",
  "taxas": {
   "en": {
    "fnr": 26.2,
    "fpr": 16.1,
    "auroc": 0.881
   },
   "nllb": {
    "fnr": 22.5,
    "fpr": 21.0,
    "auroc": 0.867
   },
   "opus": {
    "fnr": 19.3,
    "fpr": 20.3,
    "auroc": 0.87
   },
   "deepseek": {
    "fnr": 23.7,
    "fpr": 19.6,
    "auroc": 0.871
   },
   "swh": {
    "fnr": 14.9,
    "fpr": 29.4,
    "auroc": 0.851
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      -5.4,
      -7.8,
      -2.8,
      true
     ],
     "reescrita": [
      1.8,
      -2.1,
      5.3,
      false
     ]
    },
    "fpr": {
     "lingua": [
      4.2,
      0.6,
      9.4,
      true
     ],
     "reescrita": [
      0.7,
      -4.8,
      5.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.8,
      -1.2,
      2.7,
      false
     ],
     "reescrita": [
      -2.2,
      -5.1,
      0.5,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -7.3,
      -11.0,
      -4.0,
      true
     ],
     "reescrita": [
      0.5,
      -2.7,
      3.8,
      false
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      -1.2,
      4.5,
      false
     ],
     "reescrita": [
      2.8,
      -0.8,
      6.3,
      false
     ]
    },
    "auroc": {
     "lingua": [
      2.8,
      0.9,
      4.7,
      true
     ],
     "reescrita": [
      -3.9,
      -6.0,
      -1.8,
      true
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -4.1,
      -7.0,
      -1.8,
      true
     ],
     "reescrita": [
      1.6,
      -0.1,
      3.6,
      false
     ]
    },
    "fpr": {
     "lingua": [
      1.4,
      0.0,
      3.6,
      false
     ],
     "reescrita": [
      2.1,
      -0.8,
      5.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.1,
      -0.7,
      0.6,
      false
     ],
     "reescrita": [
      -1.0,
      -2.0,
      -0.2,
      true
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      -8.3,
      -11.5,
      -5.0,
      true
     ],
     "reescrita": [
      -2.9,
      -5.6,
      -0.6,
      true
     ]
    },
    "fpr": {
     "lingua": [
      9.1,
      1.0,
      18.8,
      true
     ],
     "reescrita": [
      4.2,
      -2.8,
      11.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      0.3,
      -2.5,
      3.1,
      false
     ],
     "reescrita": [
      -3.4,
      -7.1,
      -0.3,
      true
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -3.6,
    "depois": 0.9,
    "fprAntes": 4.9,
    "fprDepois": 2.4
   },
   "opus": {
    "antes": -6.9,
    "depois": -2.5,
    "fprAntes": 4.2,
    "fprDepois": 2.3
   },
   "deepseek": {
    "antes": -2.5,
    "depois": 2.1,
    "fprAntes": 3.5,
    "fprDepois": 1.9
   },
   "swh": {
    "antes": -11.3,
    "depois": 4.4,
    "fprAntes": 13.3,
    "fprDepois": 4.4
   }
  },
  "comp": "O que melhor separa nocivas de seguras em inglês (AUROC 0,881), e continua assim em português."
 },
 {
  "id": "lev",
  "nome": "Lev",
  "grupo": "novo",
  "especie": "mocho-dos-banhados",
  "cientifico": "Asio flammeus",
  "img": "assets/img/guia/mocho-dos-banhados.jpg",
  "sobre": "Modelo de decisão aberto, de 4 bilhões de parâmetros, com a mesma pergunta do Jev.",
  "taxas": {
   "en": {
    "fnr": 4.2,
    "fpr": 64.3,
    "auroc": 0.789
   },
   "nllb": {
    "fnr": 6.2,
    "fpr": 76.9,
    "auroc": 0.69
   },
   "opus": {
    "fnr": 3.5,
    "fpr": 79.0,
    "auroc": 0.695
   },
   "deepseek": {
    "fnr": 4.5,
    "fpr": 75.5,
    "auroc": 0.715
   },
   "swh": {
    "fnr": 10.5,
    "fpr": 59.4,
    "auroc": 0.698
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      3.0,
      -0.6,
      8.5,
      false
     ],
     "reescrita": [
      -1.0,
      -2.4,
      0.5,
      false
     ]
    },
    "fpr": {
     "lingua": [
      -0.7,
      -9.8,
      8.8,
      false
     ],
     "reescrita": [
      13.3,
      3.6,
      22.8,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -5.4,
      -11.8,
      1.0,
      false
     ],
     "reescrita": [
      -4.6,
      -8.7,
      -0.7,
      true
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -0.6,
      -3.3,
      2.9,
      false
     ],
     "reescrita": [
      -0.1,
      -1.6,
      1.4,
      false
     ]
    },
    "fpr": {
     "lingua": [
      12.6,
      1.6,
      21.5,
      true
     ],
     "reescrita": [
      2.1,
      -11.5,
      15.6,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -8.5,
      -13.3,
      -3.3,
      true
     ],
     "reescrita": [
      -0.9,
      -4.6,
      2.7,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      0.9,
      -1.2,
      3.8,
      false
     ],
     "reescrita": [
      -0.6,
      -1.7,
      0.5,
      false
     ]
    },
    "fpr": {
     "lingua": [
      9.1,
      1.1,
      16.0,
      true
     ],
     "reescrita": [
      2.1,
      -3.2,
      6.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -6.4,
      -11.8,
      -1.3,
      true
     ],
     "reescrita": [
      -1.0,
      -2.4,
      0.5,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      4.2,
      -0.5,
      10.3,
      false
     ],
     "reescrita": [
      2.1,
      0.1,
      4.7,
      true
     ]
    },
    "fpr": {
     "lingua": [
      -14.7,
      -35.7,
      5.4,
      false
     ],
     "reescrita": [
      9.8,
      -2.3,
      21.3,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -3.6,
      -10.5,
      3.1,
      false
     ],
     "reescrita": [
      -5.5,
      -10.7,
      -0.3,
      true
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": 2.0,
    "depois": 8.2,
    "fprAntes": 12.6,
    "fprDepois": 3.5
   },
   "opus": {
    "antes": -0.7,
    "depois": 8.7,
    "fprAntes": 14.7,
    "fprDepois": 2.5
   },
   "deepseek": {
    "antes": 0.3,
    "depois": 6.2,
    "fprAntes": 11.2,
    "fprDepois": 0.9
   },
   "swh": {
    "antes": 6.3,
    "depois": 8.1,
    "fprAntes": -4.9,
    "fprDepois": -2.8
   }
  },
  "comp": "Rígido em inglês (barra 64,3% das seguras) e perde a ordenação em português com o Opus-MT e o DeepSeek."
 },
 {
  "id": "laya",
  "nome": "Laya",
  "grupo": "novo",
  "especie": "coruja-preta",
  "cientifico": "Strix huhula",
  "img": "assets/img/guia/coruja-preta.jpg",
  "sobre": "Convai. Modelo de decisão aberto, na versão multilíngue, com a mesma pergunta do Jev.",
  "taxas": {
   "en": {
    "fnr": 45.7,
    "fpr": 46.9,
    "auroc": 0.557
   },
   "nllb": {
    "fnr": 23.4,
    "fpr": 65.7,
    "auroc": 0.536
   },
   "opus": {
    "fnr": 24.4,
    "fpr": 66.4,
    "auroc": 0.542
   },
   "deepseek": {
    "fnr": 21.5,
    "fpr": 62.2,
    "auroc": 0.552
   },
   "swh": {
    "fnr": 34.4,
    "fpr": 65.0,
    "auroc": 0.464
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      -24.7,
      -32.9,
      -16.6,
      true
     ],
     "reescrita": [
      2.5,
      -1.1,
      6.6,
      false
     ]
    },
    "fpr": {
     "lingua": [
      24.5,
      13.8,
      36.8,
      true
     ],
     "reescrita": [
      -5.6,
      -9.8,
      -1.6,
      true
     ]
    },
    "auroc": {
     "lingua": [
      -3.8,
      -8.4,
      0.9,
      false
     ],
     "reescrita": [
      1.6,
      -1.3,
      4.1,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -20.9,
      -28.0,
      -13.9,
      true
     ],
     "reescrita": [
      -0.5,
      -3.1,
      2.1,
      false
     ]
    },
    "fpr": {
     "lingua": [
      20.3,
      11.9,
      29.8,
      true
     ],
     "reescrita": [
      -0.7,
      -6.0,
      3.6,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.2,
      -4.9,
      4.3,
      false
     ],
     "reescrita": [
      -1.4,
      -4.0,
      1.4,
      false
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -23.3,
      -31.4,
      -15.5,
      true
     ],
     "reescrita": [
      -0.8,
      -2.8,
      1.2,
      false
     ]
    },
    "fpr": {
     "lingua": [
      14.0,
      6.1,
      22.4,
      true
     ],
     "reescrita": [
      1.4,
      -2.7,
      5.3,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.3,
      -6.1,
      5.0,
      false
     ],
     "reescrita": [
      -0.3,
      -2.0,
      1.4,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      -16.2,
      -22.4,
      -10.2,
      true
     ],
     "reescrita": [
      5.0,
      0.9,
      9.0,
      true
     ]
    },
    "fpr": {
     "lingua": [
      21.7,
      13.4,
      30.8,
      true
     ],
     "reescrita": [
      -3.5,
      -9.8,
      2.0,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -7.6,
      -12.6,
      -2.9,
      true
     ],
     "reescrita": [
      -1.7,
      -5.1,
      1.6,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -22.2,
    "depois": -2.5,
    "fprAntes": 18.9,
    "fprDepois": 3.3
   },
   "opus": {
    "antes": -21.3,
    "depois": -4.1,
    "fprAntes": 19.6,
    "fprDepois": 3.3
   },
   "deepseek": {
    "antes": -24.1,
    "depois": -5.2,
    "fprAntes": 15.4,
    "fprDepois": 2.5
   },
   "swh": {
    "antes": -11.3,
    "depois": 9.2,
    "fprAntes": 18.2,
    "fprDepois": 5.1
   }
  },
  "comp": "Ordena quase ao acaso já em inglês (AUROC 0,557)."
 },
 {
  "id": "llm-rubrica",
  "nome": "Qwen3 com rubrica",
  "grupo": "novo",
  "especie": "corujinha-do-sul",
  "cientifico": "Megascops sanctaecatarinae",
  "img": "assets/img/guia/corujinha-do-sul.jpg",
  "sobre": "Um LLM comum de 8 bilhões de parâmetros, que julga com a rubrica do HarmBench, sem a regra do inglês.",
  "taxas": {
   "en": {
    "fnr": 29.7,
    "fpr": 29.4,
    "auroc": 0.793
   },
   "nllb": {
    "fnr": 20.7,
    "fpr": 48.3,
    "auroc": 0.731
   },
   "opus": {
    "fnr": 18.3,
    "fpr": 50.3,
    "auroc": 0.76
   },
   "deepseek": {
    "fnr": 22.3,
    "fpr": 39.2,
    "auroc": 0.77
   },
   "swh": {
    "fnr": 15.4,
    "fpr": 58.0,
    "auroc": 0.68
   }
  },
  "partes": {
   "nllb": {
    "fnr": {
     "lingua": [
      -6.7,
      -11.2,
      -1.8,
      true
     ],
     "reescrita": [
      -2.3,
      -7.9,
      2.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      10.5,
      4.7,
      16.6,
      true
     ],
     "reescrita": [
      8.4,
      -5.9,
      23.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.8,
      -5.0,
      3.8,
      false
     ],
     "reescrita": [
      -5.4,
      -11.8,
      0.7,
      false
     ]
    }
   },
   "opus": {
    "fnr": {
     "lingua": [
      -11.5,
      -16.4,
      -6.3,
      true
     ],
     "reescrita": [
      0.1,
      -3.5,
      3.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      16.1,
      7.1,
      26.7,
      true
     ],
     "reescrita": [
      4.9,
      -7.5,
      17.5,
      false
     ]
    },
    "auroc": {
     "lingua": [
      2.6,
      -1.8,
      6.8,
      false
     ],
     "reescrita": [
      -5.8,
      -10.5,
      -0.2,
      true
     ]
    }
   },
   "deepseek": {
    "fnr": {
     "lingua": [
      -9.8,
      -15.1,
      -4.7,
      true
     ],
     "reescrita": [
      2.5,
      -0.6,
      5.9,
      false
     ]
    },
    "fpr": {
     "lingua": [
      9.8,
      0.9,
      17.6,
      true
     ],
     "reescrita": [
      0.0,
      -4.7,
      5.3,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -0.9,
      -5.0,
      3.3,
      false
     ],
     "reescrita": [
      -1.4,
      -3.6,
      0.5,
      false
     ]
    }
   },
   "swh": {
    "fnr": {
     "lingua": [
      -11.6,
      -18.5,
      -4.4,
      true
     ],
     "reescrita": [
      -2.6,
      -7.1,
      1.5,
      false
     ]
    },
    "fpr": {
     "lingua": [
      26.6,
      14.5,
      37.3,
      true
     ],
     "reescrita": [
      2.1,
      -7.5,
      11.4,
      false
     ]
    },
    "auroc": {
     "lingua": [
      -8.0,
      -15.5,
      -0.3,
      true
     ],
     "reescrita": [
      -3.2,
      -9.2,
      2.5,
      false
     ]
    }
   }
  },
  "limiar": {
   "nllb": {
    "antes": -8.9,
    "depois": 8.2,
    "fprAntes": 18.9,
    "fprDepois": 4.9
   },
   "opus": {
    "antes": -11.4,
    "depois": 0.2,
    "fprAntes": 21.0,
    "fprDepois": 5.8
   },
   "deepseek": {
    "antes": -7.3,
    "depois": 0.0,
    "fprAntes": 9.8,
    "fprDepois": 3.3
   },
   "swh": {
    "antes": -14.2,
    "depois": 12.6,
    "fprAntes": 28.7,
    "fprDepois": 5.3
   }
  },
  "comp": "Em português a AUROC cai de 0,793 para 0,731 com o NLLB-200, pela reescrita e não pela língua."
 }
];
window.LIMIAR = {
 "mantem": {
  "n": 24,
  "ate5_depois": 23,
  "ate5_antes": 21,
  "mediana_depois": 1.3754227733934599
 },
 "cai": {
  "n": 12,
  "ate5_depois": 5,
  "mediana_depois": 5.822998872604282
 },
 "spearman": -0.55,
 "pontos": [
  {
   "j": "lg3",
   "cond": "nllb",
   "dauroc": 2.1,
   "antes": -0.9,
   "depois": -3.3
  },
  {
   "j": "lg3",
   "cond": "opus",
   "dauroc": -0.1,
   "antes": -0.1,
   "depois": -0.4
  },
  {
   "j": "lg3",
   "cond": "deepseek",
   "dauroc": 1.1,
   "antes": 2.4,
   "depois": -0.2
  },
  {
   "j": "harmbench",
   "cond": "nllb",
   "dauroc": -0.9,
   "antes": -4.4,
   "depois": 2.2
  },
  {
   "j": "harmbench",
   "cond": "opus",
   "dauroc": -0.4,
   "antes": -4.4,
   "depois": 2.6
  },
  {
   "j": "harmbench",
   "cond": "deepseek",
   "dauroc": -0.5,
   "antes": -3.7,
   "depois": 2.4
  },
  {
   "j": "jailjudge",
   "cond": "nllb",
   "dauroc": -5.3,
   "antes": 11.6,
   "depois": 9.6
  },
  {
   "j": "jailjudge",
   "cond": "opus",
   "dauroc": -5.6,
   "antes": 9.0,
   "depois": 9.8
  },
  {
   "j": "jailjudge",
   "cond": "deepseek",
   "dauroc": -4.2,
   "antes": 5.6,
   "depois": 5.4
  },
  {
   "j": "aegis",
   "cond": "nllb",
   "dauroc": -1.0,
   "antes": -2.9,
   "depois": -1.2
  },
  {
   "j": "aegis",
   "cond": "opus",
   "dauroc": -3.0,
   "antes": -1.6,
   "depois": 0.8
  },
  {
   "j": "aegis",
   "cond": "deepseek",
   "dauroc": 0.4,
   "antes": 3.4,
   "depois": -0.5
  },
  {
   "j": "polyguard",
   "cond": "nllb",
   "dauroc": -1.9,
   "antes": 0.1,
   "depois": -1.5
  },
  {
   "j": "polyguard",
   "cond": "opus",
   "dauroc": -1.0,
   "antes": 0.2,
   "depois": -0.5
  },
  {
   "j": "polyguard",
   "cond": "deepseek",
   "dauroc": 2.0,
   "antes": -0.1,
   "depois": -1.0
  },
  {
   "j": "qwen3guard",
   "cond": "nllb",
   "dauroc": -0.1,
   "antes": -0.2,
   "depois": -0.6
  },
  {
   "j": "qwen3guard",
   "cond": "opus",
   "dauroc": 0.1,
   "antes": -0.2,
   "depois": -0.5
  },
  {
   "j": "qwen3guard",
   "cond": "deepseek",
   "dauroc": -0.3,
   "antes": 0.0,
   "depois": -0.4
  },
  {
   "j": "nemotron",
   "cond": "nllb",
   "dauroc": 1.0,
   "antes": -2.3,
   "depois": -0.3
  },
  {
   "j": "nemotron",
   "cond": "opus",
   "dauroc": -0.2,
   "antes": -3.0,
   "depois": -1.1
  },
  {
   "j": "nemotron",
   "cond": "deepseek",
   "dauroc": -3.3,
   "antes": -0.8,
   "depois": 2.2
  },
  {
   "j": "granite",
   "cond": "nllb",
   "dauroc": -1.3,
   "antes": 3.3,
   "depois": 1.9
  },
  {
   "j": "granite",
   "cond": "opus",
   "dauroc": -0.8,
   "antes": 4.1,
   "depois": 2.5
  },
  {
   "j": "granite",
   "cond": "deepseek",
   "dauroc": -1.4,
   "antes": 2.9,
   "depois": 2.0
  },
  {
   "j": "llm-rubrica",
   "cond": "nllb",
   "dauroc": -6.2,
   "antes": -8.9,
   "depois": 8.2
  },
  {
   "j": "llm-rubrica",
   "cond": "opus",
   "dauroc": -3.2,
   "antes": -11.4,
   "depois": 0.2
  },
  {
   "j": "llm-rubrica",
   "cond": "deepseek",
   "dauroc": -2.3,
   "antes": -7.3,
   "depois": 0.0
  },
  {
   "j": "jev",
   "cond": "nllb",
   "dauroc": -1.4,
   "antes": -3.6,
   "depois": 0.9
  },
  {
   "j": "jev",
   "cond": "opus",
   "dauroc": -1.1,
   "antes": -6.9,
   "depois": -2.5
  },
  {
   "j": "jev",
   "cond": "deepseek",
   "dauroc": -1.0,
   "antes": -2.5,
   "depois": 2.1
  },
  {
   "j": "lev",
   "cond": "nllb",
   "dauroc": -9.9,
   "antes": 2.0,
   "depois": 8.2
  },
  {
   "j": "lev",
   "cond": "opus",
   "dauroc": -9.4,
   "antes": -0.7,
   "depois": 8.7
  },
  {
   "j": "lev",
   "cond": "deepseek",
   "dauroc": -7.4,
   "antes": 0.3,
   "depois": 6.2
  },
  {
   "j": "laya",
   "cond": "nllb",
   "dauroc": -2.2,
   "antes": -22.2,
   "depois": -2.5
  },
  {
   "j": "laya",
   "cond": "opus",
   "dauroc": -1.5,
   "antes": -21.3,
   "depois": -4.1
  },
  {
   "j": "laya",
   "cond": "deepseek",
   "dauroc": -0.6,
   "antes": -24.1,
   "depois": -5.2
  }
 ]
};
window.COMITE = {"nllb": {"antes": 0.0, "depois": -0.2, "fprAntes": -4.9, "fprDepois": -1.3}, "opus": {"antes": -1.0, "depois": 1.9, "fprAntes": 4.2, "fprDepois": 0.6}, "deepseek": {"antes": 1.0, "depois": -0.1, "fprAntes": -5.6, "fprDepois": -0.6}, "swh": {"antes": 45.5, "depois": 22.6, "fprAntes": -30.1, "fprDepois": -3.8}};
window.CONTROLES = {"jev": {"pares": 967, "parafrase": 47, "traducao": 45, "volta": 34, "segunda": 31}, "jailjudge": {"rodadas": 5, "pares": 1030, "mudaEmAlguma": 134, "entreDuas": [60, 70]}};
