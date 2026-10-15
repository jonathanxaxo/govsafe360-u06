# M7 — GitHub e integração contínua

## Repositório

Destino autorizado: `jonathanxaxo/govsafe360-u06`.

O repositório remoto já existia com um commit inicial e um `README.md`. O histórico remoto deve ser incorporado ao histórico local; não deve ser sobrescrito por força.

## Workflow

Arquivo: `.github/workflows/qualidade.yml`.

O workflow é executado em:

- push para `main`;
- pull request direcionado para `main`;
- acionamento manual.

Controles:

- permissão mínima `contents: read`;
- credencial do checkout não persiste no ambiente;
- Node.js 22;
- tempo máximo de cinco minutos;
- cancelamento de execução anterior concorrente;
- execução de `npm run quality` sem instalação de dependências.

## Aceite

1. histórico remoto preservado;
2. branch `main` sincronizada;
3. árvore local limpa;
4. workflow `Qualidade` concluído com sucesso no GitHub Actions;
5. nenhum segredo versionado;
6. nenhum deploy executado.

## Reversão

Se o workflow falhar, corrigir em novo commit. Não reescrever `main` e não usar push forçado. Para remover o workflow futuramente, criar commit específico removendo `.github/workflows/qualidade.yml`.
