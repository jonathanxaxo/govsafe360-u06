import assert from 'node:assert/strict';
import '../js/politica.js';
import '../js/cenarios.js';

function memoria() {
  const dados = new Map();
  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    removeItem: (chave) => dados.delete(chave)
  };
}

const storage = memoria();
const repo = globalThis.GOVSAFE_SCENARIOS.criarRepositorio(storage);
const novo = repo.adicionar({
  title: 'Revisar indicador público fictício',
  data: 'Público',
  env: 'Desenvolvimento',
  autonomy: 'Proposta',
  justification: 'Exercício sintético para validar persistência local.'
});

assert.equal(novo.id, 'C001');
assert.equal(repo.carregar().length, 1, 'o cenário deve permanecer no armazenamento');
assert.equal(repo.carregar()[0].title, novo.title, 'o cenário recarregado deve manter os dados');

const amostra = [
  novo,
  globalThis.GOVSAFE_SCENARIOS.normalizarCenario({
    id: 'C002',
    title: 'Executar rotina interna simulada',
    data: 'Interno',
    env: 'Produção',
    autonomy: 'Execução',
    justification: 'Caso sintético restritivo.'
  })
];

assert.equal(globalThis.GOVSAFE_SCENARIOS.filtrar(amostra, { busca: 'indicador' }).length, 1);
assert.equal(globalThis.GOVSAFE_SCENARIOS.filtrar(amostra, { dados: 'interno' }).length, 1);
assert.equal(globalThis.GOVSAFE_SCENARIOS.filtrar(amostra, { status: 'nao-autorizado' }).length, 1);
assert.equal(globalThis.GOVSAFE_SCENARIOS.filtrar(amostra, { busca: 'inexistente' }).length, 0);
assert.throws(
  () => repo.adicionar({ title: '', data: 'Público', env: 'Desenvolvimento', autonomy: 'Leitura', justification: 'Teste' }),
  /Finalidade é obrigatório/
);

storage.setItem(globalThis.GOVSAFE_SCENARIOS.STORAGE_KEY, '{inválido');
assert.deepEqual(repo.carregar(), [], 'armazenamento inválido deve falhar de modo seguro');

repo.adicionar({
  title: 'Cenário temporário', data: 'Público', env: 'Desenvolvimento', autonomy: 'Leitura', justification: 'Teste de reversão local.'
});
repo.limpar();
assert.deepEqual(repo.carregar(), [], 'a reversão deve remover somente os cenários locais');

console.log('PASS: cadastro, persistência, busca, filtros, estado vazio e validações verificados.');
