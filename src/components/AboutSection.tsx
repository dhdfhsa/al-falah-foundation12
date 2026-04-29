// src/components/AboutSection.tsx
"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AboutSection.module.css";

function useCountUp(to: number, duration: number, active: boolean): number {
  const [val, setVal] = useState<number>(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const frame = (now: number): void => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * to));
      if (p < 1) requestAnimationFrame(frame);
      else setVal(to);
    };
    requestAnimationFrame(frame);
  }, [active, to, duration]);
  return val;
}

interface StatProps {
  gradient: string;
  icon: ReactElement;
  value: number;
  label: string;
}

function StatRow({ gradient, icon, value, label }: StatProps): ReactElement {
  return (
    <div className={styles.stat}>
      <div className={styles.statIcon} style={{ background: gradient }}>
        {icon}
      </div>
      <div className={styles.statBody}>
        <strong className={styles.statNum}>{value.toLocaleString()}</strong>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function AboutSection(): ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  const [fired,       setFired]       = useState<boolean>(false);
  const [imgVisible,  setImgVisible]  = useState<boolean>(false);
  const [txtVisible,  setTxtVisible]  = useState<boolean>(false);
  const [statsActive, setStatsActive] = useState<boolean>(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          setFired(true);
          setTimeout(() => setImgVisible(true),  500);
          setTimeout(() => setTxtVisible(true),  700);
          setTimeout(() => setStatsActive(true), 900);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [fired]);

  const raised     = useCountUp(300000, 1000, statsActive);
  const volunteers = useCountUp(150,  1000, statsActive);
  const families   = useCountUp(2000,  1000, statsActive);

  return (
    <section className={styles.about} ref={sectionRef}>

      {/* ═══════════════════════════════════
           BRANCHING DOTTED LINE CONNECTOR
      ═══════════════════════════════════ */}

      {/* ═══════════════════════════════════
           MAIN CONTENT
      ═══════════════════════════════════ */}
      <div className={styles.content} >

        {/* ── LEFT: Image Collage ── */}
        <div className={`${styles.imgPanel} ${imgVisible ? styles.panelIn : ""}`}>
          <div className={styles.collage}>

            <div className={styles.dashedFrame} />

            <div className={`${styles.card} ${styles.c1}`}>
              <div className={styles.placeholder} style={{ background: "linear-gradient(145deg,#1a2d7c 0%,#2d4a9e 100%)" }}>
                <PersonIcon />
              </div>
              <Image src="/Gemini_Generated_Image_tu5kymtu5kymtu5k.png" alt="Al Falah volunteers helping children" className={styles.cardImg}
                fill style={{ objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            <div className={`${styles.card} ${styles.c2}`}>
              <div className={styles.placeholder} style={{ background: "linear-gradient(145deg,#c9912a 0%,#e8b93f 100%)" }}>
                <PersonIcon />
              </div>
              <Image src="/pexels-rdne-6646933.jpg" alt="Community support and care" className={styles.cardImg}
                fill style={{ objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            <div className={`${styles.card} ${styles.c3}`}>
              <div className={styles.placeholder} style={{ background: "linear-gradient(145deg,#0b1638 0%,#122060 100%)" }}>
                <PersonIcon />
              </div>
              <Image src="/Gemini_Generated_Image_8yq8178yq8178yq8.png" alt="Food aid distribution for children" className={styles.cardImg}
                fill style={{ objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} id="about" />
            </div>

            <div className={`${styles.card} ${styles.c4}`}>
              <div className={styles.placeholder} style={{ background: "linear-gradient(145deg,#243a96 0%,#3558c4 100%)" }}>
                <PersonIcon />
              </div>
              <Image src="/Gemini_Generated_Image_tu5kymtu5kymtu5k.png" alt="Volunteers serving the community" className={styles.cardImg}
                fill style={{ objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            <div className={styles.floatBadge}>
              <span className={styles.badgeEst}>Est.</span>
              <span className={styles.badgeYear}>2019</span>
              <span className={styles.badgeSub}>Serving Bangladesh</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Text + Stats ── */}
        <div className={`${styles.txtPanel} ${txtVisible ? styles.panelIn : ""}`}>

          <span className={styles.eyebrow}>About Us</span>

          <h2 className={styles.heading}>
            আর্তমানবতার সেবায়<br /> 
             আমাদের<em>পথচলা</em>
          </h2>

          <svg
            className={styles.squiggle}
            viewBox="0 0 270 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6,14 Q38,3 78,13 Q118,23 158,11 Q198,1 264,13"
              stroke="#c9912a"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <p className={styles.desc}>
           আর্তমানবতার সেবায় আমাদের পথচলা। সমাজের প্রতিটি মানুষের মুখে হাসি ফোটানোর যে পবিত্র দায়িত্ব আমরা নিয়েছি, তা সফল করতে আপনাদের স্বতঃস্ফূর্ত অংশগ্রহণ জরুরি।আপনাদের সাহায্য সহযোগিতা আমার অনুপ্রেরনার মূল উৎসহ।পরিচালনা কমিটির সততা,আর্দশ,আমানতদারিতা আমাদের মূলচালিকা শক্তি।আমরা বিশ্বাস করি, শিক্ষা, স্বাস্থ্যসেবা ও স্বনির্ভরতার মাধ্যমে আমরা একটি উন্নত সমাজ গড়তে পারি। আসুন, মানবতার পতাকাতলে দাঁড়িয়ে আমরা একযোগে কাজ করি, আগামীর স্বপ্ন জয় করি। আপনাদের সবাইকে ধন্যবাদ, জাযাকুল্লাহু খাইরান।"

          </p>

          <div className={styles.stats}>
            <StatRow
              gradient="linear-gradient(135deg, #c9912a, #e8b93f)"
              value={raised}
              label="Raised by 500 people in one year"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              }
            />
            <StatRow
              gradient="linear-gradient(135deg, #1a2d7c, #2d4a9e)"
              value={volunteers}
              label="Volunteers available to help you"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              }
            />
            <StatRow
              gradient="linear-gradient(135deg, #0b1638, #1a2d7c)"
              value={families}
              label="Families supported every year"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
          </div>

          <Link href="/programs" className={styles.cta}>
            View All Causes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PersonIcon(): ReactElement {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

