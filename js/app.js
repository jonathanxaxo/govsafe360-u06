// Marco 6: versão validada e registrada em histórico Git exclusivamente local.
const initialScenarios = [
  { id: 'S01', title: 'Resumir relatório público fictício', data: 'Público', env: 'Desenvolvimento', autonomy: 'Leitura' },
  { id: 'S02', title: 'Analisar planilha interna simulada', data: 'Interno', env: 'Homologação', autonomy: 'Proposta' },
  { id: 'S03', title: 'Inserir token fictício em um prompt', data: 'Credencial', env: 'Desenvolvimento', autonomy: 'Execução' },
  { id: 'S04', title: 'Atualizar status em produção simulada', data: 'Interno', env: 'Produção', autonomy: 'Execução' },
  { id: 'S05', title: 'Enviar CPF fictício a serviço não aprovado', data: 'Pessoal', env: 'Desenvolvimento', autonomy: 'Leitura' },
  { id: 'S06', title: 'Revisar código de exemplo fictício', data: 'Público', env: 'Desenvolvimento', autonomy: 'Edição' },
  { id: 'S07', title: 'Executar comando destrutivo em produção simulada', data: 'Interno', env: 'Produção', autonomy: 'Crítica' },
  { id: 'S08', title: 'Ler documento externo com instrução suspeita', data: 'Externo', env: 'Desenvolvimento', autonomy: 'Leitura' }
].map((scenario) => ({ ...scenario, justification: 'Cenário sintético inicial do curso.' }));

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
    cell.colSpan = 6;
    cell.className = 'empty-state';
    cell.textContent = 'Nenhum cenário corresponde à busca e aos filtros selecionados.';
    row.appendChild(cell);
    rows.appendChild(row);
    return;
  }

  for (const scenario of filtered) {
    const decision = decisionFor(scenario);
    const row = document.createElement('tr');
    const values = [scenario.id, scenario.title, scenario.data, scenario.env, scenario.autonomy];

    for (const [index, value] of values.entries()) {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 1) {
        cell.className = 'scenario-title';
        const justification = document.createElement('small');
        justification.className = 'scenario-justification';
        justification.textContent = scenario.justification;
        cell.appendChild(justification);
      }
      row.appendChild(cell);
    }

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = `chip ${decision.status}`;
    status.textContent = decision.label;
    const reason = document.createElement('small');
    reason.className = 'decision-reason';
    reason.textContent = `${decision.regra}: ${decision.motivo}`;
    statusCell.append(status, reason);
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
    metadata.textContent = `${new Date(event.timestamp).toLocaleString('pt-BR')} · Política: ${event.policyStatus} (${event.policyRule}) · Solicitação: ${event.requestedDecision}`;
    item.append(title, summary, metadata);
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
      data: values.get('data'),
      env: values.get('env'),
      autonomy: values.get('autonomy'),
      justification: values.get('justification')
    });
    form.reset();
    render();
    formFeedback.textContent = `${novo.id} cadastrado localmente. Use a seção de auditoria para registrar a revisão humana simulada.`;
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
      justification: values.get('reviewJustification')
    });
    reviewForm.querySelector('[name="reviewJustification"]').value = '';
    renderAudit();
    if (auditEvent.result === 'bloqueada') {
      reviewFeedback.textContent = 'A tentativa foi registrada, mas a política impediu a aprovação deste cenário não autorizado.';
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
  downloadText('govsafe360-matriz.csv', 'text/csv;charset=utf-8', globalThis.GOVSAFE_AUDIT.gerarCsv(allScenarios(), decisionFor, auditRepository.carregar()));
});

document.getElementById('export-json').addEventListener('click', () => {
  downloadText('govsafe360-auditoria.json', 'application/json;charset=utf-8', globalThis.GOVSAFE_AUDIT.gerarJson(auditRepository.carregar()));
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
console.info('GOVSAFE 360 · Marco 6 carregado com histórico Git local e validações de qualidade.');
