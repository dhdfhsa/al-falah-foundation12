"use client";

import { useState, useEffect, useRef, useCallback, type ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

/* ───────────────────────────────
   Types
─────────────────────────────── */
type Theme = "blue" | "dark";
type PaymentMethod = "card" | "bank" | "mobile";
type RecurringType = "once" | "monthly";

interface Donor {
  id: number;
  name: string;
  amount: number;
  time: string;
  avatar: string;
}

interface ImpactItem {
  amount: number;
  label: string;
  icon: string;
}

interface FAQItem {
  q: string;
  a: string;
}

/* ───────────────────────────────
   Data
─────────────────────────────── */
const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const IMPACT_ITEMS: ImpactItem[] = [
  { amount: 500, label: "School supplies for 2 children", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { amount: 1000, label: "Monthly food package for a family", icon: "M3 11h18M5 11V7h14v4M2 11c0 5.5 2 9 10 9s10-3.5 10-9" },
  { amount: 2500, label: "Medical camp supplies for 10 patients", icon: "M12 5v14M5 12h14" },
  { amount: 5000, label: "Clean water well for a village", icon: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" },
  { amount: 10000, label: "Sponsor an orphan for 6 months", icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
  { amount: 25000, label: "Community vocational training program", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" },
];

const DONORS: Donor[] = [
  { id: 1, name: "Ahmad R.", amount: 5000, time: "2 min ago", avatar: "AR" },
  { id: 2, name: "Fatima K.", amount: 2500, time: "5 min ago", avatar: "FK" },
  { id: 3, name: "Mohammed S.", amount: 10000, time: "12 min ago", avatar: "MS" },
  { id: 4, name: "Ayesha B.", amount: 1000, time: "18 min ago", avatar: "AB" },
  { id: 5, name: "Ibrahim H.", amount: 500, time: "25 min ago", avatar: "IH" },
  { id: 6, name: "Zara M.", amount: 25000, time: "32 min ago", avatar: "ZM" },
  { id: 7, name: "Yusuf A.", amount: 1500, time: "41 min ago", avatar: "YA" },
  { id: 8, name: "Safia T.", amount: 8000, time: "55 min ago", avatar: "ST" },
];

const FAQS: FAQItem[] = [
  { q: "Is my donation tax-deductible?", a: "Yes, all donations to Al Falah Foundation are tax-deductible. You will receive an official receipt via email immediately after your donation is processed." },
  { q: "Can I donate in honor of someone?", a: "Absolutely. During checkout, you can dedicate your donation in honor or memory of a loved one. We will send a personalized acknowledgment card to the family." },
  { q: "How is my donation used?", a: "100% of your donation goes directly to our programs. Administrative costs are covered by a separate endowment fund, so every taka you give reaches those in need." },
  { q: "Can I set up a recurring donation?", a: "Yes, select 'Monthly' when choosing your donation frequency. You can modify or cancel your recurring donation at any time from your dashboard." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, bank transfers, and mobile banking (bKash, Nagad, Rocket) for donors in Bangladesh." },
  { q: "Will I receive updates on my impact?", a: "Yes! Quarterly impact reports are sent to all donors, showing exactly how contributions have transformed lives in our communities." },
];

/* ───────────────────────────────
   Helpers
─────────────────────────────── */
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

/* ───────────────────────────────
   Components
─────────────────────────────── */
function HeartIcon({ className = "" }: { className?: string }): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function ArrowIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function ShieldIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function LockIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function CheckIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Impact Card ── */
function ImpactCard({ item, active, isDark }: { item: ImpactItem; active: boolean; isDark: boolean }): ReactElement {
  return (
    <div className={`${styles.impactCard} ${isDark ? styles.impactCardDark : ""}`}>
      <div className={styles.impactIcon}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={item.icon} />
        </svg>
      </div>
      <span className={styles.impactAmount}>৳{item.amount.toLocaleString()}</span>
      <span className={styles.impactLabel}>{item.label}</span>
    </div>
  );
}

/* ── Donor Row ── */
function DonorRow({ donor }: { donor: Donor }): ReactElement {
  return (
    <div className={styles.donorRow}>
      <div className={styles.donorAvatar}>{donor.avatar}</div>
      <div className={styles.donorInfo}>
        <span className={styles.donorName}>{donor.name}</span>
        <span className={styles.donorTime}>{donor.time}</span>
      </div>
      <span className={styles.donorAmount}>৳{donor.amount.toLocaleString()}</span>
    </div>
  );
}

/* ── FAQ Item ── */
function FAQItemComponent({ item, index }: { item: FAQItem; index: number }): ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={styles.faqNumber}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.faqQText}>{item.q}</span>
        <span className={styles.faqToggle} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ""}`}>
        <p>{item.a}</p>
      </div>
    </div>
  );
}

/* ───────────────────────────────
   Main Page
─────────────────────────────── */
export default function DonatePage(): ReactElement {
  const [theme, setTheme] = useState<Theme>("blue");
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recurring, setRecurring] = useState<RecurringType>("once");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [impactActive, setImpactActive] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [donorCount, setDonorCount] = useState(0);
  const [totalRaised, setTotalRaised] = useState(0);
  const impactRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  /* Sync theme */
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

  /* Intersection observers */
  useEffect(() => {
    const io1 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setImpactActive(true); io1.disconnect(); }
    }, { threshold: 0.15 });
    if (impactRef.current) io1.observe(impactRef.current);

    const io2 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setFaqVisible(true); io2.disconnect(); }
    }, { threshold: 0.1 });
    if (faqRef.current) io2.observe(faqRef.current);

    return () => { io1.disconnect(); io2.disconnect(); };
  }, []);

  /* Animate stats on mount */
  useEffect(() => {
    const t0 = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDonorCount(Math.round(e * 3847));
      setTotalRaised(Math.round(e * 2894500));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const isDark = theme === "dark";
  const selectedAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const handlePreset = (a: number) => {
    setAmount(a);
    setCustomAmount("");
  };

  const handleCustom = (v: string) => {
    setCustomAmount(v.replace(/\D/g, ""));
  };

  return (
    <main className={`${styles.page} ${isDark ? styles.pageDark : ""}`}>
      {/* ═══════════════════════════════════
           HERO SECTION
      ═══════════════════════════════════ */}
      <section className={styles.hero}>
        {/* Floating hearts background */}
        <div className={styles.floatingHearts} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={styles.floatHeart}
              style={{
                left: `${8 + (i * 7.5) % 84}%`,
                top: `${10 + (i * 13) % 75}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${12 + (i % 5) * 2}s`,
                width: `${14 + (i % 4) * 6}px`,
                height: `${14 + (i % 4) * 6}px`,
              }}
            >
              <HeartIcon />
            </span>
          ))}
        </div>

        <div className={styles.heroInner}>
          <ScrollReveal variant="fade">
            <div className={styles.heroContent}>
              <span className={`${styles.eyebrow} ${isDark ? styles.eyebrowDark : ""}`}>
                Make a Difference
              </span>
              <h1 className={`${styles.heroTitle} ${isDark ? styles.heroTitleDark : ""}`}>
                Give with <em>Heart</em>,<br />Change a <em>Life</em>
              </h1>
              <svg className={styles.squiggle} viewBox="0 0 270 20" fill="none" aria-hidden="true">
                <path d="M6,14 Q38,3 78,13 Q118,23 158,11 Q198,1 264,13" stroke="#c9912a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
              <p className={`${styles.heroDesc} ${isDark ? styles.heroDescDark : ""}`}>
                Every donation, no matter the size, creates ripples of hope across communities.
                Join thousands of compassionate donors making a real difference every day.
              </p>

              {/* Live stats */}
              <div className={styles.liveStats}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>{donorCount.toLocaleString()}</span>
                  <span className={styles.statLabel}>Donors This Year</span>
                  <span className={styles.statPulse} aria-hidden="true" />
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>৳{(totalRaised / 100000).toFixed(1)}L</span>
                  <span className={styles.statLabel}>Total Raised</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>To Programs</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════
           DONATION FORM SECTION
      ═══════════════════════════════════ */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <ScrollReveal variant="up" delayMs={100}>
            <div className={styles.formCard}>
              {/* Amount selector */}
              <div className={styles.amountSection}>
                <span className={`${styles.formLabel} ${isDark ? styles.formLabelDark : ""}`}>
                  Select Amount (BDT)
                </span>
                <div className={styles.amountGrid}>
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      className={[
                        styles.amountBtn,
                        amount === a && !customAmount ? styles.amountBtnActive : "",
                        isDark ? styles.amountBtnDark : "",
                        amount === a && !customAmount && isDark ? styles.amountBtnActiveDark : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => handlePreset(a)}
                    >
                      ৳{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className={styles.customAmount}>
                  <span className={styles.currency}>৳</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustom(e.target.value)}
                    className={`${styles.customInput} ${isDark ? styles.customInputDark : ""}`}
                  />
                </div>
              </div>

              {/* Recurring toggle */}
              <div className={styles.recurringRow}>
                <span className={`${styles.formLabel} ${isDark ? styles.formLabelDark : ""}`}>
                  Donation Type
                </span>
                <div className={styles.toggleGroup}>
                  <button
                    className={[
                      styles.toggleBtn,
                      recurring === "once" ? styles.toggleBtnActive : "",
                      isDark ? styles.toggleBtnDark : "",
                      recurring === "once" && isDark ? styles.toggleBtnActiveDark : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => setRecurring("once")}
                  >
                    One-Time
                  </button>
                  <button
                    className={[
                      styles.toggleBtn,
                      recurring === "monthly" ? styles.toggleBtnActive : "",
                      isDark ? styles.toggleBtnDark : "",
                      recurring === "monthly" && isDark ? styles.toggleBtnActiveDark : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => setRecurring("monthly")}
                  >
                    Monthly
                    <span className={styles.badgeMonthly}>Save 10%</span>
                  </button>
                </div>
              </div>

              {/* Payment methods */}
              <div className={styles.paymentSection}>
                <span className={`${styles.formLabel} ${isDark ? styles.formLabelDark : ""}`}>
                  Payment Method
                </span>
                <div className={styles.paymentGrid}>
                  <button
                    className={[
                      styles.paymentCard,
                      method === "card" ? styles.paymentCardActive : "",
                      isDark ? styles.paymentCardDark : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => setMethod("card")}
                  >
                    <div className={styles.paymentIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <span className={styles.paymentName}>Credit / Debit Card</span>
                    <span className={styles.paymentSub}>Visa, Mastercard, Amex</span>
                  </button>

                  <button
                    className={[
                      styles.paymentCard,
                      method === "bank" ? styles.paymentCardActive : "",
                      isDark ? styles.paymentCardDark : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => setMethod("bank")}
                  >
                    <div className={styles.paymentIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="22" x2="20" y2="22"/>
                        <line x1="4" y1="12" x2="20" y2="12"/>
                        <polyline points="12 2 20 12 4 12 12 2"/>
                      </svg>
                    </div>
                    <span className={styles.paymentName}>Bank Transfer</span>
                    <span className={styles.paymentSub}>Direct bank deposit</span>
                  </button>

                  <button
                    className={[
                      styles.paymentCard,
                      method === "mobile" ? styles.paymentCardActive : "",
                      isDark ? styles.paymentCardDark : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => setMethod("mobile")}
                  >
                    <div className={styles.paymentIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                    </div>
                    <span className={styles.paymentName}>Mobile Banking</span>
                    <span className={styles.paymentSub}>bKash, Nagad, Rocket</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button className={styles.submitBtn}>
                <HeartIcon />
                <span>Donate ৳{selectedAmount > 0 ? selectedAmount.toLocaleString() : "0"}</span>
                <ArrowIcon />
              </button>

              {/* Trust badges */}
              <div className={styles.trustRow}>
                <span className={styles.trustBadge}><LockIcon /> SSL Secure</span>
                <span className={styles.trustBadge}><ShieldIcon /> Verified Charity</span>
                <span className={styles.trustBadge}><CheckIcon /> Tax Deductible</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Donor ticker */}
          <ScrollReveal variant="up" delayMs={200}>
            <div className={`${styles.donorTicker} ${isDark ? styles.donorTickerDark : ""}`}>
              <div className={styles.tickerHeader}>
                <span className={styles.tickerDot} aria-hidden="true" />
                <span className={styles.tickerTitle}>Recent Donors</span>
                <span className={styles.tickerLive}>LIVE</span>
              </div>
              <div className={styles.tickerList}>
                {DONORS.map((d) => (
                  <DonorRow key={d.id} donor={d} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════
           IMPACT SECTION
      ═══════════════════════════════════ */}
      <section className={styles.impactSection} ref={impactRef} id="impact">
        <div className={styles.impactInner}>
          <div className={`${styles.impactHeader} ${impactActive ? styles.impactHeaderIn : ""}`}>
            <span className={`${styles.eyebrow} ${isDark ? styles.eyebrowDark : ""}`}>Your Impact</span>
            <h2 className={`${styles.heading} ${isDark ? styles.headingDark : ""}`}>
              Every Taka <em>Matters</em>
            </h2>
            <svg className={styles.squiggle} viewBox="0 0 320 18" fill="none" aria-hidden="true">
              <path d="M4,13 Q44,2 88,12 Q132,22 176,10 Q220,0 264,11 Q290,17 316,12" stroke="#c9912a" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
            <p className={`${styles.impactSub} ${isDark ? styles.impactSubDark : ""}`}>
              See exactly how your generosity transforms lives across our communities.
            </p>
          </div>

          <div className={`${styles.impactGrid} ${impactActive ? styles.impactGridIn : ""}`}>
            {IMPACT_ITEMS.map((item, i) => (
              <div key={item.amount} className={styles.impactWrap} style={{ animationDelay: `${i * 0.1}s` }}>
                <ImpactCard item={item} active={impactActive} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           FAQ SECTION
      ═══════════════════════════════════ */}
      <section className={styles.faqSection} ref={faqRef}>
        <div className={styles.faqInner}>
          <div className={`${styles.faqHeader} ${faqVisible ? styles.faqHeaderIn : ""}`}>
            <span className={`${styles.eyebrow} ${isDark ? styles.eyebrowDark : ""}`}>Common Questions</span>
            <h2 className={`${styles.heading} ${isDark ? styles.headingDark : ""}`}>
              Frequently Asked <em>Questions</em>
            </h2>
            <svg className={styles.squiggle} viewBox="0 0 320 18" fill="none" aria-hidden="true">
              <path d="M4,13 Q44,2 88,12 Q132,22 176,10 Q220,0 264,11 Q290,17 316,12" stroke="#c9912a" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <div className={`${styles.faqList} ${faqVisible ? styles.faqListIn : ""}`}>
            {FAQS.map((item, i) => (
              <FAQItemComponent key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           FINAL CTA
      ═══════════════════════════════════ */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <ScrollReveal variant="fade">
            <h2 className={`${styles.finalTitle} ${isDark ? styles.finalTitleDark : ""}`}>
              Ready to Make a <em>Difference?</em>
            </h2>
            <p className={`${styles.finalDesc} ${isDark ? styles.finalDescDark : ""}`}>
              Your contribution today builds hope for tomorrow. Join our family of donors
              and be part of something truly meaningful.
            </p>
            <Link href="#" className={styles.finalBtn} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <HeartIcon />
              Donate Now
              <ArrowIcon />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

