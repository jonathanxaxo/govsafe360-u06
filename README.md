# GOVSAFE 360 v15 · Laboratório didático SEMA/MT

Protótipo de governança com dados 100% inventados; **não é política institucional homologada**. Site estático, HTML/CSS/JavaScript sem backend, autenticação, banco remoto ou cobrança. Quando publicado na Vercel, o **código do site é acessível pela URL**; cada navegador mantém seu `localStorage` local e separado.

## Usar offline
Extraia a pasta, abra `index.html` no navegador, teste oito cenários, crie um cenário fictício, filtre, registre revisão simulada e exporte CSV/JSON. Não é necessária conta externa para testar a interface local.

## Trabalhar com Claude e publicar
Git local instalado previamente, Node >=20.11 e conta GitHub/Vercel são pré-requisitos da aula completa. No Claude Code, leia `CLAUDE.md`, `docs/REQUISITOS.md`, `docs/REGRAS_GOVERNANCA.md` e `README_PUBLICACAO.md`.

O Claude **pode sugerir e executar** operações Git, npm, Vercel e Playwright quando autorizado. Não recebe credenciais por prompt. Envie repositório ao GitHub com aprovação, execute `npm run build` e `npm run check:sync`, importe na Vercel, e **teste a URL de produção ANTES** de abrir nova branch de melhoria.

Os arquivos-fonte são `index.html`, `css/styles.css`, `js/app.js`, `js/politica.js`. A pasta `public/` é cópia gerada por `npm run build`. Não altere `public/` diretamente. O MCP local **não** será implantado pela Vercel.

## Testar
Sem dependências: `npm run build && npm run check:sync && npm run test:policy && npm run test:mcp` (no Windows PowerShell, execute em linhas distintas).

Playwright Test: `npm install`; `npx playwright install chromium`; `node scripts/servidor-local.mjs` num terminal; `$env:SITE_URL='http://127.0.0.1:4173'` e `npm run test:e2e` no segundo. Para Vercel, substitua SITE_URL pela URL REAL. Vídeos e screenshots são gerados somente quando os testes de navegador são executados.

## Privacidade
Somente cenários fictícios. Nunca copie `.env`, tokens, documentos institucionais, cidadãos ou capturas de autenticação. Não há sincronização de dados entre visitantes do site.
