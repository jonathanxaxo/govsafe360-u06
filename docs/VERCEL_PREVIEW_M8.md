# M8 — Vercel Preview

## Escopo

Preparar e validar uma implantação de Preview do site estático GOVSAFE 360. Este marco não autoriza promoção para produção.

## Arquitetura de publicação

- fontes: `index.html`, `css/styles.css` e quatro arquivos em `js/`;
- build: `scripts/sincronizar-publicacao.mjs`;
- verificação: `scripts/verificar-sincronia.mjs`;
- saída gerada: `public/`;
- plataforma: Vercel;
- dados: exclusivamente fictícios e armazenados no `localStorage` do navegador.

## Controles

- nenhuma variável de ambiente necessária;
- nenhuma credencial no código ou no build;
- nenhuma chamada de rede da aplicação;
- política de conteúdo restrita à própria origem;
- bloqueio de enquadramento por terceiros;
- câmera, microfone e geolocalização desabilitados;
- Preview separado de produção.

## Critério de aceite

1. `npm run quality` aprovado;
2. GitHub Actions aprovado no commit do M8;
3. Preview criado a partir do repositório GitHub;
4. página e funções principais verificadas na URL de Preview;
5. cabeçalhos de segurança presentes;
6. nenhuma promoção para produção.

## Evidência operacional — 15/10/2026

- commit implantado: `5b50192046033ec1c6cea0af4aa4518c046fddba`;
- CI do GitHub Actions: execução `38779685397`, concluída com sucesso;
- implantação Vercel: `dpl_4vFqAAY47X2FSX5Lbg9zf4xfGvdS`;
- ambiente confirmado pela inspeção da Vercel: `preview`;
- estado confirmado: `Ready`;
- URL: `https://govsafe360-u06-45wvey0x3-projetos-jonathan.vercel.app`;
- validação visual: página do Marco 8 carregada com os oito cenários fictícios;
- validação funcional: busca por `token` retornou um cenário e a limpeza restaurou `8 de 8`;
- segurança: os cabeçalhos estão declarados em `vercel.json`, o Preview permaneceu protegido pela autenticação da Vercel e nenhum segredo foi incluído no repositório;
- produção: as implantações iniciais de produção foram removidas e a listagem final retornou zero implantação em produção.

O Preview não foi promovido para produção. A eventual publicação definitiva permanece reservada ao M10 e depende de autorização específica.
