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

    function registrarRevisao({ scenario, policyDecision, humanDecision, justification, reviewerRole, controlsConfirmed, pendingActions }) {
      const decisaoHumana = String(humanDecision ?? '').trim();
      if (!['aprovado', 'rejeitado'].includes(decisaoHumana)) {
        throw new TypeError('Decisão humana inválida.');
      }
      const justificativa = textoObrigatorio(justification, 500, 'Justificativa');
      const funcaoRevisor = textoObrigatorio(reviewerRole || 'Revisor demonstrativo', 80, 'Função do revisor');
      const controlesConfirmados = String(controlsConfirmed ?? 'nao') === 'sim';
      const providencias = textoObrigatorio(pendingActions || 'Sem providências informadas.', 500, 'Pendências e providências');
      const bloqueadaPelaPolitica = policyDecision.status === 'nao-autorizado' && decisaoHumana === 'aprovado';
      const bloqueadaPorControle = policyDecision.status === 'condicionado' && decisaoHumana === 'aprovado' && !controlesConfirmados;
      const bloqueada = bloqueadaPelaPolitica || bloqueadaPorControle;
      const atuais = carregar();
      const evento = Object.freeze({
        id: `A${String(atuais.length + 1).padStart(4, '0')}`,
        timestamp: now(),
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        policyStatus: policyDecision.status,
        policyRule: policyDecision.regra,
        riskLevel: policyDecision.risco,
        requiredControls: policyDecision.controles,
        requestedDecision: decisaoHumana,
        result: bloqueada ? 'bloqueada' : decisaoHumana,
        justification: justificativa,
        reviewerRole: funcaoRevisor,
        controlsConfirmed: controlesConfirmados,
        pendingActions: providencias
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
    const cabecalhos = ['ID', 'Demanda', 'Unidade', 'Processo', 'Fonte', 'Tipo de dado', 'Ambiente', 'Autonomia', 'Impacto', 'Risco', 'Decisão da política', 'Regra', 'Controles obrigatórios', 'Última revisão humana'];
    const linhas = cenarios.map((scenario) => {
      const decision = obterDecisao(scenario);
      const revisoes = eventos.filter((evento) => evento.scenarioId === scenario.id);
      const ultima = revisoes.length ? revisoes[revisoes.length - 1].result : 'pendente';
      return [scenario.id, scenario.title, scenario.unit, scenario.process, scenario.source, scenario.data, scenario.env, scenario.autonomy, scenario.impact, decision.risco, decision.status, decision.regra, decision.controles.join(' | '), ultima]
        .map(escaparCsv)
        .join(';');
    });
    return `\uFEFF${cabecalhos.map(escaparCsv).join(';')}\r\n${linhas.join('\r\n')}\r\n`;
  }

  function gerarJson(eventos) {
    return JSON.stringify({
      schema: 'nexogov-auditoria-v2',
      exportedAt: new Date().toISOString(),
      events: eventos
    }, null, 2);
  }

  globalScope.GOVSAFE_AUDIT = Object.freeze({ STORAGE_KEY, criarRepositorio, gerarCsv, gerarJson });
})(globalThis);
