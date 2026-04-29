// src/components/Footer.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

const PROGRAMS = ["Education Fund","Food Aid","Healthcare","Orphan Care","Clean Water","Community"];
const LINKS    = [
  { label:"About Us",    href:"/about"    },
  { label:"Our Team",    href:"/team"     },
  { label:"Gallery",     href:"/gallery"  },
  { label:"Impact",      href:"/impact"   },
  { label:"Contact Us",  href:"/contact"  },
  { label:"Privacy Policy", href:"/privacy" },
];

export default function Footer(): React.ReactNode {
  const [email, setEmail]     = useState("");
  const [subOk, setSubOk]     = useState(false);
  const [theme, setTheme]     = useState<"blue"|"dark">("blue");

  useEffect(() => {
    const sync = () => {
      const t = document.documentElement.getAttribute("data-theme");
      if (t === "dark" || t === "blue") setTheme(t);
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const isDark = theme === "dark";

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubOk(true);
    setEmail("");
    setTimeout(() => setSubOk(false), 4000);
  };

  return (
    <footer className={`${styles.footer} ${isDark ? styles.footerDark : ""}`}>

      {/* Animated blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      {/* Top wave */}
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.04)" />
          <path d="M0,60 C360,20 720,80 1080,40 C1260,20 1380,50 1440,60 L1440,80 L0,80 Z"
            fill="rgba(200,145,42,0.05)" />
        </svg>
      </div>

      <div className={styles.inner}>

        {/* ── Col 1: Brand ── */}
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <div className={`${styles.logoRing} ${isDark ? styles.logoRingDark : ""}`}>
              <svg width="38" height="38" viewBox="0 0 80 80" fill="none">
                <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
                <ellipse cx="40" cy="32" rx="20" ry="18" fill="#243a96"/>
                <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
                <rect x="36" y="50" width="8" height="18" rx="4" fill="#1a2d7c"/>
              </svg>
            </div>
            <div>
              <div className={styles.brandName}>AL FALAH</div>
              <div className={styles.brandSub}>FOUNDATION</div>
            </div>
          </div>
          <p className={styles.brandDesc}>
            Service to Creation, Service to the Creator. We serve the most
            vulnerable communities across Bangladesh with education, healthcare,
            food aid and compassionate care.
          </p>
          {/* Social icons */}
          <div className={styles.socials}>
            {[
              {
                label:"Facebook",
                href:"https://www.facebook.com/profile.php?id=100091759538437",
                d:"M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
              },
              {
                label:"Instagram",
                href:"https://www.instagram.com/its_falahh?igsh=MTc1a2FmczRuemhwYQ==",
                d:"M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a2 2 0 002-2v-11a2 2 0 00-2-2h-11a2 2 0 00-2 2v11a2 2 0 002 2z",
              },
            ].map((s) => (
              <a key={s.label} href={s.href} className={`${styles.social} ${isDark ? styles.socialDark : ""}`} aria-label={s.label} target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.d}/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── Col 2: Programs ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Our Programs</h4>
          <ul className={styles.colList}>
            {PROGRAMS.map((p) => (
              <li key={p}>
                <Link href="/programs" className={`${styles.colLink} ${isDark ? styles.colLinkDark : ""}`}>
                  <span className={styles.colArrow}>›</span> {p}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Quick links ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.colList}>
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={`${styles.colLink} ${isDark ? styles.colLinkDark : ""}`}>
                  <span className={styles.colArrow}>›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: Newsletter + Contact ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Stay Connected</h4>
          <p className={`${styles.newsDesc} ${isDark ? styles.newsDescDark : ""}`}>
            Get updates on our programs and how your support is changing lives.
          </p>
          <form className={styles.subForm} onSubmit={handleSub}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.subInput} ${isDark ? styles.subInputDark : ""}`}
            />
            <button type="submit" className={styles.subBtn}>
              {subOk ? "✓" : "→"}
            </button>
          </form>
          {subOk && (
            <p className={styles.subOk}>✓ Subscribed! Thank you.</p>
          )}

          {/* Contact info */}
          <div className={styles.contactList}>
            {[ 
              { icon:"📞", text:"+8801824129883" },
              { icon:"✉️", text:"alfalahfoundation2019@gmail.com" },
              { icon:"📍", text:"Joydepur, Gaziput" },
            ].map((c) => (
              <div key={c.text} className={`${styles.contactItem} ${isDark ? styles.contactItemDark : ""}`}>
                <span>{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`${styles.bottom} ${isDark ? styles.bottomDark : ""}`}>
        <div className={styles.bottomInner}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Al Falah Foundation. All rights reserved.
            Built with ❤️ for humanity.
          </p>
          <div className={styles.bottomLinks}>
            {["Terms","Privacy","Cookies"].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className={`${styles.bottomLink} ${isDark ? styles.bottomLinkDark : ""}`}>
                {l}
              </Link>
            ))}
          </div>
          <div className={`${styles.heartBeat} ${isDark ? styles.heartBeatDark : ""}`}>
            ♥ Serving Humanity
          </div>
        </div>
      </div>
    </footer>
  );
}
