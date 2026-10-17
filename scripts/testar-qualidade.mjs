import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const ler = (caminho) => readFile(new URL(caminho, root), 'utf8');

const [html, css, app, politica, cenarios, auditoria] = await Promise.all([
  ler('index.html'),
  ler('css/styles.css'),
  ler('js/app.js'),
  ler('js/politica.js'),
  ler('js/cenarios.js'),
  ler('js/auditoria.js')
]);

const documentos = [html, css, app, politica, cenarios, auditoria];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'os identificadores HTML devem ser únicos');

const scriptsLocais = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);
const estilosLocais = [...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(scriptsLocais, ['js/politica.js', 'js/cenarios.js', 'js/auditoria.js', 'js/app.js']);
assert.deepEqual(estilosLocais, ['css/styles.css']);
assert.ok([...scriptsLocais, ...estilosLocais].every((recurso) => !/^(?:https?:)?\/\//i.test(recurso)), 'recursos publicados devem ser locais');
assert.ok(!documentos.some((conteudo) => /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(conteudo)), 'a aplicação não deve realizar chamadas externas');

assert.match(html, /lang="pt-BR"/);
assert.match(html, /<meta name="viewport"/);
assert.match(html, /class="skip-link"/);
assert.match(html, /<main id="conteudo">/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /<th scope="col">/);
assert.match(html, /tabindex="0" aria-label="Tabela rolável/);
assert.match(css, /:focus-visible/);
assert.match(css, /@media \(max-width: 620px\)/);
assert.match(css, /\.table-wrap[^}]*overflow-x:\s*auto/s);

assert.equal([...app.matchAll(/\{ id: 'S\d{2}'/g)].length, 8, 'devem existir oito cenários iniciais');
assert.match(html, /Simulação de fluxo institucional com dados demonstrativos/);
assert.match(html, /não é um sistema institucional homologado/i);
assert.match(html, /dados demonstrativos/);
assert.match(html, /Unidade solicitante/);
assert.match(html, /Função do responsável/);
assert.match(html, /Impacto de eventual erro/);
assert.match(html, /Controles já existentes/);
assert.match(html, /Função do revisor/);
assert.match(app, /GOVSAFE_POLICY\.avaliar/);
assert.match(cenarios, /slice\(0, 100\)/);
assert.match(auditoria, /slice\(0, 500\)/);
assert.match(auditoria, /policyDecision\.status === 'nao-autorizado'/);
assert.match(politica, /Object\.freeze/);
assert.match(politica, /controles: Object\.freeze/);
assert.match(auditoria, /controlsConfirmed/);

const padroesSensiveis = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\b(?:api[_-]?key|secret|password)\s*[:=]\s*['"][^'"]{8,}['"]/i
];

const arquivos = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/politica.js',
  'js/cenarios.js',
  'js/auditoria.js',
  'package.json'
];
for (const arquivo of arquivos) {
  const conteudo = await ler(arquivo);
  for (const padrao of padroesSensiveis) {
    assert.ok(!padrao.test(conteudo), `${arquivo} não deve conter segredo aparente`);
  }
}

const raiz = new URL('.', root);
const entradas = await readdir(raiz);
assert.ok(!entradas.includes('.env'), 'arquivo .env não deve existir no projeto publicado');

console.log('PASS: 20 controles estáticos de qualidade, acessibilidade, funcionamento offline e segurança básica verificados.');
