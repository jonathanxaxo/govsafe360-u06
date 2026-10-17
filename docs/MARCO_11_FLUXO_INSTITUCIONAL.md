# Marco 11 — Fluxo institucional realista demonstrativo

## Objetivo

Demonstrar ao professor como uma demanda de inteligência artificial poderia percorrer um fluxo institucional completo, sem utilizar dados pessoais, documentos restritos, credenciais ou informações reais.

## Fluxo representado

1. Cadastro da demanda, unidade, função responsável e processo de trabalho.
2. Identificação da fonte, classificação dos dados, ambiente e autonomia.
3. Registro do impacto, revisão humana, prazo, justificativa e controles existentes.
4. Aplicação determinística das regras didáticas R1–R5.
5. Apresentação do nível de risco, decisão, justificativa e controles obrigatórios.
6. Revisão humana com função do revisor, confirmação dos controles e providências.
7. Registro auditável local e exportação de relatório CSV/JSON.

## Regras preservadas

- Credenciais, dados pessoais e autonomia crítica permanecem não autorizados.
- Edição ou execução em produção permanece não autorizada.
- Uso em produção para leitura ou proposta permanece condicionado.
- Dados internos, externos, homologação, edição ou execução permanecem condicionados.
- Apenas dados públicos em desenvolvimento, para leitura ou proposta, podem receber a classificação didática Permitido.

## Aperfeiçoamentos

- Risco Baixo, Moderado, Alto ou Crítico informado em cada resultado.
- Pelo menos três controles recomendados por regra.
- Demanda condicionada não pode ser aprovada sem confirmação dos controles.
- Exportação CSV inclui contexto institucional, risco e controles.
- Auditoria JSON usa o esquema `nexogov-auditoria-v2`.
- Registros antigos continuam compatíveis por meio de valores demonstrativos seguros.

## Limites

O NexoGov IA continua sendo um site estático acadêmico. Não possui autenticação, banco institucional, RBAC, API, auditoria imutável ou homologação. O armazenamento permanece restrito ao navegador e todos os exemplos são demonstrativos.

## Verificação

Executar `npm run quality` e realizar validação visual em desktop e viewport móvel. Confirmar cadastro, classificação, bloqueio conservador, filtros, revisão, exportações e ausência de erros no console.
