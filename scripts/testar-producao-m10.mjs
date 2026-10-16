import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const ler = (caminho) => readFile(new URL(caminho, root), 'utf8');

const [html, readme, producao, mapa, vercel] = await Promise.all([
  ler('index.html'),
  ler('README.md'),
  ler('docs/PRODUCAO_M10.md'),
  ler('docs/MAPA_REQUISITOS_TESTES.md'),
  ler('vercel.json')
]);

assert.match(html, /<title>GOVSAFE 360 · Marco 10<\/title>/);
assert.match(html, /Marco 10 · Produção validada/);
assert.match(html, /M10 concluído: produção publicada após autorização específica/);
assert.match(readme, /Situação atual — Marco 10/);
assert.match(readme, /docs\/PRODUCAO_M10\.md/);
assert.match(producao, /https:\/\/govsafe360-u06-blush\.vercel\.app\//);
assert.match(producao, /produção autorizada, publicada e validada/);
assert.match(mapa, /\| Publicação em produção \|/);

const configuracaoVercel = JSON.parse(vercel);
const cabecalhos = new Map(configuracaoVercel.headers[0].headers.map(({ key, value }) => [key, value]));
assert.match(cabecalhos.get('Content-Security-Policy'), /connect-src 'none'/);
assert.equal(cabecalhos.get('X-Frame-Options'), 'DENY');

console.log('PASS: M10 documenta e valida a publicação autorizada em produção sem alterar as regras de governança.');
