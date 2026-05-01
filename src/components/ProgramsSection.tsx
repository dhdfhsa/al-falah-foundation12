// src/components/ProgramsSection.tsx
"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import styles from "./ProgramsSection.module.css";

type Theme = "blue" | "dark";

interface Program {
  id: number;
  tag: string;
  tagColor: string;
  image: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
}

const PROGRAMS: Program[] = [
  {
    id: 1,
    tag: "#FoodAid",
    tagColor: "#1a2d7c",
    image: "/omer-faruk-yildiz-IHFSvlzf9fI-unsplash.jpg",
    title: "Help our Palestine Brothers",
    description:"The people of palestine is in big problem. They are our muslime brothers.The **rail is killing children and others.Donate now.",
   goal: 100000,
    raised: 40000,
    category: "FoodAid",
  },
  {
    id: 2,
    tag: "#FoodAid",
    tagColor: "#c9912a",
    image: "/iftaer.jpg",
    title: "Give Ifter in Ramadan",
    description:
"Support our mission to provide Ifter. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus perferendis nobis qui quam accusantium.",
    goal:15000 ,
    raised: 10000,
    category: "FoodAid",
  },
  {
    id: 3,
    tag: "#FoodAid",
    tagColor: "#0b1638",
    image: "/Gemini_Generated_Image_8yq8178yq8178yq8.png",
    title: "Donate Blanket in winner",
    description:
      "Winter is harsh for the homeless. Your blanket donation can provide warmth and comfort to those in need, making a life-saving difference this season.",
    goal: 10000,
    raised: 1000,
    category: "FoodAid",
  },
  {
    id: 4,
    tag: "#FoodAid",
    tagColor: "#1a2d7c",
    image: "/pexels-tonywuphotography-12671875.jpg",
    title: "Every Orphaned Child Deserves a Home",
    description:
      "Safe shelter, quality education and compassionate daily care for orphaned and abandoned children building a brighter tomorrow.",
    goal: 60000,
    raised: 42000,
    category: "Orphan Care",
  },
  {
    id: 5,
    tag: "#CleanWater",
    tagColor: "#c9912a",
    image: "/pexels-funmiphotography-a-29108795-6895226.jpg",
    title: "Clean Water — The Foundation of Life",
    description:
      "Installing tube-wells and purification systems in remote villages where clean water access transforms entire communities.",
    goal: 45000,
    raised: 27000,
    category: "Clean Water",
  },
  {
    id: 6,
    tag: "#Community",
    tagColor: "#0b1638",
    image: "/pexels-rdne-6646933.jpg",
    title: "Building Stronger Communities Together",
    description:
      "Vocational training, micro-finance and skills programs that empower families to break the cycle of poverty for good.",
    goal: 70000,
    raised: 35000,
    category: "Community",
  },
];

const CATEGORIES = ["All", "Education", "FoodAid", "Healthcare", "Orphan Care", "Clean Water", "Community"];

function useCountUp(to: number, duration: number, active: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * to));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [active, to, duration]);
  return val;
}

function ProgressBar({ goal, raised, active }: { goal: number; raised: number; active: boolean }) {
  const pct = Math.min(Math.round((raised / goal) * 100), 100);
  const animRaised = useCountUp(raised, 1800, active);
  const animGoal   = useCountUp(goal,   1600, active);
  const toGo       = goal - raised;
  const animToGo   = useCountUp(toGo,  1900, active);

  return (
    <div className={styles.progressWrap}  >
      <div className={styles.trackRow}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: active ? `${pct}%` : "0%" }} />
        </div>
        <div className={styles.bubble} style={{ left: active ? `${pct}%` : "0%" }}>
          <span className={styles.bubblePct}>{pct}%</span>
          <div className={styles.bubbleCircle} />
        </div>
      </div>
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Our Goal</span>
          <span className={styles.metaVal}>${animGoal.toLocaleString()}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Raised</span>
          <span className={styles.metaVal} style={{ color: "#c9912a" }}>${animRaised.toLocaleString()}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>To Go</span>
          <span className={styles.metaVal}>${animToGo.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({
  program,
  active,
  isDark,
}: {
  program: Program;
  active: boolean;
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`${styles.card} ${isDark ? styles.cardDark : ""} ${hovered ? styles.cardHovered : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        {/* Gradient fallback */}
        <div
          className={styles.imgFallback}
          style={{
            background: `linear-gradient(145deg, ${program.tagColor}cc, ${program.tagColor}55)`,
          }}
        >
          <FallbackIcon category={program.category} />
        </div>
        <img
          src={program.image}
          alt={program.title}
          className={styles.cardImg}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {/* Tag */}
        <span
          className={styles.tag}
          style={{ background: program.tagColor }}
        >
          {program.tag}
        </span>

        {/* Image overlay on hover */}
        <div className={`${styles.imgOverlay} ${hovered ? styles.imgOverlayOn : ""}`}>
          <Link href="/donate" className={styles.overlayBtn}>
            Donate Now
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className={`${styles.cardBody} ${isDark ? styles.cardBodyDark : ""}`}>
        <span className={`${styles.categoryPill} ${isDark ? styles.categoryPillDark : ""}`}>
          {program.category}
        </span>
        <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>
          {program.title}
        </h3>
        <p className={`${styles.cardDesc} ${isDark ? styles.cardDescDark : ""}`}>
          {program.description}
        </p>
      </div>

      {/* Progress */}
      <div className={`${styles.cardFooter} ${isDark ? styles.cardFooterDark : ""}`}>
        <ProgressBar goal={program.goal} raised={program.raised} active={active} />
        <Link href="/donate" className={`${styles.donateBtn} ${isDark ? styles.donateBtnDark : ""}`}>
          <HeartIcon />
          <span>Support This Cause</span>
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

export default function ProgramsSection(): ReactElement {
  const [theme,   setTheme]   = useState<Theme>("blue");
  const [filter,  setFilter]  = useState("All");
  const [active,  setActive]  = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* Sync with global theme */
  useEffect(() => {
    const sync = () => {
      const t = document.documentElement.getAttribute("data-theme") as Theme | null;
      if (t === "dark" || t === "blue") setTheme(t);
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  /* Intersection for count-up + reveal */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setActive(true), 400);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const isDark   = theme === "dark";
  const filtered = filter === "All" ? PROGRAMS.slice(0, 3) : PROGRAMS.filter((p) => p.category === filter).slice(0, 3);

  return (
    <section
      className={`${styles.section} ${isDark ? styles.sectionDark : ""}`}
      ref={sectionRef}
      id="programs"
    >
      {/* ── Section Header ── */}
      <div className={`${styles.header} ${visible ? styles.headerIn : ""}`}>
        <span className={`${styles.eyebrow} ${isDark ? styles.eyebrowDark : ""}`}>
          What We Do
        </span>
        <h2 className={`${styles.heading} ${isDark ? styles.headingDark : ""}`}>
          Our Programs &amp; <em>Causes</em>
        </h2>
        <svg className={styles.squiggle} viewBox="0 0 320 18" fill="none" aria-hidden="true">
          <path
            d="M4,13 Q44,2 88,12 Q132,22 176,10 Q220,0 264,11 Q290,17 316,12"
            stroke="#c9912a" strokeWidth="3" strokeLinecap="round" fill="none"
          />
        </svg>
        <p className={`${styles.subtext} ${isDark ? styles.subtextDark : ""}`}>
          Every cause you support creates a ripple of change — from a single
          family to an entire community. Choose where your heart leads.
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className={`${styles.filterRow} ${visible ? styles.filterIn : ""}`}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={[
              styles.filterBtn,
              isDark        ? styles.filterBtnDark   : "",
              filter === cat ? styles.filterBtnActive : "",
              filter === cat && isDark ? styles.filterBtnActiveDark : "",
            ].filter(Boolean).join(" ")}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Cards Grid ── */}
      <div className={`${styles.grid} ${visible ? styles.gridIn : ""}`}>
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className={styles.cardWrap}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <ProgramCard program={p} active={active} isDark={isDark} />
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className={`${styles.bottomCta} ${visible ? styles.bottomCtaIn : ""}`}>
        <Link
          href="/#programs"
          className={`${styles.viewAllBtn} ${isDark ? styles.viewAllBtnDark : ""}`}
        >
          View All Programs
          <ArrowIcon />
        </Link>
        <Link
          href="/donate"
          className={`${styles.donateAllBtn} ${isDark ? styles.donateAllBtnDark : ""}`}
        >
          <HeartIcon />
          Donate to Any Cause
        </Link>
      </div>
    </section>
  );
}

/* ── Icon helpers ── */
function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function FallbackIcon({ category }: { category: string }) {
  const paths: Record<string, string> = {
    Education:    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "Food Aid":   "M3 11h18M5 11V7h14v4M2 11c0 5.5 2 9 10 9s10-3.5 10-9",
    Healthcare:   "M12 5v14M5 12h14",
    "Orphan Care":"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    "Clean Water":"M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    Community:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  };
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.45)" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[category] ?? "M12 12m-8 0a8 8 0 1016 0a8 8 0 01-16 0"} />
    </svg>
  );
}
