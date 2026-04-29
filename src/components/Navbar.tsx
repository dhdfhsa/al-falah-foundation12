// src/components/Navbar.tsx
"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { LogOut as LogOutIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Gallery",  href: "/gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",  href: "#contact" },
];

type Theme = "blue" | "dark";

function PhoneIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.3 7.86a16 16 0 006.29 6.29l1.23-1.23a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function MailIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function HeartIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
      className={styles.heartIcon} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function MoonIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function SunIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  );
}

function UserIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function PenIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

export default function Navbar(): ReactElement {
  const router = useRouter();
  const [scrolled,    setScrolled]    = useState<boolean>(false);
  const [menuOpen,    setMenuOpen]    = useState<boolean>(false);
  const [theme,       setTheme]       = useState<Theme>("dark");
  const [themeReady,  setThemeReady]  = useState<boolean>(false);
  const [session,     setSession]     = useState<{ id: string; name?: string; email?: string; role?: string; profilePic?: string } | null>(null);
  const scrollRaf = useRef<number | null>(null);

  /* Restore saved theme */
  useEffect(() => {
    const saved = localStorage.getItem("alf-theme") as Theme | null;
    const nextTheme = saved === "dark" || saved === "blue" ? saved : "dark";
    const frame = requestAnimationFrame(() => {
      setTheme(nextTheme);
      setThemeReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Persist + apply theme to <html> */
  useEffect(() => {
    if (!themeReady) return;
    localStorage.setItem("alf-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, themeReady]);

  /* Scroll listener */
  useEffect(() => {
    const updateScrolled = (): void => {
      scrollRaf.current = null;
      const nextScrolled = window.scrollY > 8;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
    };

    const onScroll = (): void => {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = window.requestAnimationFrame(updateScrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf.current !== null) {
        window.cancelAnimationFrame(scrollRaf.current);
        scrollRaf.current = null;
      }
    };
  }, []);

  /* Prevent background scroll while the mobile menu is open */
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  /* Session tracker */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setSession(data.user);
        } else {
          localStorage.removeItem('token');
          setSession(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      }
    };
    checkSession();
  }, []);

  const toggleTheme = (): void => setTheme((p) => (p === "blue" ? "dark" : "blue"));
  const toggleMenu  = (): void => setMenuOpen((p) => !p);
  const closeMenu   = (): void => setMenuOpen(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: 'include' });
    localStorage.removeItem("token");
    setSession(null);
    router.push("/");
  }

  const isDark = theme === "dark";

  return (
    <>
      {/* ══════════════════════════════
           TOP UTILITY BAR
      ══════════════════════════════ */}
      <div className={`${styles.topBar} ${isDark ? styles.topBarDark : ""}`}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarLeft}>
            <a href="tel:+8801700000000"
              className={`${styles.tbItem} ${isDark ? styles.tbItemDark : ""}`}>
              <PhoneIcon />
              +880 1700-000000
            </a>
            <span className={styles.tbSep} />
            <a href="mailto:info@alfalahfoundation.org"
              className={`${styles.tbItem} ${isDark ? styles.tbItemDark : ""}`}>
              <MailIcon />
              info@alfalahfoundation.org
            </a>
          </div>
          <p className={`${styles.tbTagline} ${isDark ? styles.tbTaglineDark : ""}`}>
            ☽&nbsp; Service to Creation, Service to the Creator
          </p>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className={styles.menuBackdrop}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      {/* ══════════════════════════════
           MAIN NAVBAR
      ══════════════════════════════ */}
      <nav
        className={[
          styles.navbar,
          isDark   ? styles.navDark     : styles.navBlue,
          scrolled ? styles.navScrolled : "",
        ].filter(Boolean).join(" ")}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navInner}>

          {/* ── Logo ── */}
          <Link href="/" className={styles.logo} aria-label="Al Falah Foundation — Home">
            <div className={`${styles.logoCircle} ${isDark ? styles.logoCircleDark : ""}`}>
              <Image
                src="/al-falah-logo.png"
                alt="Al Falah Foundation"
                width={90}
                height={90}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.logoText}>
              <span className={`${styles.logoName} ${isDark ? styles.logoNameDark : ""}`}>
                AL FALAH<br />FOUNDATION
              </span>
              
            </div>
          </Link>

          {/* ── Nav Links ── */}
          <ul
            className={[
              styles.navLinks,
              menuOpen ? styles.navLinksOpen : "",
              isDark   ? styles.navLinksDark : "",
            ].filter(Boolean).join(" ")}
            role="menubar"
          >
            <li className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuBrand}>
                <span className={styles.mobileMenuLogo}>
                  <Image
                    src="/al-falah-logo.png"
                    alt=""
                    width={42}
                    height={42}
                    style={{ objectFit: "contain" }}
                  />
                </span>
                <div className={styles.mobileMenuBrandText}>
                  <strong>Al Falah Foundation</strong>
                  <span>Service with dignity and care</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.mobileMenuClose}
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </li>

            {NAV_LINKS.map(({ label, href }) => (
              <li key={label} role="none">
                <Link
                  href={href}
                  className={`${styles.navLink} ${isDark ? styles.navLinkDark : ""}`}
                  role="menuitem"
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}

{/* Mobile-only auth */}
            <li className={styles.mobileAuthRow}>
              {session ? (
                <>
                  <button
                    onClick={() => router.push(session.role === 'admin' ? '/admin' : '/dashboard')}
                    className={`${styles.mobileGreet} ${isDark ? styles.mobileGreetDark : ""}`}
                  >
                    {session.profilePic ? (
                      <img src={session.profilePic} alt="" className={styles.mobileAvatarImg} />
                    ) : (
                      <span>👤</span>
                    )}
                    {(session.name ?? "").split(" ")[0] || "User"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`${styles.mobileLogout} ${isDark ? styles.mobileLogoutDark : ""}`}
                  >
                    <LogOutIcon /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`${styles.mobileLogin} ${isDark ? styles.mobileLoginDark : ""}`}
                    onClick={closeMenu}
                  >
                    <UserIcon /> Log In
                  </Link>
                  {/* <Link
                    href="/register"
                    className={`${styles.mobileSignup} ${isDark ? styles.mobileSignupDark : ""}`}
                    onClick={closeMenu}
                  >
                    <PenIcon /> Sign Up
                  </Link> */}
                </>
              )}

            </li>
          </ul>

          {/* ── Right Controls ── */}
          <div className={styles.navRight}>

            {/* Theme Toggle */}
            <button
              className={`${styles.themeToggle} ${isDark ? styles.themeToggleDark : ""}`}
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to blue mode" : "Switch to dark mode"}
              title={isDark ? "Switch to Blue" : "Switch to Dark"}
            >
              <span className={`${styles.toggleTrack} ${isDark ? styles.toggleTrackDark : ""}`}>
                <span className={`${styles.toggleThumb} ${isDark ? styles.toggleThumbOn : ""}`} />
                <span className={styles.toggleLeft}>  <SunIcon /></span>
                <span className={styles.toggleRight}> <MoonIcon /></span>
              </span>
              <span className={`${styles.toggleLabel} ${isDark ? styles.toggleLabelDark : ""}`}>
                {isDark ? "Dark" : "Blue"}
              </span>
            </button>

            {/* ── Session-aware auth controls ── */}
            {session ? (
              <>
                {/* User greeting */}
                <button
                  onClick={() => router.push(session.role === 'admin' ? '/admin' : '/dashboard')}
                  className={`${styles.userBadge} ${isDark ? styles.userBadgeDark : ""}`}
                  title="Go to Dashboard"
                >
                  <div className={`${styles.userAvatar} ${isDark ? styles.userAvatarDark : ""}`}>
                    {session.profilePic ? (
                      <img src={session.profilePic} alt="" className={styles.userAvatarImg} />
                    ) : (
                      (session.name ?? "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={`${styles.userGreet} ${isDark ? styles.userGreetDark : ""}`}>
                    {(session.name ?? "").split(" ")[0] || "User"}
                  </span>
                </button>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className={`${styles.logoutBtn} ${isDark ? styles.logoutBtnDark : ""}`}
                  title="Log out"
                >
                  <LogOutIcon />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Log In */}
                <Link
                  href="/login"
                  className={`${styles.loginBtn} ${isDark ? styles.loginBtnDark : ""}`}
                >
                  <UserIcon />
                  <span>Log In</span>
                </Link>
                                {/* Sign Up */}
                {/* <Link
                  href="/register"
                  className={`${styles.signupBtn} ${isDark ? styles.signupBtnDark : ""}`}
                >
                  <PenIcon />
                  <span>Sign Up</span>
                </Link> */}
              </>
            )}


            {/* Donate */}
            <Link
              href="/donate"
              className={`${styles.donateBtn} ${isDark ? styles.donateBtnDark : ""}`}
              aria-label="Donate to Al Falah Foundation"
            >
              <span className={styles.donatePulse} />
              <HeartIcon />
              <span>Donate</span>
            </Link>

            {/* Hamburger */}
            <button
              className={[
                styles.hamburger,
                menuOpen ? styles.hamburgerOpen : "",
                isDark   ? styles.hamburgerDark : "",
              ].filter(Boolean).join(" ")}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </nav>

      {/* Spacer for logo overflow */}
      {/* <div className={`${styles.spacer} ${isDark ? styles.spacerDark : ""}`} /> */}
    </>
  );
}
