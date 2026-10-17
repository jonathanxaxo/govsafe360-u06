# NexoGov IA · Laboratório didático de governança responsável

Identidade visual autoral do projeto acadêmico GOVSAFE 360, preservando o motor determinístico, a rastreabilidade e todos os controles construídos nos marcos do curso.

Protótipo de governança com dados 100% inventados; **não é política institucional homologada**. Site estático, HTML/CSS/JavaScript sem backend, autenticação, banco remoto ou cobrança. Quando publicado na Vercel, o **código do site é acessível pela URL**; cada navegador mantém seu `localStorage` local e separado.

## Situação atual — Marco 10

O projeto foi construído progressivamente nos marcos autorizados e atualmente possui:

- dashboard e navegação;
- oito cenários fictícios;
- motor determinístico de governança;
- cadastro local, busca e filtros;
- revisão humana simulada;
- auditoria e exportações CSV/JSON;
- testes automatizados de qualidade;
- histórico Git local;
- repositório GitHub e integração contínua.
- build estático e Preview protegido na Vercel;
- validação formal de requisitos, critérios de aceite, responsividade, acessibilidade e segurança básica.
- publicação de produção autorizada e validada na Vercel.

Para validar a versão atual:

```powershell
npm run quality
```

Consulte também `docs/CRITERIOS_ACEITE.md`, `docs/EVIDENCIAS_M5.md`, `docs/HISTORICO_GIT_M6.md`, `docs/GITHUB_CI_M7.md`, `docs/VERCEL_PREVIEW_M8.md`, `docs/VALIDACAO_M9.md` e `docs/PRODUCAO_M10.md`.

## Usar offline

Extraia a pasta, abra `index.html` no navegador, teste oito cenários, crie um cenário fictício, filtre, registre revisão simulada e exporte CSV/JSON. Não é necessária conta externa para testar a interface local.

## Trabalhar com Claude e publicar

Git local instalado previamente, Node >=20.11 e conta GitHub/Vercel são pré-requisitos da aula completa. No Claude Code, leia `CLAUDE.md`, `docs/REQUISITOS.md`, `docs/REGRAS_GOVERNANCA.md` e `README_PUBLICACAO.md`.

O Claude **pode sugerir e executar** operações Git, npm, Vercel e navegador quando autorizado. Não recebe credenciais por prompt. Envie o repositório ao GitHub com aprovação, execute `npm run quality` e valide uma implantação Preview. A publicação em produção foi executada no M10 após autorização específica e permanece sujeita a revisão, CI e possibilidade de reversão.

Os arquivos-fonte são `index.html`, `css/styles.css`, `js/app.js` e `js/politica.js`. A pasta `public/` é cópia gerada por `npm run build`. Não altere `public/` diretamente. O MCP local **não** será implantado pela Vercel.

## Testar

Os testes já consolidados até o Marco 7 são executados sem dependências externas:

```powershell
npm run quality
```

O material original do curso também prevê a sequência `npm run build`, `npm run check:sync`, `npm run test:policy` e `npm run test:mcp` quando esses componentes estiverem disponíveis nos marcos correspondentes.

A validação automatizada não exige instalação de dependências. Para a inspeção visual, execute `npm run build`, inicie `node scripts/servidor-local.mjs` e abra `http://127.0.0.1:4173`. Os roteiros formais estão em `docs/VALIDACAO_M9.md` e `docs/PRODUCAO_M10.md`.

## Evidências finais do Piloto IA 06

Os dois prints solicitados na atividade final estão organizados em [`docs/EVIDENCIAS_PILOTO_IA_06.md`](docs/EVIDENCIAS_PILOTO_IA_06.md), com visualizações desktop e móvel da aplicação publicada.

## Privacidade

Somente cenários fictícios. Nunca copie `.env`, tokens, documentos institucionais, cidadãos ou capturas de autenticação. Não há sincronização de dados entre visitantes do site.
