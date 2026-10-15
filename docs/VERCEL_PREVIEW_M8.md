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
