# M10 — Publicação em produção

Data da autorização e execução: 16/10/2026.

## Objetivo

Publicar a versão validada do GOVSAFE 360 em produção somente após autorização específica, mantendo o caráter didático, os dados exclusivamente fictícios e os controles dos marcos anteriores.

## Evidências verificadas

- PR de validação M9 aprovada e mesclada sem conflitos.
- Três verificações do GitHub/Vercel aprovadas antes do merge.
- Branch de produção: `main`.
- Primeiro merge autorizado do M10: `0610d451ebbef85f52e77178e23c9766f54caf8d`.
- Projeto Vercel: `govsafe360-u06`.
- Domínio de produção: `https://govsafe360-u06-blush.vercel.app/`.
- Status da implantação: `Ready`.
- Oito cenários fictícios exibidos: 1 permitido, 3 exigem condições e 4 não autorizados.
- Busca por `token` validada e restaurada sem alterar dados.
- Navegação, aviso de protótipo, revisão e auditoria local presentes.
- `npm run quality` aprovado antes e depois do merge.

## Segurança e limites preservados

- Nenhum dado pessoal, credencial ou documento institucional foi publicado.
- O site permanece estático, sem backend, autenticação ou banco remoto.
- Dados cadastrados ficam somente no `localStorage` do navegador do visitante.
- Cabeçalhos de segurança continuam definidos em `vercel.json`.
- O motor de governança e as regras R1–R5 não foram alterados no M10.
- A chave temporária usada no M9 foi revogada no GitHub e removida do computador.

## Reversão

Em caso de falha, usar o recurso **Instant Rollback** da Vercel ou reverter o merge no GitHub, executar novamente `npm run quality` e validar o novo deploy antes de divulgá-lo.

**Resultado:** produção autorizada, publicada e validada. O M10 está concluído.
