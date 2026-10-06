# MC JVILA — Site Oficial

Experiência digital cinematográfica para MC JVILA, construída como uma narrativa única: intro chrome, hero 3D, lançamentos, discografia interativa, player visual, manifesto, galeria editorial, agenda e booking.

## Stack

- Next.js, React, TypeScript e Tailwind CSS
- Three.js, React Three Fiber e Drei para a cena do hero
- GSAP + ScrollTrigger para animações espaciais de scroll
- Lenis para smooth scroll
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

- Foto principal: coloque a fotografia oficial/licenciada em `public/images/artist/` e atualize as referências em `components/Experience.tsx`.
- Capas: atualmente são servidas pelo Spotify oEmbed. Para usar arquivos próprios/licenciados, salve em `public/images/releases/` e altere `image` em `data/releases.ts`.
- Galeria: salve em `public/images/gallery/` e atualize o array `gallery` no início de `components/Experience.tsx`.
- Músicas/previews: o player atual é o embed oficial do Spotify. Para áudio hospedado pelo artista, coloque arquivos licenciados em `public/audio/` e conecte-os em `components/Experience.tsx`.
- Vídeos: use `public/videos/`.
- Modelos 3D: use `public/models/`.
- Logo: substitua as camadas tipográficas de `components/three/ChromeLogo.tsx` por um modelo GLB/GLTF, se houver um logo 3D oficial.
- Favicon: `public/favicon.svg`.

O asset `hero-placeholder-final.webp` é uma imagem original, anônima e provisória gerada para esta primeira versão. Ele não representa nem imita o artista.

O Instagram público não oferece o feed completo sem autenticação/OEmbed autorizado. Por isso o site aponta para o perfil oficial e mantém placeholders na galeria em vez de copiar fotografias protegidas. Substitua-os por arquivos oficiais/licenciados quando disponíveis.

## Three.js e performance

A cena está separada em:

- `HeroScene.tsx`: Canvas, luzes e Environment procedural.
- `ChromeLogo.tsx`: logotipo multicamada com profundidade e material metálico.
- `Particles.tsx`: campo de partículas leve.
- `CameraRig.tsx`: câmera reativa ao ponteiro.

O Canvas limita DPR, reduz partículas no mobile e abaixa qualidade quando detecta queda de performance. `prefers-reduced-motion` remove movimentos intensos, smooth scroll e partículas dispensáveis.

Para reduzir efeitos 3D ainda mais, diminua `count` em `HeroScene.tsx`, limite `dpr` a `1`, remova um dos spotlights ou substitua o Canvas por uma imagem estática no mobile.

## Deploy

O projeto está configurado para Sites por meio de `.openai/hosting.json`. Para outros provedores compatíveis com Next.js, use o fluxo de build recomendado pelo provedor.

## Open Graph

Os metadados de texto estão configurados em `app/layout.tsx`. Uma imagem social não é exigida para o build. Quando existir uma arte oficial/licenciada, salve-a em `public/og.jpg` e adicione sua referência nos blocos `openGraph.images` e `twitter.images`.
