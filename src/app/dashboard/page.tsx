// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

/* ── Types ── */
interface User {
  _id: string;
  fullName: string;
  email: string;
  profession: string;
  className: string;
  phone: string;
  skills: string;
  address: string;
  bloodGroup: string;
  profilePic: string;
  role: string;
  createdAt: string;
}
interface Notif {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  readBy: string[];
  createdAt: string;
  createdBy: string;
}
type Tab = "overview" | "notifications" | "edit";
type Theme = "blue" | "dark";

const DASHBOARD_TABS: [Tab, string][] = [
  ["overview", "Overview"],
  ["notifications", "Notifications"],
  ["edit", "Edit Profile"],
];

/* ── Icon set ── */
const Icon = {
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bell: ({ dot }: { dot?: boolean }) => (
    <span style={{ position: "relative" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      {dot && <span style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:"#e05555", border:"2px solid currentColor" }} />}
    </span>
  ),
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
};

const TYPE_CONFIG = {
  info:    { color: "#2d6be4", bg: "rgba(45,107,228,0.1)",  label: "Info"    },
  success: { color: "#3ab060", bg: "rgba(58,176,96,0.1)",   label: "Success" },
  warning: { color: "#e8832a", bg: "rgba(232,131,42,0.1)",  label: "Warning" },
  urgent:  { color: "#e05555", bg: "rgba(224,85,85,0.1)",   label: "Urgent"  },
};

export default function DashboardPage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user,     setUser]     = useState<User | null>(null);
  const [notifs,   setNotifs]   = useState<Notif[]>([]);
  const [tab,      setTab]      = useState<Tab>("overview");
  const [theme,    setTheme]    = useState<Theme>("blue");
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [uploadPic, setUploadPic] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [errors,   setErrors]   = useState<Record<string,string>>({});
  const [animate,  setAnimate]  = useState(false);

  const isDark = theme === "dark";

  /* ── Theme sync ── */
  useEffect(() => {
    const t = (localStorage.getItem("alf-theme") || "blue") as Theme;
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = () => {
    const next: Theme = isDark ? "blue" : "dark";
    setTheme(next);
    localStorage.setItem("alf-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  /* ── Fetch user ── */
  const fetchUser = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) { router.replace("/login"); return; }
    const data = await res.json();
    if (data.user?.role === "admin") { router.replace("/admin"); return; }
    setUser(data.user);
    setEditData(data.user);
    setLoading(false);
    setTimeout(() => setAnimate(true), 60);
  }, [router]);

  /* ── Fetch notifications ── */
  const fetchNotifs = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifs(data.notifications || []);
    }
  }, []);

  useEffect(() => { fetchUser(); fetchNotifs(); }, [fetchUser, fetchNotifs]);

  const unread = notifs.filter((n) => user && !n.readBy.includes(user._id)).length;

  /* ── Mark read ── */
  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setNotifs((prev) => prev.map((n) =>
      n._id === id && user ? { ...n, readBy: [...n.readBy, user._id] } : n
    ));
  }

  /* ── Profile pic ── */
  async function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    setUploadPic(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch(`/api/members/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: base64 }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditData(data.user);
      }
      setUploadPic(false);
    };
    reader.readAsDataURL(file);
  }

  /* ── Save profile ── */
  async function handleSave() {
    if (!user) return;
    const e: Record<string,string> = {};
    if (!editData.fullName?.trim()) e.fullName = "Name is required";
    if (!editData.phone?.trim())    e.phone    = "Phone is required";
    if (!editData.address?.trim())  e.address  = "Address is required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    const res = await fetch(`/api/members/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  /* ── Logout ── */
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.push("/");
  }

  if (loading) return (
    <div className={`${styles.loadScreen} ${isDark ? styles.loadScreenDark : ""}`}>
      <div className={styles.loadSpinner} />
      <p className={styles.loadText}>Loading your dashboard…</p>
    </div>
  );
  if (!user) return <></>;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className={`${styles.page} ${isDark ? styles.pageDark : ""} ${animate ? styles.pageIn : ""}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className={`${styles.sidebar} ${isDark ? styles.sidebarDark : ""}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
              <ellipse cx="40" cy="32" rx="20" ry="18" fill="#243a96"/>
              <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
              <rect x="36" y="50" width="8" height="18" rx="4" fill="#1a2d7c"/>
            </svg>
          </div>
          <div>
            <div className={`${styles.brandName} ${isDark ? styles.brandNameDark : ""}`}>Al Falah</div>
            <div className={styles.brandSub}>Member Portal</div>
          </div>
        </div>

        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatarOuter}>
            <div className={`${styles.avatar} ${isDark ? styles.avatarDark : ""}`}>
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarInitial}>{user.fullName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              className={`${styles.camBtn} ${isDark ? styles.camBtnDark : ""}`}
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              {uploadPic ? <div className={styles.miniSpinner} /> : <Icon.Camera />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className={styles.fileHidden} onChange={handlePicChange} />
          </div>
          <div className={`${styles.avatarName} ${isDark ? styles.avatarNameDark : ""}`}>{user.fullName}</div>
          <div className={styles.avatarRole}>Member</div>
          <div className={`${styles.memberBadge} ${isDark ? styles.memberBadgeDark : ""}`}>
            🩸 {user.bloodGroup}
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.sideNav}>
        {([ ["overview","Overview",<Icon.User key="u"/>], ["notifications",`Notifications`,<Icon.Bell key="b" dot={unread > 0} />], ["edit","Edit Profile",<Icon.Edit key="e"/>] ] as [Tab, string, ReactNode][]).map(([t, label, icon]) => (
            <button
              key={t}
              className={[styles.navBtn, tab === t ? styles.navBtnActive : "", isDark ? styles.navBtnDark : "", tab === t && isDark ? styles.navBtnActiveDark : ""].filter(Boolean).join(" ")}
              onClick={() => setTab(t)}
            >
              {icon}
              <span>{label}</span>
              {t === "notifications" && unread > 0 && (
                <span className={styles.badge}>{unread}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className={styles.sideBottom}>
          <button
            className={`${styles.themeBtn} ${isDark ? styles.themeBtnDark : ""}`}
            onClick={toggleTheme}
          >
            {isDark ? <Icon.Sun /> : <Icon.Moon />}
            <span>{isDark ? "Blue Mode" : "Dark Mode"}</span>
          </button>
          <Link href="/" className={`${styles.homeBtn} ${isDark ? styles.homeBtnDark : ""}`}>
            <Icon.Home /><span>Back to Site</span>
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <Icon.Logout /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className={`${styles.main} ${isDark ? styles.mainDark : ""}`}>

        {/* Header */}
        <div className={`${styles.topBar} ${isDark ? styles.topBarDark : ""}`}>
          <div>
            <h1 className={`${styles.pageTitle} ${isDark ? styles.pageTitleDark : ""}`}>
              {tab === "overview" && "My Dashboard"}
              {tab === "notifications" && "Notifications"}
              {tab === "edit" && "Edit Profile"}
            </h1>
            <p className={`${styles.pageSub} ${isDark ? styles.pageSubDark : ""}`}>
              Member since {joinDate}
            </p>
          </div>
          <div className={styles.topRight}>
            <div className={`${styles.topBadge} ${isDark ? styles.topBadgeDark : ""}`}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className={styles.mobileTabs} role="tablist" aria-label="Dashboard sections">
          {DASHBOARD_TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={[
                styles.mobileTabBtn,
                tab === key ? styles.mobileTabBtnActive : "",
                isDark ? styles.mobileTabBtnDark : "",
                tab === key && isDark ? styles.mobileTabBtnActiveDark : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className={styles.tabContent}>

            {/* Welcome card */}
            <div className={`${styles.welcomeCard} ${isDark ? styles.welcomeCardDark : ""}`}>
              <div className={styles.welcomeText}>
                <h2 className={`${styles.welcomeTitle} ${isDark ? styles.welcomeTitleDark : ""}`}>
                  As-salamu alaykum, {user.fullName.split(" ")[0]}! 👋
                </h2>
                <p className={`${styles.welcomeSub} ${isDark ? styles.welcomeSubDark : ""}`}>
                  Thank you for being a valued member of Al Falah Foundation.
                  Your support helps us serve thousands of families.
                </p>
              </div>
              <div className={styles.welcomeOrb} aria-hidden="true" />
            </div>

            {/* Stats grid */}
            <div className={styles.statsGrid}>
              {[
                { label: "Joined", value: joinDate,          icon: "📅" },
                { label: "Blood Group", value: user.bloodGroup, icon: "🩸" },
                { label: "Profession", value: user.profession,  icon: "💼" },
                { label: "Notifications", value: String(notifs.length), icon: "🔔" },
              ].map((s) => (
                <div key={s.label} className={`${styles.statCard} ${isDark ? styles.statCardDark : ""}`}>
                  <span className={styles.statEmoji}>{s.icon}</span>
                  <span className={`${styles.statVal} ${isDark ? styles.statValDark : ""}`}>{s.value}</span>
                  <span className={`${styles.statLabel} ${isDark ? styles.statLabelDark : ""}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Profile info */}
            <div className={`${styles.infoCard} ${isDark ? styles.infoCardDark : ""}`}>
              <h3 className={`${styles.infoTitle} ${isDark ? styles.infoTitleDark : ""}`}>
                Profile Information
              </h3>
              <div className={styles.infoGrid}>
                {[
                  ["Full Name",    user.fullName],
                  ["Email",        user.email],
                  ["Phone",        user.phone],
                  ["Profession",   user.profession],
                  ["Class / Desig.", user.className],
                  ["Blood Group",  user.bloodGroup],
                  ["Skills",       user.skills],
                  ["Address",      user.address],
                ].map(([label, value]) => (
                  <div key={label} className={`${styles.infoRow} ${isDark ? styles.infoRowDark : ""}`}>
                    <span className={`${styles.infoLabel} ${isDark ? styles.infoLabelDark : ""}`}>{label}</span>
                    <span className={`${styles.infoVal} ${isDark ? styles.infoValDark : ""}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {tab === "notifications" && (
          <div className={styles.tabContent}>
            {notifs.length === 0 ? (
              <div className={`${styles.empty} ${isDark ? styles.emptyDark : ""}`}>
                <span style={{ fontSize: 48 }}>🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className={styles.notifList}>
                {notifs.map((n) => {
                  const cfg = TYPE_CONFIG[n.type];
                  const isRead = user && n.readBy.includes(user._id);
                  return (
                    <div
                      key={n._id}
                      className={`${styles.notifCard} ${isDark ? styles.notifCardDark : ""} ${isRead ? styles.notifRead : ""}`}
                      style={{ borderLeftColor: cfg.color }}
                      onClick={() => !isRead && markRead(n._id)}
                    >
                      <div className={styles.notifTop}>
                        <span className={styles.notifType} style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <span className={`${styles.notifDate} ${isDark ? styles.notifDateDark : ""}`}>
                          {new Date(n.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                        </span>
                        {isRead && (
                          <span className={styles.readTag}><Icon.Check /> Read</span>
                        )}
                      </div>
                      <h4 className={`${styles.notifTitle} ${isDark ? styles.notifTitleDark : ""}`}>
                        {n.title}
                      </h4>
                      <p className={`${styles.notifMsg} ${isDark ? styles.notifMsgDark : ""}`}>
                        {n.message}
                      </p>
                      {!isRead && (
                        <button
                          className={`${styles.markReadBtn} ${isDark ? styles.markReadBtnDark : ""}`}
                          onClick={(e) => { e.stopPropagation(); markRead(n._id); }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── EDIT TAB ── */}
        {tab === "edit" && (
          <div className={styles.tabContent}>
            <div className={`${styles.editCard} ${isDark ? styles.editCardDark : ""}`}>
              <h3 className={`${styles.infoTitle} ${isDark ? styles.infoTitleDark : ""}`}>
                Update Your Information
              </h3>
              <div className={styles.editGrid}>
                {([
                  ["fullName",   "Full Name",          "text"],
                  ["profession", "Profession",         "text"],
                  ["className",  "Class / Designation","text"],
                  ["phone",      "Phone Number",       "tel" ],
                  ["skills",     "Skills",             "text"],
                  ["address",    "Address",            "text"],
                ] as [keyof User, string, string][]).map(([key, label, type]) => (
                  <div className={styles.editField} key={key}>
                    <label className={`${styles.editLabel} ${isDark ? styles.editLabelDark : ""}`}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={(editData[key] as string) || ""}
                      onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                      className={`${styles.editInput} ${isDark ? styles.editInputDark : ""} ${errors[key] ? styles.editInputErr : ""}`}
                    />
                    {errors[key] && <span className={styles.editErr}>{errors[key]}</span>}
                  </div>
                ))}

                {/* Blood group */}
                <div className={styles.editField}>
                  <label className={`${styles.editLabel} ${isDark ? styles.editLabelDark : ""}`}>Blood Group</label>
                  <div className={styles.bloodRow}>
                    {["A+","A−","B+","B−","AB+","AB−","O+","O−"].map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        className={[
                          styles.bloodBtn,
                          editData.bloodGroup === bg ? styles.bloodActive : "",
                          isDark ? styles.bloodDark : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => setEditData({ ...editData, bloodGroup: bg })}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {saved && (
                <div className={`${styles.savedBanner} ${isDark ? styles.savedBannerDark : ""}`}>
                  <Icon.Check /> Profile updated successfully!
                </div>
              )}

              <button
                className={`${styles.saveBtn} ${isDark ? styles.saveBtnDark : ""} ${saving ? styles.saveBtnLoading : ""}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <><span className={styles.spin} />Saving…</> : <><Icon.Check /> Save Changes</>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
