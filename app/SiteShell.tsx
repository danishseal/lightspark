"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navigation = ["Home", "Litepaper", "Whitepaper", "Status"];
const tickCount = 20;
const heroPhotos = [
  "IMG_6715 (1).PNG",
  "IMG_6716 (1).PNG",
  "IMG_6717 (1).PNG",
  "IMG_6718 (1).PNG",
  "IMG_6719 (1).PNG",
  "IMG_6720 (1).PNG",
  "IMG_6721 (1).PNG",
  "IMG_6724 (1).PNG",
  "IMG_6725 (1).PNG",
  "IMG_6726 (1).PNG",
  "IMG_6751.PNG",
  "IMG_6752.PNG",
  "IMG_6753.PNG",
  "IMG_6754.PNG",
  "IMG_6755.PNG",
  "IMG_6756.PNG",
  "IMG_6758.PNG",
  "IMG_6759 (1).PNG",
  "IMG_6760 (1).PNG",
  "IMG_6761.PNG",
  "IMG_6762.PNG",
  "IMG_6763 (1).PNG",
  "IMG_6764.PNG",
  "IMG_6765.PNG",
  "IMG_6773 (1).PNG",
  "IMG_6784.PNG",
  "IMG_6788.PNG",
].map((name) => `/photos/untitled%20folder/${encodeURIComponent(name)}`);

export default function SiteShell() {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname === "/litepaper" ? "litepaper" : pathname === "/whitepaper" ? "whitepaper" : pathname === "/status" ? "status" : "home";
  const selectedIndex = page === "litepaper" ? 1 : page === "whitepaper" ? 2 : page === "status" ? 3 : 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigationRef = useRef<HTMLElement>(null);

  const replaceHeroImages = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget;
    const document = frame.contentDocument;
    if (!document) return;

    const replaceImages = () => {
      document.querySelectorAll<HTMLImageElement>('img[src*="/images/hero-v2-blur"]').forEach((image, index) => {
        image.src = heroPhotos[index % heroPhotos.length];
        image.srcset = "";
      });
      document.querySelectorAll<HTMLSourceElement>('source[srcset*="/images/hero-v2-blur"]').forEach((source, index) => {
        source.srcset = heroPhotos[index % heroPhotos.length];
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
              onClick={() => {
                if (item === "Home") router.push("/");
                if (item === "Litepaper") router.push("/litepaper");
                if (item === "Whitepaper") router.push("/whitepaper");
                if (item === "Status") router.push("/status");
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <div className="site-stage">
        {page === "home" ? (
          <iframe title="Lightspark hero" src="/lightspark/index.html" className="lightspark-frame" onLoad={replaceHeroImages} />
        ) : (
          <iframe title={page === "status" ? "Status" : page === "whitepaper" ? "Whitepaper" : "Litepaper"} src={page === "status" ? "/status.html" : page === "whitepaper" ? "/whitepaper.html" : "/litepaper.html"} className="lightspark-frame litepaper-frame" />
        )}

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
