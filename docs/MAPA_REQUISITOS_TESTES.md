# Rastreabilidade requisito → implementação → teste

| Requisito | Código/fonte | Evidência |
|---|---|---|
| REQ01 Dashboard | `index.html`, `js/app.js` | Testes de qualidade e validação visual M5 |
| REQ02 Busca | `js/app.js` | Teste 02 |
| REQ03 Filtro decisão | `js/app.js` | Teste 03 |
| REQ04 Cadastro e persistência | `js/app.js`, localStorage | Teste 04 |
| REQ05 Aprovação humana condicionada | `js/app.js`, `js/politica.js` | Teste 05 e política |
| REQ06 Exportações | `js/app.js` | Teste 06 |
| REQ07 Responsividade | `css/styles.css` | `test:quality` e viewport de 390 px |
| REQ08 Produção sem execução autônoma | `js/politica.js` | Teste 08 e paridade MCP |
| REQ09 Build Vercel | `scripts/*`, `vercel.json` | `npm run build`, `check:sync` |
| REQ10 CI | `.github/workflows/qualidade.yml` | Pendente de marco próprio; não implementado no M5 autorizado |

Relatório local: `docs/EVIDENCIAS_M5.md`. Rotina completa: `npm run quality`.
