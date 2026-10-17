# Rastreabilidade requisito → implementação → teste

| Requisito | Código/fonte | Evidência |
|---|---|---|
| R01 Dashboard | `index.html`, `js/app.js` | `test:scenarios`, `test:quality` e validação visual M9 |
| R02 Formulário completo | `index.html`, `js/app.js` | `test:scenarios` e validação funcional M9 |
| R03 Motor conservador e explicável | `js/politica.js` | `test:policy` |
| R04 Revisão humana simulada | `js/app.js`, `js/auditoria.js` | `test:audit` |
| R05 Histórico auditável local | `js/auditoria.js` | `test:audit` |
| R06 Exportações CSV e JSON | `js/auditoria.js` | `test:audit` |
| R07 Responsividade e acessibilidade | `index.html`, `css/styles.css` | `test:quality` e inspeção em 390 px no M9 |
| R08 Funcionamento offline | fontes locais e `scripts/*` | `test:quality`, `build` e `check:sync` |
| R09 Oito cenários sintéticos | `js/app.js` | `test:scenarios` e `test:quality` |
| R10 Aviso ostensivo de protótipo | `index.html` | `test:quality` e validação visual M9 |
| R11 Cadastro institucional demonstrativo | `index.html`, `js/cenarios.js`, `js/app.js` | `test:scenarios`, `test:quality` e validação visual M11 |
| R12 Risco e controles explicáveis | `js/politica.js`, `js/app.js` | `test:policy` e validação funcional M11 |
| R13 Revisão condicionada aos controles | `js/auditoria.js`, `js/app.js` | `test:audit` |
| R14 Exportações institucionais enriquecidas | `js/auditoria.js` | `test:audit` |
| R15 Compatibilidade de registros locais | `js/cenarios.js` | `test:scenarios` |
| Publicação Preview | `scripts/*`, `vercel.json` | `build`, `check:sync` e evidência M8 |
| Publicação em produção | `vercel.json`, `docs/PRODUCAO_M10.md` | `test:m10`, CI e validação visual M10 |
| Integração contínua | `.github/workflows/qualidade.yml` | GitHub Actions aprovado no M7/M8 |

Relatórios: `docs/EVIDENCIAS_M5.md`, `docs/VERCEL_PREVIEW_M8.md`, `docs/VALIDACAO_M9.md`, `docs/PRODUCAO_M10.md` e `docs/MARCO_11_FLUXO_INSTITUCIONAL.md`. Rotina completa: `npm run quality`.
