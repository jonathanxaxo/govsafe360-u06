# M9 — Validação formal

## Objetivo

Validar o GOVSAFE 360 contra os requisitos, critérios de aceite, controles de acessibilidade, responsividade, segurança básica, funcionamento offline e evidências dos marcos anteriores. O M9 não autoriza produção e não altera as regras de governança.

## Comandos reproduzíveis

```powershell
npm run quality
node scripts/servidor-local.mjs
```

A inspeção visual deve ser feita em `http://127.0.0.1:4173`, inclusive com viewport de 390 px.

## Matriz de aceite

| Critério | Validação | Resultado esperado |
|---|---|---|
| CA01 | Dashboard inicial | 8 cenários e totais coerentes |
| CA02–CA05 | Motor de decisão | Regras conservadoras aprovadas |
| CA06 | Cadastro local | Persistência após recarregar |
| CA07 | Revisão humana | Justificativa obrigatória e bloqueio de aprovação proibida |
| CA08 | Exportações | CSV e JSON estruturados |
| CA09 | Operação local | Recursos locais e console sem erros |
| CA10 | Viewport de 390 px | Sem rolagem horizontal global; tabela com rolagem interna |
| CA11 | Controles reais | Restrições implementadas em código, configuração e permissões |

## Segurança e privacidade

- somente dados sintéticos;
- nenhuma chamada externa no código publicado;
- nenhum segredo ou variável de ambiente necessário;
- cabeçalhos de segurança declarados em `vercel.json`;
- workflow com permissão mínima e sem persistência de credencial;
- Produção reservada ao M10 e condicionada a autorização específica.

## Evidência operacional

Execução realizada em 16/10/2026:

- `npm run quality`: aprovado;
- build estático: 6 arquivos gerados e sincronizados;
- política: 10 decisões e 1 validação de taxonomia aprovadas;
- cenários: cadastro, persistência, busca, filtros, estado vazio e validações aprovados;
- auditoria: revisão, bloqueio conservador, CSV, JSON e reversão aprovados;
- qualidade estática: 20 controles aprovados;
- rastreabilidade M9: R01–R10 e CA01–CA11 presentes e associados às evidências;
- dashboard no navegador: 8 cenários, sendo 1 permitido, 3 condicionados e 4 não autorizados;
- busca por `token`: 1 de 8; limpeza da busca: 8 de 8;
- viewport testado: 390 px;
- largura do documento: 375 px, sem rolagem horizontal global;
- tabela: 315 px de área visível e 880 px de conteúdo, com `overflow-x: auto` restrito ao componente;
- acessibilidade estrutural: nenhum controle de formulário sem rótulo, três regiões vivas, link de salto e aviso semântico presentes;
- console: zero erro e zero aviso durante a validação;
- Produção: não executada e não autorizada neste marco.

**Resultado:** M9 aprovado localmente. O M10 permanece pendente de autorização específica.

## Reversão

Reverter o commit específico do M9. A reversão remove apenas a documentação, o teste formal e os rótulos deste marco; não reescreve histórico, não altera dados locais do usuário e não promove nenhuma implantação.
