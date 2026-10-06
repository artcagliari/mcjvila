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
- `data/releases.ts`: lançamentos, capas, anos e links de streaming.
- `data/shows.ts`: agenda. O arquivo possui um comentário indicando onde substituir os dados provisórios.

URLs não ficam espalhadas nos componentes. Quando um link ainda está vazio, a interface exibe “em breve” e não inventa um destino.

## Substituindo os assets provisórios

- Foto principal: coloque a fotografia oficial/licenciada em `public/images/artist/` e atualize as referências em `components/Experience.tsx`.
- Capas: salve em `public/images/releases/` e altere `image` em `data/releases.ts`.
- Galeria: salve em `public/images/gallery/` e atualize o array `gallery` no início de `components/Experience.tsx`.
- Músicas/previews: coloque em `public/audio/` e conecte o player em `components/Experience.tsx`. Sem áudio oficial, o player atual usa uma visualização simulada e honesta.
- Vídeos: use `public/videos/`.
- Modelos 3D: use `public/models/`.
- Logo: substitua as camadas tipográficas de `components/three/ChromeLogo.tsx` por um modelo GLB/GLTF, se houver um logo 3D oficial.
- Favicon: `public/favicon.svg`.

O asset `hero-placeholder-final.webp` é uma imagem original, anônima e provisória gerada para esta primeira versão. Ele não representa nem imita o artista.

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
