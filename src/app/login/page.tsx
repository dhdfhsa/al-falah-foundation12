// src/app/login/page.tsx
"use client";

import { useState, useEffect,JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Theme = "blue" | "dark";

function EyeIcon({ open }: { open: boolean }): JSX.Element {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function LoginPage(): React.ReactNode {
  const router = useRouter();
  const [email,   setEmail]   = useState<string>("");
  const [pw,      setPw]      = useState<string>("");
  const [showPw,  setShowPw]  = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [animate, setAnimate] = useState<boolean>(false);
  const [theme,   setTheme]   = useState<Theme>("blue");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 60);
    const t = (localStorage.getItem("alf-theme") || "blue") as Theme;
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const isDark = theme === "dark";

  async function handleLogin(): Promise<void> {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    if (!pw.trim())    e.pw    = "Password is required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);

    /* ── Check if admin credentials ── */
    const isAdmin =
      email.trim().toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() ||
      email.trim().toLowerCase() === "admin@alfalahfoundation.org";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: pw,
          isAdmin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Invalid credentials. Please try again." });
        setLoading(false);
        return;
      }

      /* Redirect based on role */
      if (data.role === "admin" || data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrors({ general: "Network error. Please try again." });
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.page} ${isDark ? styles.pageDark : ""}`}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={`${styles.card} ${isDark ? styles.cardDark : ""} ${animate ? styles.cardIn : ""}`}>

        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={`${styles.logoRing} ${isDark ? styles.logoRingDark : ""}`}>
            <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
              <ellipse cx="40" cy="32" rx="20" ry="18" fill="#243a96"/>
              <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
              <rect x="36" y="50" width="8" height="18" rx="4" fill="#1a2d7c"/>
            </svg>
          </div>
          <h1 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>
            Welcome Back
          </h1>
          <p className={`${styles.cardSub} ${isDark ? styles.cardSubDark : ""}`}>
            Log in to your Al Falah Foundation account
          </p>
        </div>

        {/* Admin hint */}
        <div className={`${styles.adminHint} ${isDark ? styles.adminHintDark : ""}`}>
          <span className={styles.adminHintIcon}>🛡️</span>
          <span>Admin? Use your admin email &amp; password to access the panel.</span>
        </div>

        {/* General error */}
        {errors.general && (
          <div className={`${styles.alertErr} ${isDark ? styles.alertErrDark : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {errors.general}
          </div>
        )}

        <div className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={`${styles.input} ${isDark ? styles.inputDark : ""} ${errors.email ? styles.inputErr : ""}`}
            />
            {errors.email && <span className={styles.err}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="pw">
                Password
              </label>
              <Link href="/forgot-password" className={styles.forgot}>Forgot password?</Link>
            </div>
            <div className={styles.pwWrap}>
              <input
                id="pw"
                type={showPw ? "text" : "password"}
                value={pw}
                placeholder="Your password"
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={`${styles.input} ${styles.inputPw} ${isDark ? styles.inputDark : ""} ${errors.pw ? styles.inputErr : ""}`}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((v) => !v)}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {errors.pw && <span className={styles.err}>{errors.pw}</span>}
          </div>

          {/* Submit */}
          <button
            className={`${styles.submitBtn} ${isDark ? styles.submitBtnDark : ""} ${loading ? styles.submitBtnLoading : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Verifying…</>
            ) : (
              <>
                Log In
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>

        <div className={`${styles.divider} ${isDark ? styles.dividerDark : ""}`}>
          <span>New to Al Falah?</span>
        </div>

        <Link
          href="/register"
          className={`${styles.registerLink} ${isDark ? styles.registerLinkDark : ""}`}
        >
          Create a Free Account
        </Link>

        <p className={`${styles.footerText} ${isDark ? styles.footerTextDark : ""}`}>
          By logging in you agree to our{" "}
          <Link href="/terms" className={styles.footerLink}>Terms</Link> &amp;{" "}
          <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}