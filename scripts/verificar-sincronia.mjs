import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'index.html',
  'css/styles.css',
  'js/politica.js',
  'js/cenarios.js',
  'js/auditoria.js',
  'js/app.js'
];

for (const relativePath of files) {
  const source = await readFile(resolve(root, relativePath));
  const published = await readFile(resolve(root, 'public', relativePath));

  if (!source.equals(published)) {
    throw new Error(`Arquivo divergente: ${relativePath}. Execute npm run build.`);
  }

  console.log(`OK: ${relativePath}`);
}

console.log(`Sincronia aprovada para ${files.length} arquivos.`);
