# M5 — Testes, qualidade e evidências

## Escopo

Este marco valida o GOVSAFE 360 construído nos marcos M1 a M4. Ele não altera a política de governança, não cria integração externa e não usa dados reais.

## Validações automatizadas

Execute na raiz do projeto:

```powershell
npm run quality
```

A rotina abrange:

1. sintaxe JavaScript;
2. motor de decisão e taxonomia;
3. cadastro, persistência local, busca e filtros;
4. revisão humana simulada, bloqueio conservador, auditoria e exportações;
5. HTML sem identificadores duplicados;
6. recursos CSS e JavaScript exclusivamente locais;
7. ausência de chamadas de rede no código publicado;
8. controles essenciais de acessibilidade;
9. regra responsiva e rolagem interna da tabela;
10. oito cenários iniciais e aviso ostensivo de protótipo;
11. limites locais de cenários e auditoria;
12. busca por padrões evidentes de chaves privadas, tokens e credenciais.

## Evidências funcionais previstas

| Critério | Evidência esperada |
|---|---|
| CA01 | Oito cenários e totais coerentes no dashboard |
| CA02–CA05 | Testes do motor de decisão aprovados |
| CA06 | Cadastro sintético persiste após recarregar |
| CA07 | Justificativa obrigatória e aprovação proibida bloqueada |
| CA08 | CSV e JSON com estrutura validada |
| CA09 | Aplicação funciona com arquivos locais e sem erros no console |
| CA10 | Interface cabe em 390 px; tabela rola dentro de `.table-wrap` |
| CA11 | Controles implementados na aplicação e nas permissões reais |

## Resultado executado em 15/10/2026

- `npm run quality`: aprovado;
- sintaxe: aprovada;
- política: 10 decisões e 1 validação de taxonomia aprovadas;
- cenários: cadastro, persistência, busca, filtros, estado vazio e validações aprovados;
- auditoria: revisão, bloqueio conservador, CSV, JSON e reversão aprovados;
- qualidade estática: 20 controles aprovados;
- dashboard: 8 cenários, sendo 1 permitido, 3 condicionados e 4 não autorizados;
- busca por “token”: 1 de 8 cenários exibido;
- viewport de 390 px: largura do documento em 375 px, sem rolagem horizontal global;
- tabela em 390 px: rolagem horizontal restrita ao componente `.table-wrap`;
- console do navegador: zero erros.

## Nota de numeração

O backlog estendido original denomina “M5” o futuro MCP local. Nesta execução foi preservado o plano explicitamente autorizado pelo usuário, no qual M5 significa “testes, qualidade e evidências”. O MCP não foi antecipado e permanece pendente de autorização própria.

## Reversão

Para reverter somente o M5, remova `scripts/testar-qualidade.mjs` e `docs/EVIDENCIAS_M5.md`, retire `test:quality` de `package.json` e restaure os rótulos visuais do Marco 4. Os dados locais e a política permanecem independentes dessas alterações.

## Limites preservados

- somente dados fictícios;
- sem instalação de dependências;
- sem commit, push, deploy ou envio ao Moodle;
- sem conexão com sistemas institucionais;
- sem autenticação, banco compartilhado ou autorização institucional real.
