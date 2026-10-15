import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'public');
const files = [
  'index.html',
  'css/styles.css',
  'js/politica.js',
  'js/cenarios.js',
  'js/auditoria.js',
  'js/app.js'
];

if (!output.startsWith(`${root}\\`) && !output.startsWith(`${root}/`)) {
  throw new Error('Diretório de saída inválido.');
}

await rm(output, { recursive: true, force: true });

for (const relativePath of files) {
  const destination = resolve(output, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, relativePath), destination);
}

console.log(`Build estático criado em public/ com ${files.length} arquivos.`);
