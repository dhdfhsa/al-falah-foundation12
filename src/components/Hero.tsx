// src/components/Hero.tsx
"use client";

import { useState, useEffect, useCallback, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

interface Sector {
  id: number;
  label: string;
  color: string;
  cx: number;
  cy: number;
  iconPath: string;
}

interface Slide {
  id: number;
  badge: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  imageSrc: string;
  imageAlt: string;
}

type ThemeMode = "blue" | "dark";

const SECTORS: Sector[] = [
  {
    id: 1, label: "Education", color: "#0f2358",
    cx: 62, cy: 122,
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    id: 2, label: "Healthcare", color: "#132d72",
    cx: 438, cy: 122,
    iconPath: "M12 5v14M5 12h14",
  },
  {
    id: 3, label: "Food Aid", color: "#10295f",
    cx: 38, cy: 272,
    iconPath: "M3 11h18M5 11V7h14v4M2 11c0 5.5 2 9 10 9s10-3.5 10-9",
  },
  {
    id: 4, label: "Orphan Care", color: "#16327a",
    cx: 462, cy: 272,
    iconPath: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  },
  {
    id: 5, label: "Clean Water", color: "#0d204d",
    cx: 78, cy: 392,
    iconPath: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
  },
  {
    id: 6, label: "Community", color: "#0d204d",
    cx: 422, cy: 392,
    iconPath: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  },
];

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: "Education",
    title: "Learning First",
    description: "Every child deserves a fair start, and education is one of the strongest ways we help that happen.",
    cta: "Explore Education",
    href: "/programs",
    gradient: "linear-gradient(135deg, #0b1638 0%, #1a2d7c 60%, #243a96 100%)",
    imageSrc: "/pexels-funmiphotography-a-29108795-6895226.jpg",
    imageAlt: "Children receiving support in a community setting",
  },
  {
    id: 2,
    badge: "Healthcare",
    title: "Care with Dignity",
    description: "Health support becomes powerful when it reaches people where they are, with warmth and respect.",
    cta: "Support Healthcare",
    href: "/programs",
    gradient: "linear-gradient(135deg, #061e36 0%, #0b3860 55%, #0d5080 100%)",
    imageSrc: "/pexels-rdne-6646933.jpg",
    imageAlt: "Volunteers assisting people at a community charity table",
  },
  {
    id: 3,
    badge: "Food Security",
    title: "Share the Meal",
    description: "Food support is more than supplies. It is relief, dignity, and a little hope at the right moment.",
    cta: "Feed a Family",
    href: "/donate",
    gradient: "linear-gradient(135deg, #251404 0%, #5c2e08 55%, #8a4510 100%)",
    imageSrc: "/pexels-lagosfoodbank-9090750.jpg",
    imageAlt: "Children receiving food packages at a community aid distribution",
  },
  {
    id: 4,
    badge: "Community",
    title: "Belonging for All",
    description: "Community care connects people across generations, backgrounds, and shared responsibility.",
    cta: "Join the Mission",
    href: "/donate",
    gradient: "linear-gradient(135deg, #061828 0%, #0a2e4a 55%, #0d4668 100%)",
    imageSrc: "/pexels-tonywuphotography-12671875.jpg",
    imageAlt: "A community support distribution with volunteers and families",
  },
];

export default function HeroSection(): ReactElement {
  const [current, setCurrent] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>("blue");

  useEffect(() => {
    const readTheme = (): void => {
      const nextTheme = document.documentElement.getAttribute("data-theme");
      setTheme(nextTheme === "dark" ? "dark" : "blue");
    };

    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("storage", readTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", readTheme);
    };
  }, []);

  const goTo = useCallback((index: number): void => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 650);
  }, [animating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className={styles.hero}>
      <div className={styles.treePanel}>
        {theme === "dark" && (
          <div className={styles.darkBackdrop} aria-hidden="true">
            <Image
              src="/hero-dark-bg.png"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 44vw"
              className={styles.darkBackdropImage}
            />
            <div className={styles.darkBackdropOverlay} />
          </div>
        )}

        <div className={styles.treePanelInner}>
          <div className={styles.treeMeta}>
            <span className={styles.treeEyebrow}>What We Do</span>
            <h2 className={styles.treeHeading}>
              Our Pillars<br />of <em>Service</em>
            </h2>
          </div>

          <div className={styles.floatingIcons} aria-hidden="true">
            <span className={`${styles.floatIcon} ${styles.floatHeart}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartAlt}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartExtra1}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartExtra2}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartExtra3}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartExtra4}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatHeartExtra5}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatCare}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.2 4.7L19 7.3l-3.5 3.2.9 4.8L12 13.9 7.6 15.3l.9-4.8L5 7.3l4.8-.6L12 2z" />
                <path d="M4 18c2.2-1.6 4.6-2.4 8-2.4s5.8.8 8 2.4" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatCareAlt}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.2 4.7L19 7.3l-3.5 3.2.9 4.8L12 13.9 7.6 15.3l.9-4.8L5 7.3l4.8-.6L12 2z" />
                <path d="M4 18c2.2-1.6 4.6-2.4 8-2.4s5.8.8 8 2.4" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatChat}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </span>
            <span className={`${styles.floatIcon} ${styles.floatChatAlt}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </span>
          </div>

          <div className={styles.treeSvgWrap}>
            <svg
              viewBox="-15 -10 530 570"
              className={styles.treeSvg}
              role="img"
              aria-label="Al Falah Foundation service areas tree"
            >
              <ellipse cx="250" cy="265" rx="195" ry="180" fill="rgba(26,45,124,0.05)" />

              <path
                d="M250 548 C248 508 244 468 247 428 C250 390 250 360 250 330"
                stroke="#10295f" strokeWidth="26" strokeLinecap="round" fill="none"
              />
              <path d="M213 546 C222 518 236 490 250 548" stroke="#10295f" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M287 546 C278 518 264 490 250 548" stroke="#10295f" strokeWidth="14" strokeLinecap="round" fill="none" />

              <path d="M250 310 C228 288 188 258 132 222" stroke="#132d72" strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M250 310 C272 288 312 258 368 222" stroke="#132d72" strokeWidth="16" strokeLinecap="round" fill="none" />

              <path d="M132 222 C104 192 78 158 62 122" stroke="#16327a" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M132 222 C96 232 62 252 38 272" stroke="#16327a" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M368 222 C396 192 420 158 438 122" stroke="#16327a" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M368 222 C404 232 438 252 462 272" stroke="#16327a" strokeWidth="10" strokeLinecap="round" fill="none" />

              <path d="M248 352 C210 358 158 372 78 392" stroke="#16327a" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M252 352 C290 358 342 372 422 392" stroke="#16327a" strokeWidth="10" strokeLinecap="round" fill="none" />

              <path d="M250 310 C250 278 250 240 250 195" stroke="#0f2358" strokeWidth="9" strokeLinecap="round" fill="none" />

              <ellipse cx="196" cy="242" rx="14" ry="8" fill="rgba(26,45,124,0.18)" transform="rotate(-25 196 242)" />
              <ellipse cx="304" cy="242" rx="14" ry="8" fill="rgba(26,45,124,0.18)" transform="rotate(25 304 242)" />
              <ellipse cx="250" cy="268" rx="12" ry="7" fill="rgba(200,145,42,0.15)" />
              <ellipse cx="145" cy="198" rx="11" ry="6" fill="rgba(26,45,124,0.15)" transform="rotate(-15 145 198)" />
              <ellipse cx="355" cy="198" rx="11" ry="6" fill="rgba(26,45,124,0.15)" transform="rotate(15 355 198)" />
              <ellipse cx="88" cy="340" rx="9" ry="5" fill="rgba(26,45,124,0.12)" transform="rotate(-10 88 340)" />
              <ellipse cx="412" cy="340" rx="9" ry="5" fill="rgba(26,45,124,0.12)" transform="rotate(10 412 340)" />

              <path
                className={styles.starPath}
                d="M250 158 L254.5 172 L269 172 L257.5 181 L262 195 L250 186 L238 195 L242.5 181 L231 172 L245.5 172 Z"
                fill="#c9912a"
              />

              {SECTORS.map((s, i) => (
                <g
                  key={s.id}
                  className={styles.sectorNode}
                  style={{ animationDelay: `${i * 0.38}s` }}
                >
                  <circle
                    cx={s.cx} cy={s.cy} r={38}
                    fill={s.color} opacity={0.1}
                    className={styles.nodeRing}
                    style={{ animationDelay: `${i * 0.38}s` }}
                  />
                  <circle cx={s.cx} cy={s.cy} r={28} fill={s.color} />
                  <circle cx={s.cx} cy={s.cy} r={28} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <g transform={`translate(${s.cx - 11}, ${s.cy - 11}) scale(0.917)`}>
                    <path
                      d={s.iconPath}
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                  <text
                    x={s.cx} y={s.cy + 48}
                    textAnchor="middle"
                    className={styles.sectorLabel}
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="'DM Sans', 'Segoe UI', sans-serif"
                    letterSpacing="0.03em"
                  >
                    {s.label}
                  </text>
                </g>
                ))}
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.sliderPanel}>
        <div className={styles.sliderTrack}>
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`${styles.slide} ${i === current ? styles.slideActive : ""}`}
              style={{ background: s.gradient }}
              aria-hidden={i !== current}
            >
              <div className={styles.slideMedia} aria-hidden="true">
                <Image
                  src={s.imageSrc}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 52vw"
                  className={styles.slideBgImage}
                  priority={i === current}
                />
                <div className={styles.slideBgOverlay} aria-hidden="true" />
              </div>

              <div className={styles.slideOverlay} aria-hidden="true" />

              <div className={styles.decoTopRight} aria-hidden="true">
                <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                  <circle cx="220" cy="0" r="160" fill="rgba(255,255,255,0.03)" />
                  <circle cx="220" cy="0" r="110" fill="rgba(255,255,255,0.03)" />
                  <circle cx="220" cy="0" r="60"  fill="rgba(255,255,255,0.04)" />
                </svg>
              </div>

              <div className={styles.decoBottomLeft} aria-hidden="true">
                <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                  <circle cx="0" cy="220" r="160" fill="rgba(200,145,42,0.07)" />
                  <circle cx="0" cy="220" r="100" fill="rgba(200,145,42,0.05)" />
                </svg>
              </div>

              <div className={styles.slideContent}>
                <span className={styles.slideBadge}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  {s.badge}
                </span>

                <h1 className={styles.slideTitle}>{s.title}</h1>
                <p className={styles.slideDesc}>{s.description}</p>

                <div className={styles.slideActions}>
                  <Link href={s.href} className={styles.slideCta}>
                    {s.cta}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/donate" className={styles.slideGhost}>
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className={styles.sliderNav} aria-label="Slide navigation">
          <div className={styles.progressLine} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
            />
          </div>

          <div className={styles.navInner}>
            <button
              className={styles.navArrow}
              onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
              aria-label="Previous slide"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            <div className={styles.dotRow} role="tablist" aria-label="Go to slide">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}: ${s.badge}`}
                  aria-selected={i === current}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            <div className={styles.navRight}>
              <span className={styles.counter} aria-live="polite" aria-atomic="true">
                <strong>{String(current + 1).padStart(2, "0")}</strong>
                <span>/</span>
                {String(SLIDES.length).padStart(2, "0")}
              </span>
              <button
                className={styles.navArrow}
                onClick={() => goTo((current + 1) % SLIDES.length)}
                aria-label="Next slide"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
