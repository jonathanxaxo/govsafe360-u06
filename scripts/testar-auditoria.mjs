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
  justification: 'Revisão simulada com controles prévios.'
});
assert.equal(aprovado.result, 'aprovado');

const proibido = { id: 'S03', title: 'Credencial fictícia' };
const decisaoProibida = globalThis.GOVSAFE_POLICY.avaliar({ dados: 'Credencial', ambiente: 'Desenvolvimento', autonomia: 'Execução' });
const bloqueado = repo.registrarRevisao({
  scenario: proibido,
  policyDecision: decisaoProibida,
  humanDecision: 'aprovado',
  justification: 'Tentativa simulada que deve permanecer bloqueada.'
});
assert.equal(bloqueado.result, 'bloqueada');
assert.equal(repo.carregar().length, 2);
assert.throws(
  () => repo.registrarRevisao({ scenario: condicionado, policyDecision: decisaoCondicionada, humanDecision: 'rejeitado', justification: '' }),
  /Justificativa é obrigatória/
);

const csv = globalThis.GOVSAFE_AUDIT.gerarCsv([
  { ...condicionado, data: 'Interno', env: 'Homologação', autonomy: 'Proposta' }
], () => decisaoCondicionada, repo.carregar());
assert.match(csv, /"ID";"Finalidade"/);
assert.match(csv, /"S02";"Planilha interna fictícia"/);
assert.match(csv, /"aprovado"/);

const json = JSON.parse(globalThis.GOVSAFE_AUDIT.gerarJson(repo.carregar()));
assert.equal(json.schema, 'govsafe360-auditoria-v1');
assert.equal(json.events.length, 2);

repo.limpar();
assert.deepEqual(repo.carregar(), []);
console.log('PASS: revisão, bloqueio conservador, auditoria, CSV, JSON e reversão verificados.');
