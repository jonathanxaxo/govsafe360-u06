# Publicação controlada do GOVSAFE 360

## Pré-requisitos

- Node.js 20.11 ou superior;
- repositório GitHub sincronizado e workflow `Qualidade` aprovado;
- conta Vercel autorizada pelo usuário.

## Validação local

```powershell
npm run quality
```

O comando gera `public/`, confirma a igualdade binária dos seis arquivos publicados e executa todos os testes já existentes.

## Preview

1. importar `jonathanxaxo/govsafe360-u06` na Vercel;
2. manter `npm run build` como comando de build;
3. manter `public` como diretório de saída;
4. criar uma implantação Preview;
5. validar conteúdo fictício, navegação, filtros, cadastro, revisão, auditoria e exportação;
6. verificar os cabeçalhos de segurança definidos em `vercel.json`.

O Preview não deve ser promovido para produção durante o M8.

## Reversão

Excluir apenas a implantação Preview na Vercel ou desconectar o projeto, sem alterar a aplicação local. Se a configuração precisar ser revertida, criar um novo commit de reversão; não reescrever o histórico da `main`.
