(function configurarCenarios(globalScope) {
  'use strict';

  const STORAGE_KEY = 'govsafe360.cenarios.v1';
  const CAMPOS = Object.freeze(['title', 'unit', 'responsibleRole', 'process', 'source', 'data', 'env', 'autonomy', 'impact', 'humanReview', 'justification', 'controls']);

  function textoSeguro(valor, limite, campo) {
    const texto = String(valor ?? '').trim().replace(/\s+/g, ' ');
    if (!texto) throw new TypeError(`${campo} é obrigatório.`);
    if (texto.length > limite) throw new TypeError(`${campo} excede ${limite} caracteres.`);
    return texto;
  }

  function textoOpcional(valor, limite, padrao) {
    const texto = String(valor ?? '').trim().replace(/\s+/g, ' ');
    if (!texto) return padrao;
    return texto.slice(0, limite);
  }

  function normalizarCenario(entrada, id) {
    const scenario = {
      id: textoSeguro(id ?? entrada?.id, 20, 'Identificador'),
      title: textoSeguro(entrada?.title, 120, 'Finalidade'),
      unit: textoOpcional(entrada?.unit, 80, 'Unidade demonstrativa'),
      responsibleRole: textoOpcional(entrada?.responsibleRole, 80, 'Responsável demonstrativo'),
      process: textoOpcional(entrada?.process, 120, 'Processo não informado'),
      source: textoOpcional(entrada?.source, 120, 'Fonte demonstrativa'),
      data: textoSeguro(entrada?.data, 20, 'Tipo de dado'),
      env: textoSeguro(entrada?.env, 24, 'Ambiente'),
      autonomy: textoSeguro(entrada?.autonomy, 20, 'Autonomia'),
      impact: textoOpcional(entrada?.impact, 20, 'Moderado'),
      humanReview: textoOpcional(entrada?.humanReview, 30, 'Obrigatória'),
      deadline: textoOpcional(entrada?.deadline, 10, ''),
      justification: textoSeguro(entrada?.justification, 500, 'Justificativa'),
      controls: textoOpcional(entrada?.controls, 500, 'Revisão humana e registro da decisão.'),
      createdAt: entrada?.createdAt || new Date().toISOString()
    };

    globalScope.GOVSAFE_POLICY.avaliar({
      dados: scenario.data,
      ambiente: scenario.env,
      autonomia: scenario.autonomy
    });
    return Object.freeze(scenario);
  }

  function criarRepositorio(storage) {
    function carregar() {
      try {
        const conteudo = storage.getItem(STORAGE_KEY);
        if (!conteudo) return [];
        const parsed = JSON.parse(conteudo);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((item) => normalizarCenario(item)).slice(0, 100);
      } catch {
        return [];
      }
    }

    function salvar(cenarios) {
      const normalizados = cenarios.map((item) => normalizarCenario(item)).slice(0, 100);
      storage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
      return normalizados;
    }

    function adicionar(entrada) {
      const atuais = carregar();
      const numeros = atuais
        .map((item) => Number.parseInt(item.id.replace(/^C/, ''), 10))
        .filter(Number.isFinite);
      const proximo = numeros.length ? Math.max(...numeros) + 1 : 1;
      const novo = normalizarCenario(entrada, `C${String(proximo).padStart(3, '0')}`);
      salvar([...atuais, novo]);
      return novo;
    }

    function limpar() {
      storage.removeItem(STORAGE_KEY);
    }

    return Object.freeze({ carregar, salvar, adicionar, limpar });
  }

  function normalizarBusca(valor) {
    return String(valor ?? '')
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function filtrar(cenarios, filtros = {}) {
    const busca = normalizarBusca(filtros.busca);
    return cenarios.filter((scenario) => {
      const decision = globalScope.GOVSAFE_POLICY.avaliar({
        dados: scenario.data,
        ambiente: scenario.env,
        autonomia: scenario.autonomy
      });
      const correspondeBusca = !busca || CAMPOS.some((campo) => normalizarBusca(scenario[campo]).includes(busca));
      const correspondeStatus = !filtros.status || decision.status === filtros.status;
      const correspondeDados = !filtros.dados || normalizarBusca(scenario.data) === filtros.dados;
      return correspondeBusca && correspondeStatus && correspondeDados;
    });
  }

  globalScope.GOVSAFE_SCENARIOS = Object.freeze({
    STORAGE_KEY,
    criarRepositorio,
    filtrar,
    normalizarCenario
  });
})(globalThis);
