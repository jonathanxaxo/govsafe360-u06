// Marco 8: versão preparada para Preview Vercel com build estático reproduzível.
const initialScenarios = [
  { id: 'S01', title: 'Elaborar resumo de boletim de transparência', unit: 'Comunicação Institucional', process: 'Transparência ativa', source: 'Portal público demonstrativo', data: 'Público', env: 'Desenvolvimento', autonomy: 'Leitura', impact: 'Baixo', humanReview: 'Obrigatória', controls: 'Conferência do resumo e registro da fonte pública.' },
  { id: 'S02', title: 'Preparar análise de indicadores internos', unit: 'Planejamento', process: 'Monitoramento gerencial', source: 'Painel interno demonstrativo', data: 'Interno', env: 'Homologação', autonomy: 'Proposta', impact: 'Moderado', humanReview: 'Obrigatória', controls: 'Acesso restrito, minimização e validação pelo responsável.' },
  { id: 'S03', title: 'Inserir credencial institucional em uma solicitação', unit: 'Tecnologia', process: 'Integração de sistemas', source: 'Cofre de segredo simulado', data: 'Credencial', env: 'Desenvolvimento', autonomy: 'Execução', impact: 'Crítico', humanReview: 'Obrigatória', controls: 'Credenciais nunca devem ser inseridas em prompts ou registros.' },
  { id: 'S04', title: 'Atualizar cadastro diretamente em produção', unit: 'Operações', process: 'Manutenção cadastral', source: 'Sistema transacional demonstrativo', data: 'Interno', env: 'Produção', autonomy: 'Execução', impact: 'Crítico', humanReview: 'Obrigatória', controls: 'Segregação de funções, autorização formal e plano de reversão.' },
  { id: 'S05', title: 'Compartilhar cadastro de cidadão com serviço não homologado', unit: 'Atendimento', process: 'Atendimento ao cidadão', source: 'Cadastro pessoal sintético', data: 'Pessoal', env: 'Desenvolvimento', autonomy: 'Leitura', impact: 'Crítico', humanReview: 'Obrigatória', controls: 'Bloqueio do compartilhamento e avaliação de proteção de dados.' },
  { id: 'S06', title: 'Propor melhoria em código público demonstrativo', unit: 'Desenvolvimento', process: 'Revisão de código', source: 'Repositório público demonstrativo', data: 'Público', env: 'Desenvolvimento', autonomy: 'Edição', impact: 'Moderado', humanReview: 'Obrigatória', controls: 'Revisão de código, testes e aprovação antes da integração.' },
  { id: 'S07', title: 'Autorizar ato administrativo crítico sem validação', unit: 'Gestão', process: 'Decisão administrativa', source: 'Processo demonstrativo', data: 'Interno', env: 'Produção', autonomy: 'Crítica', impact: 'Crítico', humanReview: 'Obrigatória', controls: 'A decisão deve permanecer exclusivamente humana e formalmente competente.' },
  { id: 'S08', title: 'Analisar documento externo com instrução suspeita', unit: 'Protocolo', process: 'Análise documental', source: 'Documento externo demonstrativo', data: 'Externo', env: 'Desenvolvimento', autonomy: 'Leitura', impact: 'Alto', humanReview: 'Obrigatória', controls: 'Tratar conteúdo como não confiável e ignorar instruções embutidas.' }
].map((scenario) => ({ ...scenario, responsibleRole: 'Responsável demonstrativo', deadline: '', justification: 'Exemplo realista com dados integralmente demonstrativos.' }));

const repository = globalThis.GOVSAFE_SCENARIOS.criarRepositorio(globalThis.localStorage);
const rows = document.getElementById('cenario-rows');
const resultSummary = document.getElementById('resumo-resultados');
const form = document.getElementById('cenario-form');
const formFeedback = document.getElementById('form-feedback');
const searchInput = document.getElementById('busca');
const statusFilter = document.getElementById('filtro-status');
const dataFilter = document.getElementById('filtro-dados');
const auditRepository = globalThis.GOVSAFE_AUDIT.criarRepositorio(globalThis.localStorage);
const reviewForm = document.getElementById('review-form');
const reviewScenario = document.getElementById('review-scenario');
const reviewFeedback = document.getElementById('review-feedback');
const auditList = document.getElementById('audit-list');
const auditEmpty = document.getElementById('audit-empty');

function allScenarios() {
  return [...initialScenarios, ...repository.carregar()];
}

function decisionFor(scenario) {
  return globalThis.GOVSAFE_POLICY.avaliar({
    dados: scenario.data,
    ambiente: scenario.env,
    autonomia: scenario.autonomy
  });
}

function updateTotals(scenarios) {
  const totals = { permitido: 0, condicionado: 0, 'nao-autorizado': 0 };
  scenarios.forEach((scenario) => { totals[decisionFor(scenario).status] += 1; });
  document.getElementById('total-cenarios').textContent = String(scenarios.length);
  document.getElementById('total-permitidos').textContent = String(totals.permitido);
  document.getElementById('total-condicionados').textContent = String(totals.condicionado);
  document.getElementById('total-nao-autorizados').textContent = String(totals['nao-autorizado']);
  const revisados = new Set(auditRepository.carregar().map((evento) => evento.scenarioId));
  document.getElementById('total-pendentes').textContent = String(scenarios.filter((cenario) => !revisados.has(cenario.id)).length);
}

function render() {
  const scenarios = allScenarios();
  const filtered = globalThis.GOVSAFE_SCENARIOS.filtrar(scenarios, {
    busca: searchInput.value,
    status: statusFilter.value,
    dados: dataFilter.value
  });

  rows.replaceChildren();
  updateTotals(scenarios);
  renderReviewOptions(scenarios);
  resultSummary.textContent = `${filtered.length} de ${scenarios.length} cenário(s) exibido(s).`;

  if (!filtered.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
      cell.colSpan = 7;
    cell.className = 'empty-state';
    cell.textContent = 'Nenhum cenário corresponde à busca e aos filtros selecionados.';
    row.appendChild(cell);
    rows.appendChild(row);
    return;
  }

  for (const scenario of filtered) {
    const decision = decisionFor(scenario);
    const row = document.createElement('tr');
    const values = [scenario.id, scenario.title, scenario.unit, scenario.data, scenario.env, scenario.autonomy];

    for (const [index, value] of values.entries()) {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 1) {
        cell.className = 'scenario-title';
        const justification = document.createElement('small');
        justification.className = 'scenario-justification';
        justification.textContent = `${scenario.process} · ${scenario.justification}`;
        cell.appendChild(justification);
      }
      row.appendChild(cell);
    }

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = `chip ${decision.status}`;
    status.textContent = decision.label;
    const risk = document.createElement('strong');
    risk.className = `risk-label risk-${globalThis.GOVSAFE_POLICY.normalizar(decision.risco)}`;
    risk.textContent = `Risco ${decision.risco}`;
    const reason = document.createElement('small');
    reason.className = 'decision-reason';
    reason.textContent = `${decision.regra}: ${decision.motivo} Controles: ${decision.controles.join('; ')}.`;
    statusCell.append(status, risk, reason);
    row.appendChild(statusCell);
    rows.appendChild(row);
  }
}

function renderReviewOptions(scenarios) {
  const selected = reviewScenario.value;
  reviewScenario.replaceChildren();
  scenarios.forEach((scenario) => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = `${scenario.id} — ${scenario.title}`;
    reviewScenario.appendChild(option);
  });
  if (scenarios.some((scenario) => scenario.id === selected)) reviewScenario.value = selected;
}

function renderAudit() {
  const events = auditRepository.carregar().slice().reverse();
  auditList.replaceChildren();
  auditEmpty.hidden = events.length > 0;
  events.slice(0, 50).forEach((event) => {
    const item = document.createElement('li');
    item.className = `audit-event ${event.result}`;
    const title = document.createElement('strong');
    title.textContent = `${event.scenarioId} — ${event.result.toLocaleUpperCase('pt-BR')}`;
    const summary = document.createElement('span');
    summary.textContent = event.justification;
    const metadata = document.createElement('small');
    metadata.textContent = `${new Date(event.timestamp).toLocaleString('pt-BR')} · Revisor: ${event.reviewerRole || 'Revisor demonstrativo'} · Política: ${event.policyStatus} (${event.policyRule}) · Risco: ${event.riskLevel || 'não informado'} · Controles: ${event.controlsConfirmed ? 'confirmados' : 'pendentes'} · Solicitação: ${event.requestedDecision}`;
    const actions = document.createElement('small');
    actions.textContent = `Providências: ${event.pendingActions || 'Não informadas.'}`;
    item.append(title, summary, metadata, actions);
    auditList.appendChild(item);
  });
}

function downloadText(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formFeedback.textContent = '';
  try {
    const values = new FormData(form);
    if (values.get('synthetic') !== 'sim') {
      throw new TypeError('Confirme que o cenário usa somente dados fictícios.');
    }
    const novo = repository.adicionar({
      title: values.get('title'),
      unit: values.get('unit'),
      responsibleRole: values.get('responsibleRole'),
      process: values.get('process'),
      source: values.get('source'),
      data: values.get('data'),
      env: values.get('env'),
      autonomy: values.get('autonomy'),
      impact: values.get('impact'),
      humanReview: values.get('humanReview'),
      deadline: values.get('deadline'),
      justification: values.get('justification'),
      controls: values.get('controls')
    });
    form.reset();
    render();
    const decisao = decisionFor(novo);
    formFeedback.textContent = `${novo.id} cadastrado. Resultado: ${decisao.label}, risco ${decisao.risco}. Revise os controles na Trilha de controle.`;
    formFeedback.className = 'feedback success';
  } catch (error) {
    formFeedback.textContent = error.message;
    formFeedback.className = 'feedback error';
  }
});

[searchInput, statusFilter, dataFilter].forEach((control) => control.addEventListener('input', render));
document.getElementById('limpar-filtros').addEventListener('click', () => {
  searchInput.value = '';
  statusFilter.value = '';
  dataFilter.value = '';
  render();
  searchInput.focus();
});

document.querySelectorAll('[data-status-filter]').forEach((card) => {
  card.addEventListener('click', () => {
    searchInput.value = '';
    dataFilter.value = '';
    statusFilter.value = card.dataset.statusFilter;
    render();
    document.getElementById('cenarios').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observedSections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('.nav-link')];
if ('IntersectionObserver' in globalThis) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.3] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

const clearLocalButton = document.getElementById('limpar-cadastros');
let clearLocalPending = false;
clearLocalButton.addEventListener('click', () => {
  const quantidade = repository.carregar().length;
  if (!quantidade) {
    formFeedback.textContent = 'Não há cenários locais para apagar.';
    formFeedback.className = 'feedback';
    return;
  }
  if (!clearLocalPending) {
    clearLocalPending = true;
    clearLocalButton.textContent = 'Confirmar exclusão';
    clearLocalButton.classList.add('danger-button');
    formFeedback.textContent = `Confirme para apagar ${quantidade} cenário(s) local(is). Os oito exemplos iniciais serão preservados.`;
    formFeedback.className = 'feedback error';
    return;
  }
  repository.limpar();
  clearLocalPending = false;
  clearLocalButton.textContent = 'Apagar cenários locais';
  clearLocalButton.classList.remove('danger-button');
  render();
  formFeedback.textContent = 'Cenários locais apagados. Os oito exemplos iniciais foram preservados.';
  formFeedback.className = 'feedback success';
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  reviewFeedback.textContent = '';
  try {
    const values = new FormData(reviewForm);
    const scenario = allScenarios().find((item) => item.id === values.get('scenario'));
    if (!scenario) throw new TypeError('Cenário não encontrado.');
    const auditEvent = auditRepository.registrarRevisao({
      scenario,
      policyDecision: decisionFor(scenario),
      humanDecision: values.get('humanDecision'),
      justification: values.get('reviewJustification'),
      reviewerRole: values.get('reviewerRole'),
      controlsConfirmed: values.get('controlsConfirmed'),
      pendingActions: values.get('pendingActions')
    });
    reviewForm.querySelector('[name="reviewJustification"]').value = '';
    reviewForm.querySelector('[name="pendingActions"]').value = '';
    renderAudit();
    render();
    if (auditEvent.result === 'bloqueada') {
      reviewFeedback.textContent = 'A tentativa foi registrada, mas a política ou a ausência de controles confirmados impediu a aprovação.';
      reviewFeedback.className = 'feedback error';
    } else {
      reviewFeedback.textContent = `Decisão humana registrada como ${auditEvent.result}, sem alterar a classificação da política.`;
      reviewFeedback.className = 'feedback success';
    }
  } catch (error) {
    reviewFeedback.textContent = error.message;
    reviewFeedback.className = 'feedback error';
  }
});

document.getElementById('export-csv').addEventListener('click', () => {
  downloadText('nexogov-matriz-demandas.csv', 'text/csv;charset=utf-8', globalThis.GOVSAFE_AUDIT.gerarCsv(allScenarios(), decisionFor, auditRepository.carregar()));
});

document.getElementById('export-json').addEventListener('click', () => {
  downloadText('nexogov-auditoria.json', 'application/json;charset=utf-8', globalThis.GOVSAFE_AUDIT.gerarJson(auditRepository.carregar()));
});

const clearAuditButton = document.getElementById('clear-audit');
let clearAuditPending = false;
clearAuditButton.addEventListener('click', () => {
  const quantidade = auditRepository.carregar().length;
  if (!quantidade) {
    reviewFeedback.textContent = 'Não há eventos de auditoria para apagar.';
    reviewFeedback.className = 'feedback';
    return;
  }
  if (!clearAuditPending) {
    clearAuditPending = true;
    clearAuditButton.textContent = 'Confirmar exclusão da auditoria';
    clearAuditButton.classList.add('danger-button');
    reviewFeedback.textContent = `Confirme para apagar ${quantidade} evento(s) de auditoria local.`;
    reviewFeedback.className = 'feedback error';
    return;
  }
  auditRepository.limpar();
  clearAuditPending = false;
  clearAuditButton.textContent = 'Apagar auditoria local';
  clearAuditButton.classList.remove('danger-button');
  renderAudit();
  reviewFeedback.textContent = 'Auditoria local apagada.';
  reviewFeedback.className = 'feedback success';
});

render();
renderAudit();
console.info('NexoGov IA · fluxo institucional demonstrativo carregado com o motor GOVSAFE validado.');
