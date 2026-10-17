import assert from 'node:assert/strict';
import '../js/politica.js';

const casos = [
  ['público em desenvolvimento para leitura', 'permitido', { dados: 'Público', ambiente: 'Desenvolvimento', autonomia: 'Leitura' }],
  ['público em desenvolvimento para proposta', 'permitido', { dados: 'publico', ambiente: 'desenvolvimento', autonomia: 'proposta' }],
  ['interno exige condições', 'condicionado', { dados: 'interno', ambiente: 'desenvolvimento', autonomia: 'leitura' }],
  ['homologação exige condições', 'condicionado', { dados: 'publico', ambiente: 'homologacao', autonomia: 'proposta' }],
  ['execução fora de produção exige condições', 'condicionado', { dados: 'publico', ambiente: 'desenvolvimento', autonomia: 'execucao' }],
  ['credencial não é autorizada', 'nao-autorizado', { dados: 'credencial', ambiente: 'desenvolvimento', autonomia: 'leitura' }],
  ['dado pessoal não é autorizado', 'nao-autorizado', { dados: 'pessoal', ambiente: 'homologacao', autonomia: 'proposta' }],
  ['execução em produção não é autorizada', 'nao-autorizado', { dados: 'interno', ambiente: 'producao', autonomia: 'execucao' }],
  ['leitura em produção exige condições', 'condicionado', { dados: 'publico', ambiente: 'producao', autonomia: 'leitura' }],
  ['autonomia crítica não é autorizada', 'nao-autorizado', { dados: 'publico', ambiente: 'desenvolvimento', autonomia: 'critica' }]
];

for (const [descricao, esperado, entrada] of casos) {
  const obtido = globalThis.GOVSAFE_POLICY.avaliar(entrada);
  assert.equal(obtido.status, esperado, descricao);
  assert.match(obtido.regra, /^R[1-5]$/, `${descricao}: deve informar a regra aplicada`);
  assert.ok(obtido.motivo.length > 20, `${descricao}: deve explicar a decisão`);
  assert.match(obtido.risco, /^(Baixo|Moderado|Alto|Crítico)$/, `${descricao}: deve informar o nível de risco`);
  assert.ok(Array.isArray(obtido.controles) && obtido.controles.length >= 3, `${descricao}: deve informar controles aplicáveis`);
}

assert.throws(
  () => globalThis.GOVSAFE_POLICY.avaliar({ dados: 'secreto', ambiente: 'desenvolvimento', autonomia: 'leitura' }),
  /Tipo de dado inválido/,
  'valores fora da taxonomia devem ser rejeitados'
);

console.log(`PASS: ${casos.length} decisões e 1 validação de taxonomia verificadas.`);
