import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const ler = (caminho) => readFile(new URL(caminho, root), 'utf8');

const [requisitos, criterios, mapa, validacaoM9, vercel, workflow, readme] = await Promise.all([
  ler('docs/REQUISITOS.md'),
  ler('docs/CRITERIOS_ACEITE.md'),
  ler('docs/MAPA_REQUISITOS_TESTES.md'),
  ler('docs/VALIDACAO_M9.md'),
  ler('vercel.json'),
  ler('.github/workflows/qualidade.yml'),
  ler('README.md')
]);

for (let numero = 1; numero <= 10; numero += 1) {
  const id = `R${String(numero).padStart(2, '0')}`;
  assert.match(requisitos, new RegExp(`^${id}\\b`, 'm'), `${id} deve existir nos requisitos`);
  assert.match(mapa, new RegExp(`\\| ${id}\\b`), `${id} deve possuir evidência na matriz`);
}

for (let numero = 1; numero <= 11; numero += 1) {
  const id = `CA${String(numero).padStart(2, '0')}`;
  assert.match(criterios, new RegExp(`^${id}:`, 'm'), `${id} deve existir nos critérios de aceite`);
}

assert.match(validacaoM9, /Produção: não executada e não autorizada neste marco/);
assert.match(validacaoM9, /M10 permanece pendente de autorização específica/);
assert.match(readme, /docs\/VALIDACAO_M9\.md/);

const configuracaoVercel = JSON.parse(vercel);
const cabecalhos = new Map(configuracaoVercel.headers[0].headers.map(({ key, value }) => [key, value]));
for (const nome of ['Content-Security-Policy', 'Referrer-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Permissions-Policy']) {
  assert.ok(cabecalhos.has(nome), `cabeçalho ${nome} deve estar configurado`);
}
assert.match(cabecalhos.get('Content-Security-Policy'), /connect-src 'none'/);
assert.equal(cabecalhos.get('X-Frame-Options'), 'DENY');

assert.match(workflow, /^permissions:\s*\n\s+contents: read$/m);
assert.match(workflow, /persist-credentials: false/);
assert.match(workflow, /npm run quality/);

console.log('PASS: M9 possui rastreabilidade R01–R10, CA01–CA11, controles de publicação e CI com privilégio mínimo.');
