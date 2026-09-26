"use client";

import { useEffect, useRef, useState } from "react";

const navigation = ["Home", "Works", "Playground", "About", "Contact"];
const tickCount = 24;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigationRef = useRef<HTMLElement>(null);

  const replaceHeroImages = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget;
    const document = frame.contentDocument;
    if (!document) return;

    const replaceImages = () => {
      document.querySelectorAll<HTMLImageElement>('img[src*="/images/hero-v2-blur"]').forEach((image, index) => {
        image.src = `/numbered-2/numbered-2/${(index % 12) + 1}.png`;
        image.srcset = "";
      });
      document.querySelectorAll<HTMLSourceElement>('source[srcset*="/images/hero-v2-blur"]').forEach((source, index) => {
        source.srcset = `/numbered-2/numbered-2/${(index % 12) + 1}.png`;
      });
    };

    replaceImages();
    new MutationObserver(replaceImages).observe(document.documentElement, { childList: true, subtree: true });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <main className={`site-shell${menuOpen ? " site-shell--menu-open" : ""}`}>
      <aside
        className="side-navigation"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        onPointerMove={(event) => {
          const bounds = navigationRef.current?.getBoundingClientRect();
          if (!bounds || event.clientY < bounds.top - 16 || event.clientY > bounds.bottom + 16) {
            setHoveredIndex(null);
            return;
          }
          const index = Math.max(0, Math.min(navigation.length - 1, Math.floor((event.clientY - bounds.top) / 44)));
          setHoveredIndex(index);
        }}
        onPointerLeave={() => setHoveredIndex(null)}
      >
        <nav ref={navigationRef} className="side-navigation__links" aria-label="Main menu" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHoveredIndex(null); }}>
          <div className="side-navigation__ticks" aria-hidden="true">
            {Array.from({ length: tickCount }, (_, index) => {
              const distance = hoveredIndex === null ? 0 : -9 + index * 10 - (22 + hoveredIndex * 44);
              const width = hoveredIndex === null ? 29 : 29 + 27 * Math.exp(-(distance * distance) / (2 * 18 * 18));
              return <span className="side-navigation__tick" key={index} style={{ top: index * 10, width }} />;
            })}
          </div>
          {navigation.map((item, index) => (
            <button
              className={`side-navigation__link${index === 0 && selectedIndex !== 0 ? " side-navigation__link--muted" : ""}`}
              key={item}
              type="button"
              aria-pressed={selectedIndex === index}
              onFocus={() => setHoveredIndex(index)}
              onClick={() => setSelectedIndex(index)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <div className="site-stage">
        <iframe title="Lightspark hero" src="/lightspark/index.html" className="lightspark-frame" onLoad={replaceHeroImages} />

      </div>
        <button
          className="menu-tab"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="menu-tab__image menu-tab__image--dark" src="/instance.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="menu-tab__image menu-tab__image--white" src="/instande-white.png" alt="" />
        </button>
    </main>
  );
}
