// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../login/page.module.css";

export default function AdminLoginPage() {
  const router   = useRouter();
  const [email,  setEmail]   = useState("");
  const [pw,     setPw]      = useState("");
  const [err,    setErr]     = useState("");
  const [loading,setLoading] = useState(false);
  const [animate,setAnimate] = useState(false);
  const [theme,  setTheme]   = useState("blue");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 60);
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") setTheme("dark");
  }, []);

  const isDark = theme === "dark";

  async function handleLogin() {
    if (!email || !pw) { setErr("Both fields are required"); return; }
    setLoading(true); setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pw, isAdmin: true }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || "Login failed"); setLoading(false); return; }
    setLoading(false);
    router.push("/admin");
  }

  return (
    <div className={`${styles.page} ${isDark ? styles.pageDark : ""}`}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <div className={`${styles.card} ${isDark ? styles.cardDark : ""} ${animate ? styles.cardIn : ""}`}>
        <div className={styles.cardHeader}>
          <div className={`${styles.logoRing} ${isDark ? styles.logoRingDark : ""}`}>
            <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
              <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
            </svg>
          </div>
          <h1 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>Admin Login</h1>
          <p className={`${styles.cardSub} ${isDark ? styles.cardSubDark : ""}`}>Al Falah Foundation Control Panel</p>
        </div>
        {err && <div className={`${styles.alertErr} ${isDark ? styles.alertErrDark : ""}`}>{err}</div>}
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`}>Admin Email</label>
            <input type="email" value={email} placeholder="admin@alfalahfoundation.org"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={`${styles.input} ${isDark ? styles.inputDark : ""}`} />
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`}>Password</label>
            <input type="password" value={pw} placeholder="Admin password"
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={`${styles.input} ${isDark ? styles.inputDark : ""}`} />
          </div>
          <button
            className={`${styles.submitBtn} ${isDark ? styles.submitBtnDark : ""} ${loading ? styles.submitBtnLoading : ""}`}
            onClick={handleLogin} disabled={loading}
          >
            {loading ? <><span className={styles.spinner} />Verifying…</> : "Access Admin Panel →"}
          </button>
        </div>
      </div>
    </div>
  );
}