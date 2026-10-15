# M6 — Git e histórico local

## Objetivo

Criar um histórico Git exclusivamente local e reproduzível para o GOVSAFE 360, sem GitHub, push, CI ou deploy.

## Controles aplicados

- branch principal: `main`;
- identidade Git configurada somente neste repositório;
- arquivos `.env`, segredos, dependências, artefatos da Vercel, relatórios temporários e logs excluídos pelo `.gitignore`;
- finais de linha normalizados por `.gitattributes`;
- `npm run quality` obrigatório antes do primeiro commit;
- busca por padrões evidentes de credenciais antes do commit;
- nenhuma conexão remota configurada neste marco.

## Verificação local

```powershell
git status --short
git log --oneline --decorate -5
git remote -v
```

O estado esperado após o marco é uma árvore limpa, um commit local na branch `main` e nenhuma saída em `git remote -v`.

## Como reverter sem apagar arquivos

Antes de qualquer push, o conteúdo pode ser retirado do histórico mantendo os arquivos no disco com:

```powershell
git reset --soft HEAD~1
```

Esse comando só deve ser usado conscientemente após conferir o commit e não foi executado durante o marco.

## Limites

O M6 não publica o código. GitHub, CI, Vercel Preview e produção continuam pendentes de autorizações próprias.
