// src/components/ContactBar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContactBar.module.css";

type Theme = "blue" | "dark";

interface ContactItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

const ITEMS: ContactItem[] = [
  {
    id: "location",
    label: "Location",
    value: "Joydepur, Gazipur, Bangladesh",
    href: "https://maps.google.com/?q=Joydepur,Gazipur,Bangladesh",
    color: "#c9912a",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    value: "alfalahfoundation2019@gmail.com",
    href: "mailto:alfalahfoundation2019@gmail.com",
    color: "#3a8fd4",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Phone",
    value: "+8801824129883",
    href: "tel:+8801824129883",
    color: "#3ab060",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.3 7.86a16 16 0 006.29 6.29l1.23-1.23a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
];

/* ── Typed text animation ── */
function TypedText({ text, active }: { text: string; active: boolean }): React.ReactNode {
  const [displayed, setDisplayed] = useState<string>("");

  useEffect(() => {
    if (!active) return;
    let i = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, [active, text]);

  return <span>{active ? displayed : text}</span>;
}

export default function ContactBar(): React.ReactNode {
  const [theme,   setTheme]   = useState<Theme>("dark");
  const [visible, setVisible] = useState<boolean>(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  /* ── Sync theme with global data-theme ── */
  useEffect(() => {
    const sync = (): void => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "blue" ? "blue" : "dark");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`${styles.wrapper} ${isDark ? styles.wrapperDark : ""}`}
      ref={ref}
      id="contact"
    >
      {/* ── Background particles ── */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              left:              `${(i * 5.8) % 100}%`,
              animationDelay:    `${(i * 0.38) % 4}s`,
              animationDuration: `${3 + (i % 3)}s`,
              width:  i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              opacity: 0.15 + (i % 4) * 0.08,
            }}
          />
        ))}
      </div>

      {/* ── Glow blobs ── */}
      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      {/* ── Main bar ── */}
      <div className={`${styles.bar} ${isDark ? styles.barDark : ""} ${visible ? styles.barIn : ""}`}>

        {/* Top gold line */}
        <div
          className={`${styles.topLine} ${visible ? styles.topLineIn : ""}`}
          aria-hidden="true"
        />

        {/* ── Contact items ── */}
        <div className={styles.items}>
          {ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              target={item.id === "location" ? "_blank" : undefined}
              rel={item.id === "location" ? "noopener noreferrer" : undefined}
              className={[
                styles.item,
                isDark   ? styles.itemDark : "",
                visible  ? styles.itemIn   : "",
              ].filter(Boolean).join(" ")}
              style={{ animationDelay: `${0.12 + i * 0.14}s` }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Icon ring */}
              <div
                className={[
                  styles.iconRing,
                  hovered === item.id ? styles.iconRingHovered : "",
                ].filter(Boolean).join(" ")}
                style={{
                  boxShadow: hovered === item.id
                    ? `0 0 0 6px ${item.color}18, 0 8px 28px ${item.color}30`
                    : "0 0 0 0px transparent",
                }}
              >
                {/* Pulse ring */}
                <span
                  className={[
                    styles.pulse,
                    hovered === item.id ? styles.pulseActive : "",
                  ].filter(Boolean).join(" ")}
                  style={{ "--pulse-color": item.color } as React.CSSProperties}
                />

                {/* Icon */}
                <span
                  className={styles.iconWrap}
                  style={{
                    color: hovered === item.id ? item.color : undefined,
                  }}
                >
                  {item.icon}
                </span>
              </div>

              {/* Text */}
              <div className={styles.text}>
                <span
                  className={[
                    styles.label,
                    isDark ? styles.labelDark : "",
                  ].filter(Boolean).join(" ")}
                  style={{
                    color: hovered === item.id ? item.color : undefined,
                  }}
                >
                  {item.label}
                </span>
                <span
                  className={[
                    styles.value,
                    isDark ? styles.valueDark : "",
                  ].filter(Boolean).join(" ")}
                >
                  {item.id === "phone" ? (
                    <TypedText text={item.value} active={visible} />
                  ) : (
                    item.value
                  )}
                </span>
              </div>

              {/* Hover underline */}
              <span
                className={styles.underline}
                style={{
                  background: item.color,
                  transform:  hovered === item.id ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </a>
          ))}
        </div>

        {/* Vertical dividers between items */}
        <div
          className={`${styles.dividers} ${isDark ? styles.dividersDark : ""}`}
          aria-hidden="true"
        >
          <span />
          <span />
        </div>

        {/* Bottom gold line */}
        <div
          className={`${styles.bottomLine} ${visible ? styles.bottomLineIn : ""}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
