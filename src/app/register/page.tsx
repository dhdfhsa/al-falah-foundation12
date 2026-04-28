// src/app/register/page.tsx
"use client";

import { useState, useEffect, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

/* ── Types ── */
interface StepOneData {
  fullName: string;
  profession: string;
  className: string;
  phone: string;
  skills: string;
  address: string;
  bloodGroup: string;
}
interface StepTwoData {
  email: string;
  password: string;
  confirmPassword: string;
}
type PasswordStrength = "weak" | "fair" | "good" | "strong";

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const PROFESSIONS  = [
  "Student", "Teacher", "Doctor", "Engineer", "Lawyer",
  "Businessman", "Farmer", "Housewife", "NGO Worker", "Other",
];

/* ── Password strength ── */
function getStrength(pw: string): { level: PasswordStrength; score: number; hints: string[] } {
  const hints: string[] = [];
  let score = 0;
  if (pw.length >= 8)  { score++; } else { hints.push("At least 8 characters"); }
  if (pw.length >= 12) { score++; }
  if (/[A-Z]/.test(pw)) { score++; } else { hints.push("One uppercase letter"); }
  if (/[0-9]/.test(pw)) { score++; } else { hints.push("One number"); }
  if (/[^A-Za-z0-9]/.test(pw)) { score++; } else { hints.push("One special character (!@#$...)"); }
  const level: PasswordStrength =
    score <= 1 ? "weak" : score <= 2 ? "fair" : score <= 3 ? "good" : "strong";
  return { level, score, hints };
}

/* ── Eye icon ── */
function EyeIcon({ open }: { open: boolean }): ReactElement {
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

/* ── Check icon ── */
function CheckIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function RegisterPage(): ReactElement {
  const router = useRouter();
  const [step,    setStep]    = useState<1 | 2>(1);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [theme,   setTheme]   = useState<"blue" | "dark">("blue");

  const [s1, setS1] = useState<StepOneData>({
    fullName: "", profession: "", className: "",
    phone: "", skills: "", address: "", bloodGroup: "",
  });
  const [s2, setS2] = useState<StepTwoData>({
    email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTimeout(() => setAnimate(true), 60);
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") setTheme("dark");
  }, []);

  const isDark = theme === "dark";
  const pwStr  = getStrength(s2.password);

  /* ── Validate step 1 ── */
  function validateS1(): boolean {
    const e: Record<string, string> = {};
    if (!s1.fullName.trim())    e.fullName    = "Full name is required";
    if (!s1.profession)         e.profession  = "Select your profession";
    if (!s1.className.trim())   e.className   = "Class / Designation is required";
    if (!/^[0-9]{11}$/.test(s1.phone)) e.phone = "Enter a valid 11-digit number";
    if (!s1.skills.trim())      e.skills      = "List at least one skill";
    if (!s1.address.trim())     e.address     = "Address is required";
    if (!s1.bloodGroup)         e.bloodGroup  = "Select your blood group";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Validate step 2 ── */
  function validateS2(): boolean {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s2.email))
      e.email = "Enter a valid email address";
    if (s2.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (pwStr.level === "weak" || pwStr.level === "fair")
      e.password = "Password is too weak — add uppercase, numbers & symbols";
    if (s2.password !== s2.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateS1()) setStep(2);
  }

  async function handleSubmit() {
    if (!validateS2()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...s1,
          email: s2.email,
          password: s2.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.error || "Registration failed" });
        setLoading(false);
        return;
      }

      setLoading(false);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      setErrors({ general: "Unable to register. Try again later." });
      setLoading(false);
    }
  }

  /* ── Field helper ── */
  function field(
    id: string, label: string, value: string,
    onChange: (v: string) => void,
    type = "text", placeholder = ""
  ) {
    return (
      <div className={styles.field} key={id}>
        <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor={id}>
          {label} <span className={styles.req}>*</span>
        </label>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.input} ${isDark ? styles.inputDark : ""} ${errors[id] ? styles.inputErr : ""}`}
          autoComplete="off"
        />
        {errors[id] && <span className={styles.err}>{errors[id]}</span>}
      </div>
    );
  }

  /* ── Success screen ── */
  if (done) {
    return (
      <div className={`${styles.page} ${isDark ? styles.pageDark : ""}`}>
        <div className={`${styles.successBox} ${isDark ? styles.successBoxDark : ""}`}>
          <div className={styles.successRing}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
              stroke="#c9912a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className={`${styles.successTitle} ${isDark ? styles.successTitleDark : ""}`}>
            Registration Successful!
          </h2>
          <p className={`${styles.successSub} ${isDark ? styles.successSubDark : ""}`}>
            Welcome to Al Falah Foundation. Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${isDark ? styles.pageDark : ""}`}>

      {/* Background blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={`${styles.card} ${isDark ? styles.cardDark : ""} ${animate ? styles.cardIn : ""}`}>

        {/* ── Logo header ── */}
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
            Join Al Falah Foundation
          </h1>
          <p className={`${styles.cardSub} ${isDark ? styles.cardSubDark : ""}`}>
            Create your account and become part of the change
          </p>
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
        </div>

        {/* ── Step indicator ── */}
        <div className={styles.stepper}>
          {[1, 2].map((n) => (
            <div key={n} className={styles.stepItem}>
              <div className={`${styles.stepCircle}
                ${step === n ? styles.stepActive : ""}
                ${step  >  n ? styles.stepDone  : ""}
                ${isDark      ? styles.stepDark  : ""}
              `}>
                {step > n ? <CheckIcon /> : n}
              </div>
              <span className={`${styles.stepLabel} ${isDark ? styles.stepLabelDark : ""}`}>
                {n === 1 ? "Personal Info" : "Account Setup"}
              </span>
              {n < 2 && (
                <div className={`${styles.stepLine} ${step > 1 ? styles.stepLineDone : ""} ${isDark ? styles.stepLineDark : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* ══ STEP 1 ══ */}
        {step === 1 && (
          <div className={`${styles.form} ${styles.formIn}`}>
            <div className={styles.grid2}>
              {field("fullName",   "Full Name",         s1.fullName,   (v) => setS1({...s1, fullName: v}),   "text", "e.g. Abdullah Al Mamun")}
              {/* Profession dropdown */}
              <div className={styles.field}>
                <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="profession">
                  Profession <span className={styles.req}>*</span>
                </label>
                <select
                  id="profession"
                  value={s1.profession}
                  onChange={(e) => setS1({...s1, profession: e.target.value})}
                  className={`${styles.input} ${styles.select} ${isDark ? styles.inputDark : ""} ${errors.profession ? styles.inputErr : ""}`}
                >
                  <option value="">Select profession</option>
                  {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.profession && <span className={styles.err}>{errors.profession}</span>}
              </div>
            </div>

            <div className={styles.grid2}>
              {field("className", "Class / Designation", s1.className, (v) => setS1({...s1, className: v}), "text", "e.g. Class 10 / Manager")}
              {/* Phone */}
              <div className={styles.field}>
                <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="phone">
                  Phone Number <span className={styles.req}>*</span>
                </label>
                <input
                  id="phone" type="tel" value={s1.phone}
                  placeholder="01700000000"
                  onChange={(e) => setS1({...s1, phone: e.target.value.replace(/\D/g, "").slice(0,11)})}
                  className={`${styles.input} ${isDark ? styles.inputDark : ""} ${errors.phone ? styles.inputErr : ""}`}
                />
                {errors.phone && <span className={styles.err}>{errors.phone}</span>}
              </div>
            </div>

            {field("skills", "Skills", s1.skills, (v) => setS1({...s1, skills: v}), "text", "e.g. Teaching, First Aid, Cooking…")}
            {field("address", "Address", s1.address, (v) => setS1({...s1, address: v}), "text", "Village / Road / District")}

            {/* Blood group */}
            <div className={styles.field}>
              <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`}>
                Blood Group <span className={styles.req}>*</span>
              </label>
              <div className={styles.bloodRow}>
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg} type="button"
                    className={`${styles.bloodBtn}
                      ${s1.bloodGroup === bg ? styles.bloodBtnActive : ""}
                      ${isDark ? styles.bloodBtnDark : ""}
                      ${s1.bloodGroup === bg && isDark ? styles.bloodBtnActiveDark : ""}
                    `}
                    onClick={() => setS1({...s1, bloodGroup: bg})}
                  >
                    {bg}
                  </button>
                ))}
              </div>
              {errors.bloodGroup && <span className={styles.err}>{errors.bloodGroup}</span>}
            </div>

            <button className={`${styles.submitBtn} ${isDark ? styles.submitBtnDark : ""}`} onClick={nextStep}>
              Continue to Account Setup
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}

        {/* ══ STEP 2 ══ */}
        {step === 2 && (
          <div className={`${styles.form} ${styles.formIn}`}>

            {/* Email */}
            <div className={styles.field}>
              <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="email">
                Email Address <span className={styles.req}>*</span>
              </label>
              <input
                id="email" type="email" value={s2.email}
                placeholder="you@example.com"
                onChange={(e) => setS2({...s2, email: e.target.value})}
                className={`${styles.input} ${isDark ? styles.inputDark : ""} ${errors.email ? styles.inputErr : ""}`}
              />
              {errors.email && <span className={styles.err}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="password">
                Password <span className={styles.req}>*</span>
              </label>
              <div className={styles.pwWrap}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={s2.password}
                  placeholder="Minimum 8 characters"
                  onChange={(e) => setS2({...s2, password: e.target.value})}
                  className={`${styles.input} ${styles.inputPw} ${isDark ? styles.inputDark : ""} ${errors.password ? styles.inputErr : ""}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {/* Strength bar */}
              {s2.password.length > 0 && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    {[1,2,3,4].map((i) => (
                      <div
                        key={i}
                        className={`${styles.strengthSeg} ${
                          pwStr.score >= i
                            ? pwStr.level === "weak"   ? styles.segWeak
                            : pwStr.level === "fair"   ? styles.segFair
                            : pwStr.level === "good"   ? styles.segGood
                            : styles.segStrong
                            : isDark ? styles.segEmptyDark : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`${styles.strengthLabel} ${
                    pwStr.level === "weak"   ? styles.segWeak
                    : pwStr.level === "fair" ? styles.segFair
                    : pwStr.level === "good" ? styles.segGood
                    : styles.segStrong
                  }`}>
                    {pwStr.level.charAt(0).toUpperCase() + pwStr.level.slice(1)}
                  </span>
                </div>
              )}
              {/* Hints */}
              {pwStr.hints.length > 0 && s2.password.length > 0 && (
                <ul className={styles.hintList}>
                  {pwStr.hints.map((h) => (
                    <li key={h} className={`${styles.hint} ${isDark ? styles.hintDark : ""}`}>
                      <span className={styles.hintDot} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {errors.password && <span className={styles.err}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
              <label className={`${styles.label} ${isDark ? styles.labelDark : ""}`} htmlFor="confirmPassword">
                Confirm Password <span className={styles.req}>*</span>
              </label>
              <div className={styles.pwWrap}>
                <input
                  id="confirmPassword"
                  type={showCpw ? "text" : "password"}
                  value={s2.confirmPassword}
                  placeholder="Re-enter your password"
                  onChange={(e) => setS2({...s2, confirmPassword: e.target.value})}
                  className={`${styles.input} ${styles.inputPw} ${isDark ? styles.inputDark : ""} ${errors.confirmPassword ? styles.inputErr : ""}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowCpw((v) => !v)}>
                  <EyeIcon open={showCpw} />
                </button>
              </div>
              {/* Match indicator */}
              {s2.confirmPassword.length > 0 && (
                <span className={s2.password === s2.confirmPassword ? styles.matchOk : styles.matchNo}>
                  {s2.password === s2.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </span>
              )}
              {errors.confirmPassword && <span className={styles.err}>{errors.confirmPassword}</span>}
            </div>

            <div className={styles.btnRow}>
              <button
                className={`${styles.backBtn} ${isDark ? styles.backBtnDark : ""}`}
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className={`${styles.submitBtn} ${styles.submitBtnFlex} ${isDark ? styles.submitBtnDark : ""} ${loading ? styles.submitBtnLoading : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <p className={`${styles.footerText} ${isDark ? styles.footerTextDark : ""}`}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>Log In</Link>
        </p>
      </div>
    </div>
  );
}