# MC JVILA — Site Oficial

Experiência digital cinematográfica para MC JVILA, construída como uma narrativa única: intro chrome, hero 3D, lançamentos, discografia interativa, player visual, manifesto, galeria editorial, agenda e booking.

## Stack

- Next.js, React, TypeScript e Tailwind CSS
- Hero chrome em CSS com fotografia oficial remota e movimento leve
- IntersectionObserver e `requestAnimationFrame` apenas onde necessário
- Lucide para controles essenciais

## Rodando localmente

```bash
npm install
npm run dev
```

Para validar produção:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Conteúdo centralizado

- `data/artist.ts`: nome, Instagram, Spotify, YouTube, TikTok, WhatsApp e e-mail de booking.
- `data/releases.ts`: lançamentos, capas oficiais via Spotify, embeds e links de streaming.
- `data/shows.ts`: agenda pesquisada em páginas públicas de venda/produção. Confirme periodicamente eventuais alterações ou cancelamentos.

URLs não ficam espalhadas nos componentes. Quando um link ainda está vazio, a interface exibe “em breve” e não inventa um destino.

## Substituindo os assets provisórios

- Foto principal: o hero usa o retrato publicado no perfil oficial do artista na GR6. Para produção definitiva, substitua por um arquivo original/licenciado em `public/images/artist/`.
- Capas: atualmente são servidas pelo Spotify oEmbed. Para usar arquivos próprios/licenciados, salve em `public/images/releases/` e altere `image` em `data/releases.ts`.
- Galeria: usa registros públicos do projeto “30 por 30” e miniaturas do canal oficial no YouTube. Para produção definitiva, substitua por arquivos originais/licenciados no array `gallery` de `components/Experience.tsx`.
- Músicas/previews: o player atual é o embed oficial do Spotify. Para áudio hospedado pelo artista, coloque arquivos licenciados em `public/audio/` e conecte-os em `components/Experience.tsx`.
- Vídeos: use `public/videos/`.
- Logo: a marca chrome é composta em CSS; substitua o texto em `components/Experience.tsx` se houver um logo oficial.
- Favicon: `public/favicon.svg`.

As imagens editoriais remotas continuam protegidas por direitos autorais de suas fontes. O Instagram público não oferece o feed completo sem autenticação/OEmbed autorizado; por isso o site aponta para o perfil oficial e utiliza apenas registros cuja identidade e página de origem puderam ser verificadas. Substitua-os pelos arquivos oficiais licenciados quando disponíveis.

## Hero e performance

O hero usa fotografia otimizada, tipografia chrome em CSS e uma transformação de scroll controlada por um único `requestAnimationFrame`. Não há Canvas/WebGL contínuo na home. O restante das entradas usa `IntersectionObserver`, e `prefers-reduced-motion` remove movimentos dispensáveis. A intro também é curta e não se repete na mesma sessão.

## Deploy

O projeto está configurado para Sites por meio de `.openai/hosting.json`. Para outros provedores compatíveis com Next.js, use o fluxo de build recomendado pelo provedor.

## Open Graph

Os metadados de texto estão configurados em `app/layout.tsx`. Uma imagem social não é exigida para o build. Quando existir uma arte oficial/licenciada, salve-a em `public/og.jpg` e adicione sua referência nos blocos `openGraph.images` e `twitter.images`.
