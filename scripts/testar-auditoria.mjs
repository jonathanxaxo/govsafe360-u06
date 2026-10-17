import assert from 'node:assert/strict';
import '../js/politica.js';
import '../js/auditoria.js';

function memoria() {
  const dados = new Map();
  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    removeItem: (chave) => dados.delete(chave)
  };
}

const storage = memoria();
const repo = globalThis.GOVSAFE_AUDIT.criarRepositorio(storage, () => '2026-10-15T12:00:00.000Z');
const condicionado = { id: 'S02', title: 'Planilha interna fictícia' };
const decisaoCondicionada = globalThis.GOVSAFE_POLICY.avaliar({ dados: 'Interno', ambiente: 'Homologação', autonomia: 'Proposta' });
const aprovado = repo.registrarRevisao({
  scenario: condicionado,
  policyDecision: decisaoCondicionada,
  humanDecision: 'aprovado',
  justification: 'Revisão simulada com controles prévios.',
  reviewerRole: 'Gestor demonstrativo',
  controlsConfirmed: 'sim',
  pendingActions: 'Monitorar o uso e registrar evidências.'
});
assert.equal(aprovado.result, 'aprovado');
assert.equal(aprovado.controlsConfirmed, true);
assert.equal(aprovado.riskLevel, 'Moderado');

const proibido = { id: 'S03', title: 'Credencial fictícia' };
const decisaoProibida = globalThis.GOVSAFE_POLICY.avaliar({ dados: 'Credencial', ambiente: 'Desenvolvimento', autonomia: 'Execução' });
const bloqueado = repo.registrarRevisao({
  scenario: proibido,
  policyDecision: decisaoProibida,
  humanDecision: 'aprovado',
  justification: 'Tentativa simulada que deve permanecer bloqueada.',
  reviewerRole: 'Gestor demonstrativo',
  controlsConfirmed: 'sim',
  pendingActions: 'Interromper a solicitação.'
});
assert.equal(bloqueado.result, 'bloqueada');
assert.equal(repo.carregar().length, 2);
assert.throws(
  () => repo.registrarRevisao({ scenario: condicionado, policyDecision: decisaoCondicionada, humanDecision: 'rejeitado', justification: '' }),
  /Justificativa é obrigatória/
);

const csv = globalThis.GOVSAFE_AUDIT.gerarCsv([
  { ...condicionado, unit: 'Planejamento', process: 'Monitoramento', source: 'Painel interno', impact: 'Moderado', data: 'Interno', env: 'Homologação', autonomy: 'Proposta' }
], () => decisaoCondicionada, repo.carregar());
assert.match(csv, /"ID";"Demanda";"Unidade"/);
assert.match(csv, /"S02";"Planilha interna fictícia"/);
assert.match(csv, /"aprovado"/);

const json = JSON.parse(globalThis.GOVSAFE_AUDIT.gerarJson(repo.carregar()));
assert.equal(json.schema, 'nexogov-auditoria-v2');
assert.equal(json.events.length, 2);

const pendente = repo.registrarRevisao({
  scenario: condicionado,
  policyDecision: decisaoCondicionada,
  humanDecision: 'aprovado',
  justification: 'Tentativa sem confirmação dos controles.',
  reviewerRole: 'Gestor demonstrativo',
  controlsConfirmed: 'nao',
  pendingActions: 'Confirmar minimização e acesso restrito.'
});
assert.equal(pendente.result, 'bloqueada', 'demanda condicionada não pode ser aprovada sem controles confirmados');

repo.limpar();
assert.deepEqual(repo.carregar(), []);
console.log('PASS: revisão, controles, bloqueio conservador, auditoria, CSV, JSON e reversão verificados.');
