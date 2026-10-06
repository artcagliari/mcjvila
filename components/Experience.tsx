"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Menu, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { artist, navigation } from "@/data/artist";
import { releases } from "@/data/releases";
import { shows } from "@/data/shows";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });
const gallery = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  src: "/images/artist/hero-placeholder-final.webp",
  alt: `Imagem editorial provisória ${String(index + 1).padStart(2, "0")} de MC JVILA`,
}));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function Preloader({ done, reduced }: { done: () => void; reduced: boolean }) {
  const [progress, setProgress] = useState(reduced ? 100 : 0);
  useEffect(() => {
    if (reduced) {
      const timeout = window.setTimeout(done, 120);
      return () => window.clearTimeout(timeout);
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.floor(((now - started) / 1900) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(done, 430);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done, reduced]);

  return (
    <div className={`preloader ${progress === 100 ? "is-complete" : ""}`} aria-label="Carregando experiência" aria-live="polite">
      <div className="preloader__flash" />
      <p className="preloader__logo" aria-hidden="true">JVILA</p>
      <div className="preloader__rail"><span style={{ width: `${progress}%` }} /></div>
      <p className="preloader__count">{String(progress).padStart(3, "0")}</p>
    </div>
  );
}

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    let x = -50;
    let y = -50;
    let tx = x;
    let ty = y;
    let frame = 0;
    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (dot.current) dot.current.dataset.mode = target?.dataset.cursor || "";
      if (label.current) label.current.textContent = target?.dataset.cursor || "";
    };
    const render = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(render);
    };
    window.addEventListener("mousemove", move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="cursor" ref={dot} aria-hidden="true"><span ref={label} /></div>;
}

function PlatformLinks({ links }: { links: (typeof releases)[number]["links"] }) {
  const items = [
    ["SPOTIFY", links.spotify],
    ["APPLE MUSIC", links.appleMusic],
    ["YOUTUBE", links.youtube],
  ] as const;
  return (
    <div className="platform-links">
      {items.map(([label, href]) => href ? (
        <a key={label} href={href} target="_blank" rel="noreferrer" data-cursor="OPEN">{label}</a>
      ) : <span key={label} aria-disabled="true" title="Link oficial será adicionado em breve">{label}</span>)}
    </div>
  );
}

function MusicPlayer({ active }: { active: number }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((value) => (value >= 99.6 ? 0 : value + 0.4)), 120);
    return () => window.clearInterval(timer);
  }, [playing]);
  const track = releases[active];
  const seconds = Math.floor((progress / 100) * 168);

  return (
    <div className="player" data-cursor={playing ? "PAUSE" : "PLAY"}>
      <button className="player__toggle" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pausar visualização" : "Reproduzir visualização"}>
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
      <div className="player__meta"><span>AGORA</span><strong>{track.title}</strong><small>{track.artist}</small></div>
      <div className={`waveform ${playing ? "is-playing" : ""}`} aria-hidden="true">
        {Array.from({ length: 32 }, (_, index) => <i key={index} style={{ "--bar": `${18 + ((index * 17) % 70)}%`, "--delay": `${index * -0.04}s` } as React.CSSProperties} />)}
      </div>
      <div className="player__timeline"><span style={{ width: `${progress}%` }} /></div>
      <time>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</time>
    </div>
  );
}

function Lightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (next: number) => void }) {
  const touch = useRef(0);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange((index + gallery.length - 1) % gallery.length);
      if (event.key === "ArrowRight") onChange((index + 1) % gallery.length);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, onChange, onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Galeria, imagem ${index + 1} de ${gallery.length}`} onTouchStart={(e) => { touch.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 45) onChange(delta > 0 ? (index + gallery.length - 1) % gallery.length : (index + 1) % gallery.length); }}>
      <button className="lightbox__close" onClick={onClose} aria-label="Fechar galeria" autoFocus><X /></button>
      <button className="lightbox__side lightbox__side--left" onClick={() => onChange((index + gallery.length - 1) % gallery.length)} aria-label="Imagem anterior">ANTERIOR</button>
      <figure><Image src={gallery[index].src} alt={gallery[index].alt} fill sizes="90vw" priority /></figure>
      <button className="lightbox__side lightbox__side--right" onClick={() => onChange((index + 1) % gallery.length)} aria-label="Próxima imagem">PRÓXIMA</button>
      <p>{String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</p>
    </div>
  );
}

export default function Experience() {
  const reduced = useReducedMotion();
  const [intro, setIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRelease, setActiveRelease] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [bookingNote, setBookingNote] = useState(false);
  const finishIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    return () => document.documentElement.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    let previous = window.scrollY;
    const detectDirection = () => {
      const current = window.scrollY;
      if (Math.abs(current - previous) > 3) {
        document.documentElement.dataset.scrollDirection = current > previous ? "down" : "up";
        previous = current;
      }
    };
    window.addEventListener("scroll", detectDirection, { passive: true });
    return () => {
      window.removeEventListener("scroll", detectDirection);
      delete document.documentElement.dataset.scrollDirection;
    };
  }, []);

  useEffect(() => {
    if (intro) return;
    gsap.registerPlugin(ScrollTrigger);
    let lenis: Lenis | undefined;
    let frame = 0;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.92 });
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }
    const context = gsap.context(() => {
      gsap.from(".hero__eyebrow, .hero__tagline, .hero__actions", { opacity: 0, y: 28, stagger: 0.12, duration: 1.05, ease: "expo.out" });
      if (!reduced) {
        gsap.to(".hero__stage", { scale: 0.72, rotationZ: -2.2, yPercent: 18, opacity: 0.35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.1 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => gsap.from(element, { yPercent: 105, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 88%" } }));
        gsap.utils.toArray<HTMLElement>(".gallery__item").forEach((element, index) => gsap.to(element, { yPercent: index % 2 ? -8 : 8, ease: "none", scrollTrigger: { trigger: element, scrub: 1.2 } }));
      }
    });
    return () => { context.revert(); lenis?.destroy(); cancelAnimationFrame(frame); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, [intro, reduced]);

  const marquee = useMemo(() => Array.from({ length: 4 }, () => "MC JVILA • É O J DE NOVO • ").join(""), []);
  const bookingHref = artist.bookingWhatsapp ? `https://wa.me/${artist.bookingWhatsapp.replace(/\D/g, "")}` : artist.bookingEmail ? `mailto:${artist.bookingEmail}` : "";
  const socials = [["INSTAGRAM", artist.instagram], ["YOUTUBE", artist.youtube], ["SPOTIFY", artist.spotify], ["TIKTOK", artist.tiktok]] as const;

  return (
    <>
      {intro && <Preloader done={finishIntro} reduced={reduced} />}
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <CustomCursor />
      <header className="site-header">
        <a href="#home" className="site-header__mark" aria-label="MC JVILA, início" data-cursor="OPEN">JVILA</a>
        <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="main-menu" data-cursor="OPEN"><span>MENU</span><Menu size={18} /></button>
      </header>

      <div id="main-menu" className={`menu-overlay ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <Image src="/images/artist/hero-placeholder-final.webp" alt="" fill sizes="100vw" className="menu-overlay__image" />
        <div className="menu-overlay__shade" />
        <button onClick={() => setMenuOpen(false)} className="menu-overlay__close" aria-label="Fechar menu"><X /><span>FECHAR</span></button>
        <nav aria-label="Navegação principal">
          {navigation.map((item) => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} data-cursor="OPEN"><small>{item.number}</small><span>{item.label}</span></a>)}
        </nav>
      </div>

      <main id="conteudo">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <Image className="hero__image" src="/images/artist/hero-placeholder-final.webp" alt="Retrato editorial provisório e não identificável para MC JVILA" fill priority sizes="100vw" />
          <div className="hero__vignette" />
          <div className="hero__stage" aria-hidden="true"><HeroScene reducedMotion={reduced} /></div>
          <div className="hero__content">
            <p className="hero__eyebrow">MC JVILA <span>— SÃO PAULO, BR</span></p>
            <h1 id="hero-title" className="sr-only">MC JVILA — É o J de novo</h1>
            <p className="hero__tagline">É O J <em>DE NOVO.</em></p>
            <div className="hero__actions">
              <a href="#musica" data-cursor="OPEN">OUVIR AGORA</a>
              <a href="#shows" data-cursor="OPEN">AGENDA</a>
              <a href="#booking" data-cursor="OPEN">CONTRATAR SHOW</a>
            </div>
          </div>
          <div className="hero__scroll" aria-hidden="true"><span /> SCROLL TO ENTER</div>
        </section>

        <div className="marquee" aria-label="MC JVILA — É o J de novo"><div>{marquee}</div></div>

        <section className="latest section" id="musica" aria-labelledby="latest-title">
          <div className="section-kicker"><span>01</span> ÚLTIMO LANÇAMENTO</div>
          <div className="latest__heading"><h2 id="latest-title"><span data-reveal>LATEST</span><span data-reveal>DROP</span></h2><p>Som de rua em escala máxima. Um novo capítulo começa aqui.</p></div>
          <div className="latest__grid">
            <button className="cover-object" aria-label="Selecionar lançamento mais recente" onClick={() => setActiveRelease(0)} data-cursor="PLAY">
              <Image src={releases[0].image} alt="Capa provisória do lançamento Novo Drop" fill sizes="(max-width: 700px) 84vw, 42vw" />
              <span className="cover-object__chrome">JVILA</span><span className="cover-object__stamp">NEW<br />2026</span>
            </button>
            <div className="latest__info"><span>001 / 004</span><h3>{releases[0].title}</h3><p>{releases[0].artist}</p><p>{releases[0].year}</p><PlatformLinks links={releases[0].links} /><small>CAPA E LINKS PROVISÓRIOS — SUBSTITUA PELOS ASSETS OFICIAIS</small></div>
          </div>
        </section>

        <section className="discography section" aria-labelledby="discography-title">
          <div className="section-kicker"><span>02</span> CATÁLOGO</div>
          <h2 id="discography-title"><span data-reveal>DISCO</span><span data-reveal>GRAFIA</span></h2>
          <div className="discography__rail" aria-label="Lançamentos — arraste horizontalmente" data-cursor="DRAG">
            {releases.map((release, index) => <button key={release.id} className={`release-card ${activeRelease === index ? "is-active" : ""}`} onClick={() => setActiveRelease(index)} aria-pressed={activeRelease === index}><span className="release-card__number">0{index + 1}</span><Image src={release.image} alt={`Capa provisória de ${release.title}`} fill sizes="280px" /><span className="release-card__veil" /><strong>{release.title}</strong><small>{release.year}</small></button>)}
          </div>
          <MusicPlayer key={activeRelease} active={activeRelease} />
        </section>

        <section className="manifesto" aria-label="Manifesto de MC JVILA">
          <Image src="/images/artist/hero-placeholder-final.webp" alt="Retrato editorial provisório em preto e branco" fill sizes="100vw" />
          <div className="manifesto__veil" />
          <p><span data-reveal>DA VILA</span><span data-reveal>PARA O BRASIL.</span></p>
          <p className="manifesto__offset"><span data-reveal>O FUNK</span><span data-reveal>NUNCA PARA.</span></p>
          <p className="manifesto__signature" data-reveal>JVILA.</p>
        </section>

        <section className="gallery section" id="galeria" aria-labelledby="gallery-title">
          <div className="section-kicker"><span>03</span> VISUAL ARCHIVE</div>
          <div className="gallery__heading"><h2 id="gallery-title"><span data-reveal>NO FLASH.</span><span data-reveal>SEM AVISO.</span></h2><p>Uma sequência editorial provisória. Fotografias oficiais podem substituir cada quadro sem alterar a composição.</p></div>
          <div className="gallery__grid">
            {gallery.map((image, index) => <button className={`gallery__item gallery__item--${index + 1}`} key={image.id} onClick={() => setLightbox(index)} data-cursor="VIEW"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 92vw, 50vw" loading="lazy" style={{ objectPosition: `${20 + (index * 13) % 70}% center` }} /><span>0{index + 1}</span></button>)}
          </div>
        </section>

        <section className="shows section" id="shows" aria-labelledby="shows-title">
          <div className="section-kicker"><span>04</span> AO VIVO</div>
          <h2 id="shows-title"><span data-reveal>PRÓXIMOS</span><span data-reveal>SHOWS</span></h2>
          <div className="shows__list">
            {shows.map((show, index) => <article className="show-row" key={`${show.city}-${index}`}><time>{show.date}</time><div><strong>{show.city}</strong><span>{show.venue}</span></div><b>{show.state}</b>{show.tickets ? <a href={show.tickets} target="_blank" rel="noreferrer">INGRESSOS</a> : <span className="show-row__soon">EM BREVE</span>}</article>)}
          </div>
        </section>

        <section className="booking" id="booking" aria-labelledby="booking-title">
          <p className="section-kicker"><span>05</span> BOOKING</p>
          <h2 id="booking-title"><span data-reveal>LEVE O JVILA</span><span data-reveal>PARA O SEU EVENTO.</span></h2>
          {bookingHref ? <a className="booking__cta" href={bookingHref} target="_blank" rel="noreferrer" data-cursor="OPEN">CONTRATAR SHOW</a> : <button className="booking__cta" onClick={() => setBookingNote(true)} data-cursor="OPEN">CONTRATAR SHOW</button>}
          {bookingNote && <p className="booking__note" role="status">O contato oficial de booking será publicado aqui. Enquanto isso, fale com o artista pelo Instagram.</p>}
        </section>

        <section className="social" aria-label="Redes sociais de MC JVILA">
          {socials.map(([label, href], index) => href ? <a key={label} href={href} target="_blank" rel="noreferrer" data-cursor="OPEN"><span>0{index + 1}</span><strong data-text={label}>{label}</strong></a> : <span className="social__disabled" key={label} aria-disabled="true"><span>0{index + 1}</span><strong>{label}</strong><small>EM BREVE</small></span>)}
        </section>
      </main>

      <footer><div className="footer__word" aria-hidden="true">JVILA</div><div className="footer__bottom"><p>© {new Date().getFullYear()} MC JVILA.</p><p>SÃO PAULO — BRASIL</p><a href="#home">VOLTAR AO TOPO</a></div></footer>
      <div className="grain" aria-hidden="true" />
      {lightbox !== null && <Lightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />}
    </>
  );
}
