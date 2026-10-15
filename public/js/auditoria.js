(function configurarAuditoria(globalScope) {
  'use strict';

  const STORAGE_KEY = 'govsafe360.auditoria.v1';

  function textoObrigatorio(valor, limite, campo) {
    const texto = String(valor ?? '').trim().replace(/\s+/g, ' ');
    if (!texto) throw new TypeError(`${campo} é obrigatória.`);
    if (texto.length > limite) throw new TypeError(`${campo} excede ${limite} caracteres.`);
    return texto;
  }

  function criarRepositorio(storage, now = () => new Date().toISOString()) {
    function carregar() {
      try {
        const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed.slice(0, 500) : [];
      } catch {
        return [];
      }
    }

    function salvar(eventos) {
      storage.setItem(STORAGE_KEY, JSON.stringify(eventos.slice(-500)));
    }

    function registrarRevisao({ scenario, policyDecision, humanDecision, justification }) {
      const decisaoHumana = String(humanDecision ?? '').trim();
      if (!['aprovado', 'rejeitado'].includes(decisaoHumana)) {
        throw new TypeError('Decisão humana inválida.');
      }
      const justificativa = textoObrigatorio(justification, 500, 'Justificativa');
      const bloqueada = policyDecision.status === 'nao-autorizado' && decisaoHumana === 'aprovado';
      const atuais = carregar();
      const evento = Object.freeze({
        id: `A${String(atuais.length + 1).padStart(4, '0')}`,
        timestamp: now(),
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        policyStatus: policyDecision.status,
        policyRule: policyDecision.regra,
        requestedDecision: decisaoHumana,
        result: bloqueada ? 'bloqueada' : decisaoHumana,
        justification: justificativa
      });
      salvar([...atuais, evento]);
      return evento;
    }

    function limpar() {
      storage.removeItem(STORAGE_KEY);
    }

    return Object.freeze({ carregar, registrarRevisao, limpar });
  }

  function escaparCsv(valor) {
    const texto = String(valor ?? '');
    return `"${texto.replace(/"/g, '""')}"`;
  }

  function gerarCsv(cenarios, obterDecisao, eventos = []) {
    const cabecalhos = ['ID', 'Finalidade', 'Tipo de dado', 'Ambiente', 'Autonomia', 'Decisão da política', 'Regra', 'Última revisão humana'];
    const linhas = cenarios.map((scenario) => {
      const decision = obterDecisao(scenario);
      const revisoes = eventos.filter((evento) => evento.scenarioId === scenario.id);
      const ultima = revisoes.length ? revisoes[revisoes.length - 1].result : 'pendente';
      return [scenario.id, scenario.title, scenario.data, scenario.env, scenario.autonomy, decision.status, decision.regra, ultima]
        .map(escaparCsv)
        .join(';');
    });
    return `\uFEFF${cabecalhos.map(escaparCsv).join(';')}\r\n${linhas.join('\r\n')}\r\n`;
  }

  function gerarJson(eventos) {
    return JSON.stringify({
      schema: 'govsafe360-auditoria-v1',
      exportedAt: new Date().toISOString(),
      events: eventos
    }, null, 2);
  }

  globalScope.GOVSAFE_AUDIT = Object.freeze({ STORAGE_KEY, criarRepositorio, gerarCsv, gerarJson });
})(globalThis);
