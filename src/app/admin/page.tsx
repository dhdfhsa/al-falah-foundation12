// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Theme  = "blue" | "dark";
type Tab    = "overview" | "members" | "send" | "notifications";

interface Member {
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
  isActive: boolean;
  createdAt: string;
}

interface Notif {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  targetAll: boolean;
  readBy: string[];
  createdAt: string;
}

/* ─── Icons ─── */
const Ic = {
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Moon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Sun: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  info:    { bg: "rgba(45,107,228,.12)",  color: "#2d6be4" },
  success: { bg: "rgba(58,176,96,.12)",   color: "#3ab060" },
  warning: { bg: "rgba(232,131,42,.12)",  color: "#e8832a" },
  urgent:  { bg: "rgba(224,85,85,.12)",   color: "#e05555" },
};

export default function AdminDashboard(): ReactElement {
  const router  = useRouter();

  const [tab,       setTab]       = useState<Tab>("overview");
  const [theme,     setTheme]     = useState<Theme>("blue");
  const [loading,   setLoading]   = useState<boolean>(true);
  const [animate,   setAnimate]   = useState<boolean>(false);
  const [members,   setMembers]   = useState<Member[]>([]);
  const [notifs,    setNotifs]    = useState<Notif[]>([]);
  const [search,    setSearch]    = useState<string>("");
  const [selected,  setSelected]  = useState<Member | null>(null);
  const [sending,   setSending]   = useState<boolean>(false);
  const [sendOk,    setSendOk]    = useState<boolean>(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [notifForm, setNotifForm] = useState({
    title: "", message: "", type: "info" as Notif["type"], targetAll: true,
  });
  const [formErr, setFormErr] = useState<Record<string, string>>({});

  const isDark = theme === "dark";

  /* ── Theme ── */
  useEffect(() => {
    const t = (localStorage.getItem("alf-theme") || "blue") as Theme;
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = (): void => {
    const next: Theme = isDark ? "blue" : "dark";
    setTheme(next);
    localStorage.setItem("alf-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  /* ── Auth guard ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/auth/me");
        if (!res.ok) { router.replace("/login"); return; }
        const data = await res.json();
        if (data.user?.role !== "admin") { router.replace("/"); return; }
        setLoading(false);
        setTimeout(() => setAnimate(true), 60);
      } catch {
        router.replace("/login");
      }
    })();
  }, [router]);

  /* ── Data fetches ── */
  const fetchMembers = useCallback(async (): Promise<void> => {
    const res = await fetch("/api/members");
    if (res.ok) { const d = await res.json(); setMembers(d.members || []); }
  }, []);

  const fetchNotifs = useCallback(async (): Promise<void> => {
    const res = await fetch("/api/notifications");
    if (res.ok) { const d = await res.json(); setNotifs(d.notifications || []); }
  }, []);

  useEffect(() => {
    if (!loading) { fetchMembers(); fetchNotifs(); }
  }, [loading, fetchMembers, fetchNotifs]);

  /* ── Logout ── */
  const handleLogout = async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  /* ── Delete member ── */
  const deleteMember = async (id: string): Promise<void> => {
    if (!confirm("Permanently remove this member?")) return;
    setDeleting(id);
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setSelected(null);
    setDeleting(null);
    fetchMembers();
  };

  /* ── Toggle active ── */
  const toggleActive = async (m: Member): Promise<void> => {
    await fetch(`/api/members/${m._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !m.isActive }),
    });
    fetchMembers();
    if (selected?._id === m._id) setSelected({ ...m, isActive: !m.isActive });
  };

  /* ── Send notification ── */
  const sendNotification = async (): Promise<void> => {
    const e: Record<string, string> = {};
    if (!notifForm.title.trim())   e.title   = "Title is required";
    if (!notifForm.message.trim()) e.message = "Message is required";
    setFormErr(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notifForm),
    });
    if (res.ok) {
      setSendOk(true);
      setNotifForm({ title: "", message: "", type: "info", targetAll: true });
      fetchNotifs();
      setTimeout(() => setSendOk(false), 3500);
    }
    setSending(false);
  };

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.profession.toLowerCase().includes(search.toLowerCase()) ||
    m.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter((m) => m.isActive).length;

  /* ── Avatar helper ── */
  const Avatar = ({ m, size = 44 }: { m: Member; size?: number }) => (
    <div
      className={`${styles.avatar} ${isDark ? styles.avatarDark : ""}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {m.profilePic
        ? <img src={m.profilePic} alt="" className={styles.avatarImg} />
        : <span>{m.fullName.charAt(0).toUpperCase()}</span>
      }
    </div>
  );

  if (loading) return (
    <div className={`${styles.loader} ${isDark ? styles.loaderDark : ""}`}>
      <div className={styles.loaderSpinner} />
      <p>Loading admin panel…</p>
    </div>
  );

  return (
    <div className={`${styles.layout} ${isDark ? styles.layoutDark : ""} ${animate ? styles.layoutIn : ""}`}>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`${styles.sidebar} ${isDark ? styles.sidebarDark : ""}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={`${styles.brandLogo} ${isDark ? styles.brandLogoDark : ""}`}>
            <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
              <ellipse cx="40" cy="32" rx="20" ry="18" fill="#243a96"/>
              <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
              <rect x="36" y="50" width="8" height="18" rx="4" fill="#1a2d7c"/>
            </svg>
          </div>
          <div>
            <div className={`${styles.brandName} ${isDark ? styles.brandNameDark : ""}`}>Al Falah</div>
            <div className={styles.brandSub}>Admin Panel</div>
          </div>
        </div>

        {/* Admin badge */}
        <div className={`${styles.adminTag} ${isDark ? styles.adminTagDark : ""}`}>
          <span className={styles.onlineDot} />
          <span>Admin • Online</span>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {([
            ["overview",      "Overview",      <Ic.Grid  key="g"/>],
            ["members",       "Members",       <Ic.Users key="u"/>],
            ["notifications", "Notifications", <Ic.Bell  key="b"/>],
            ["send",          "Send Notice",   <Ic.Send  key="s"/>],
          ] as [Tab, string, JSX.Element][]).map(([t, label, icon]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                styles.navBtn,
                tab === t           ? styles.navActive     : "",
                isDark              ? styles.navBtnDark    : "",
                tab === t && isDark ? styles.navActiveDark : "",
              ].filter(Boolean).join(" ")}
            >
              {icon}
              <span>{label}</span>
              {t === "members" && (
                <span className={`${styles.chip} ${isDark ? styles.chipDark : ""}`}>{members.length}</span>
              )}
              {t === "notifications" && notifs.length > 0 && (
                <span className={`${styles.chip} ${isDark ? styles.chipDark : ""}`}>{notifs.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sideFooter}>
          <button className={`${styles.themeBtn} ${isDark ? styles.themeBtnDark : ""}`} onClick={toggleTheme}>
            {isDark ? <Ic.Sun /> : <Ic.Moon />}
            <span>{isDark ? "Blue Mode" : "Dark Mode"}</span>
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <Ic.Logout /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className={`${styles.main} ${isDark ? styles.mainDark : ""}`}>

        {/* Top header */}
        <header className={`${styles.topHeader} ${isDark ? styles.topHeaderDark : ""}`}>
          <div>
            <h1 className={`${styles.pageTitle} ${isDark ? styles.pageTitleDark : ""}`}>
              {tab === "overview"      && "Dashboard Overview"}
              {tab === "members"       && "Member Management"}
              {tab === "notifications" && "Notifications Sent"}
              {tab === "send"          && "Send Notification"}
            </h1>
            <p className={`${styles.pageSub} ${isDark ? styles.pageSubDark : ""}`}>
              Al Falah Foundation — Admin Control Panel
            </p>
          </div>
          <div className={`${styles.headerShield} ${isDark ? styles.headerShieldDark : ""}`}>
            🛡️ Admin
          </div>
        </header>

        <div className={styles.body}>

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div className={styles.section}>

              {/* Stat cards */}
              <div className={styles.statGrid}>
                {[
                  { icon:"👥", label:"Total Members",  value: members.length,  grad:"linear-gradient(135deg,#122060,#1a2d7c)" },
                  { icon:"✅", label:"Active Members", value: activeCount,     grad:"linear-gradient(135deg,#1e6b3a,#3ab060)" },
                  { icon:"🔔", label:"Notifications",  value: notifs.length,   grad:"linear-gradient(135deg,#8a5e10,#c9912a)" },
                  { icon:"🩸", label:"Blood Groups",   value: [...new Set(members.map((m)=>m.bloodGroup))].length, grad:"linear-gradient(135deg,#7c1a1a,#c94444)" },
                ].map((s) => (
                  <div key={s.label} className={`${styles.statCard} ${isDark ? styles.statCardDark : ""}`}>
                    <div className={styles.statIconBox} style={{ background: s.grad }}>
                      <span style={{ fontSize: 22 }}>{s.icon}</span>
                    </div>
                    <div className={`${styles.statVal} ${isDark ? styles.statValDark : ""}`}>{s.value}</div>
                    <div className={`${styles.statLbl} ${isDark ? styles.statLblDark : ""}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent members table */}
              <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
                <div className={styles.cardHead}>
                  <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>Recent Registrations</h3>
                  <button className={`${styles.linkBtn} ${isDark ? styles.linkBtnDark : ""}`} onClick={() => setTab("members")}>
                    View all →
                  </button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr className={`${styles.thead} ${isDark ? styles.theadDark : ""}`}>
                        {["Member","Email","Profession","Blood","Status","Actions"].map((h) => (
                          <th key={h} className={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.slice(0, 6).map((m) => (
                        <tr key={m._id} className={`${styles.trow} ${isDark ? styles.trowDark : ""}`}>
                          <td className={styles.td}>
                            <div className={styles.tdMember}>
                              <Avatar m={m} size={36} />
                              <span className={`${styles.tdName} ${isDark ? styles.tdNameDark : ""}`}>{m.fullName}</span>
                            </div>
                          </td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>{m.email}</td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>{m.profession}</td>
                          <td className={styles.td}>
                            <span className={styles.bloodBadge}>{m.bloodGroup}</span>
                          </td>
                          <td className={styles.td}>
                            <span className={m.isActive ? styles.activePill : styles.inactivePill}>
                              {m.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className={styles.td}>
                            <div className={styles.tdActions}>
                              <button className={`${styles.iconBtn} ${isDark ? styles.iconBtnDark : ""}`} onClick={() => setSelected(m)}>
                                <Ic.Eye />
                              </button>
                              <button
                                className={`${styles.iconBtn} ${styles.iconBtnRed}`}
                                onClick={() => deleteMember(m._id)}
                                disabled={deleting === m._id}
                              >
                                {deleting === m._id ? <span className={styles.miniSpin} /> : <Ic.Trash />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent notifications */}
              <div className={`${styles.card} ${isDark ? styles.cardDark : ""}`}>
                <div className={styles.cardHead}>
                  <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>Recent Notifications</h3>
                  <button className={`${styles.linkBtn} ${isDark ? styles.linkBtnDark : ""}`} onClick={() => setTab("notifications")}>
                    View all →
                  </button>
                </div>
                {notifs.slice(0, 4).map((n) => {
                  const cfg = TYPE_COLORS[n.type];
                  return (
                    <div key={n._id} className={`${styles.notifRow} ${isDark ? styles.notifRowDark : ""}`}>
                      <span className={styles.ntypeDot} style={{ background: cfg.color }} />
                      <div className={styles.notifRowInfo}>
                        <span className={`${styles.notifRowTitle} ${isDark ? styles.notifRowTitleDark : ""}`}>{n.title}</span>
                        <span className={`${styles.notifRowSub} ${isDark ? styles.notifRowSubDark : ""}`}>
                          {n.readBy.length} read · {new Date(n.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                        </span>
                      </div>
                      <span className={styles.ntypeTag} style={{ background: cfg.bg, color: cfg.color }}>
                        {n.type}
                      </span>
                    </div>
                  );
                })}
                {notifs.length === 0 && (
                  <p className={`${styles.emptyMsg} ${isDark ? styles.emptyMsgDark : ""}`}>No notifications yet.</p>
                )}
              </div>
            </div>
          )}

          {/* ══ MEMBERS ══ */}
          {tab === "members" && (
            <div className={styles.section}>

              {/* Search */}
              <div className={`${styles.searchBox} ${isDark ? styles.searchBoxDark : ""}`}>
                <Ic.Search />
                <input
                  type="text"
                  placeholder="Search by name, email, profession or blood group…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${styles.searchInput} ${isDark ? styles.searchInputDark : ""}`}
                />
                {search && (
                  <button className={styles.clearSearch} onClick={() => setSearch("")}>
                    <Ic.Close />
                  </button>
                )}
              </div>

              {/* Member cards */}
              <div className={styles.memberGrid}>
                {filtered.map((m) => (
                  <div key={m._id} className={`${styles.memberCard} ${isDark ? styles.memberCardDark : ""}`}>

                    {/* Card top */}
                    <div className={styles.memberCardTop}>
                      <Avatar m={m} size={56} />
                      <span className={m.isActive ? styles.activePill : styles.inactivePill}>
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h4 className={`${styles.mName} ${isDark ? styles.mNameDark : ""}`}>{m.fullName}</h4>
                    <p className={`${styles.mPro} ${isDark ? styles.mProDark : ""}`}>{m.profession}</p>
                    <p className={`${styles.mEmail} ${isDark ? styles.mEmailDark : ""}`}>{m.email}</p>

                    <div className={styles.mTags}>
                      <span className={`${styles.bloodBadge} ${isDark ? styles.bloodBadgeDark : ""}`}>🩸 {m.bloodGroup}</span>
                      <span className={`${styles.classBadge} ${isDark ? styles.classBadgeDark : ""}`}>{m.className}</span>
                    </div>

                    <div className={styles.memberCardActions}>
                      <button
                        className={`${styles.cardBtn} ${isDark ? styles.cardBtnDark : ""}`}
                        onClick={() => setSelected(m)}
                      >
                        <Ic.Eye /> Details
                      </button>
                      <button
                        className={`${styles.cardBtn} ${isDark ? styles.cardBtnDark : ""}`}
                        onClick={() => toggleActive(m)}
                        style={{ color: m.isActive ? "#e8832a" : "#3ab060" }}
                      >
                        {m.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className={`${styles.cardBtn} ${styles.cardBtnRed}`}
                        onClick={() => deleteMember(m._id)}
                        disabled={deleting === m._id}
                      >
                        {deleting === m._id ? <span className={styles.miniSpin} /> : <Ic.Trash />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className={`${styles.emptyState} ${isDark ? styles.emptyStateDark : ""}`}>
                  <span style={{ fontSize: 48 }}>🔍</span>
                  <p>No members found matching &ldquo;{search}&rdquo;</p>
                </div>
              )}
            </div>
          )}

          {/* ══ NOTIFICATIONS LIST ══ */}
          {tab === "notifications" && (
            <div className={styles.section}>
              {notifs.length === 0 ? (
                <div className={`${styles.emptyState} ${isDark ? styles.emptyStateDark : ""}`}>
                  <span style={{ fontSize: 48 }}>🔔</span>
                  <p>No notifications sent yet. Use &ldquo;Send Notice&rdquo; to create one.</p>
                </div>
              ) : (
                <div className={styles.notifList}>
                  {notifs.map((n) => {
                    const cfg = TYPE_COLORS[n.type];
                    return (
                      <div key={n._id} className={`${styles.notifCard} ${isDark ? styles.notifCardDark : ""}`}
                        style={{ borderLeftColor: cfg.color }}>
                        <div className={styles.notifCardTop}>
                          <span className={styles.ntypeTag} style={{ background: cfg.bg, color: cfg.color }}>{n.type}</span>
                          <span className={`${styles.ntarget} ${isDark ? styles.ntargetDark : ""}`}>
                            📢 {n.targetAll ? "All Members" : "Selected"}
                          </span>
                          <span className={`${styles.ndate} ${isDark ? styles.ndateDark : ""}`}>
                            {new Date(n.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                          </span>
                          <span className={`${styles.nread} ${isDark ? styles.nreadDark : ""}`}>
                            👁 {n.readBy.length} read
                          </span>
                        </div>
                        <h4 className={`${styles.nTitle} ${isDark ? styles.nTitleDark : ""}`}>{n.title}</h4>
                        <p className={`${styles.nMsg} ${isDark ? styles.nMsgDark : ""}`}>{n.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ SEND NOTIFICATION ══ */}
          {tab === "send" && (
            <div className={styles.section}>
              <div className={`${styles.sendCard} ${isDark ? styles.sendCardDark : ""}`}>

                <div className={styles.sendCardHeader}>
                  <div className={`${styles.sendIconBox} ${isDark ? styles.sendIconBoxDark : ""}`}>
                    <Ic.Send />
                  </div>
                  <div>
                    <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>
                      Send Notification
                    </h3>
                    <p className={`${styles.sendSubtitle} ${isDark ? styles.sendSubtitleDark : ""}`}>
                      Broadcast a message to all {members.length} members
                    </p>
                  </div>
                </div>

                {sendOk && (
                  <div className={`${styles.successBanner} ${isDark ? styles.successBannerDark : ""}`}>
                    <Ic.Check /> Notification sent successfully to all members!
                  </div>
                )}

                <div className={styles.sendForm}>
                  {/* Title */}
                  <div className={styles.sendField}>
                    <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>
                      Title <span style={{ color: "#c9912a" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Upcoming Food Drive — This Friday"
                      value={notifForm.title}
                      onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                      className={`${styles.sendInput} ${isDark ? styles.sendInputDark : ""} ${formErr.title ? styles.sendInputErr : ""}`}
                    />
                    {formErr.title && <span className={styles.sendErr}>{formErr.title}</span>}
                  </div>

                  {/* Message */}
                  <div className={styles.sendField}>
                    <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>
                      Message <span style={{ color: "#c9912a" }}>*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write a clear message that members will see in their dashboard…"
                      value={notifForm.message}
                      onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                      className={`${styles.sendTextarea} ${isDark ? styles.sendInputDark : ""} ${formErr.message ? styles.sendInputErr : ""}`}
                    />
                    {formErr.message && <span className={styles.sendErr}>{formErr.message}</span>}
                  </div>

                  {/* Type selector */}
                  <div className={styles.sendField}>
                    <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>Type</label>
                    <div className={styles.typeRow}>
                      {(["info","success","warning","urgent"] as const).map((t) => {
                        const cfg = TYPE_COLORS[t];
                        const active = notifForm.type === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            className={`${styles.typeChip} ${isDark ? styles.typeChipDark : ""}`}
                            style={active ? { background: cfg.color, color: "#fff", borderColor: cfg.color } : {}}
                            onClick={() => setNotifForm({ ...notifForm, type: t })}
                          >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview */}
                  {(notifForm.title || notifForm.message) && (
                    <div className={`${styles.preview} ${isDark ? styles.previewDark : ""}`}
                      style={{ borderLeftColor: TYPE_COLORS[notifForm.type].color }}>
                      <p className={styles.previewLabel}>Preview</p>
                      {notifForm.title && (
                        <p className={`${styles.previewTitle} ${isDark ? styles.previewTitleDark : ""}`}>
                          {notifForm.title}
                        </p>
                      )}
                      {notifForm.message && (
                        <p className={`${styles.previewMsg} ${isDark ? styles.previewMsgDark : ""}`}>
                          {notifForm.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    className={`${styles.sendBtn} ${isDark ? styles.sendBtnDark : ""} ${sending ? styles.sendBtnLoading : ""}`}
                    onClick={sendNotification}
                    disabled={sending}
                  >
                    {sending ? (
                      <><span className={styles.spin} /> Sending to {members.length} members…</>
                    ) : (
                      <><Ic.Send /> Send to All {members.length} Members</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══ MEMBER DETAIL MODAL ══ */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={`${styles.modal} ${isDark ? styles.modalDark : ""}`} onClick={(e) => e.stopPropagation()}>

            <button className={`${styles.modalClose} ${isDark ? styles.modalCloseDark : ""}`} onClick={() => setSelected(null)}>
              <Ic.Close />
            </button>

            <div className={styles.modalTop}>
              <div className={`${styles.modalAvatar} ${isDark ? styles.modalAvatarDark : ""}`}>
                {selected.profilePic
                  ? <img src={selected.profilePic} alt="" className={styles.modalAvatarImg} />
                  : <span className={styles.modalAvatarInit}>{selected.fullName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div>
                <h2 className={`${styles.modalName} ${isDark ? styles.modalNameDark : ""}`}>{selected.fullName}</h2>
                <p className={`${styles.modalPro} ${isDark ? styles.modalProDark : ""}`}>{selected.profession}</p>
                <span className={selected.isActive ? styles.activePill : styles.inactivePill}>
                  {selected.isActive ? "✓ Active" : "✗ Inactive"}
                </span>
              </div>
            </div>

            <div className={styles.modalGrid}>
              {[
                ["📧 Email",       selected.email],
                ["📞 Phone",       selected.phone],
                ["🎓 Class/Desig.",selected.className],
                ["🩸 Blood Group", selected.bloodGroup],
                ["💡 Skills",      selected.skills],
                ["📍 Address",     selected.address],
                ["📅 Joined",      new Date(selected.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})],
              ].map(([label, value]) => (
                <div key={label} className={`${styles.modalRow} ${isDark ? styles.modalRowDark : ""}`}>
                  <span className={`${styles.modalLabel} ${isDark ? styles.modalLabelDark : ""}`}>{label}</span>
                  <span className={`${styles.modalVal} ${isDark ? styles.modalValDark : ""}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalToggle} ${isDark ? styles.modalToggleDark : ""}`}
                onClick={() => toggleActive(selected)}
                style={{ color: selected.isActive ? "#e8832a" : "#3ab060",
                         borderColor: selected.isActive ? "#e8832a" : "#3ab060" }}
              >
                {selected.isActive ? "Deactivate Member" : "Activate Member"}
              </button>
              <button
                className={styles.modalDelete}
                onClick={() => deleteMember(selected._id)}
                disabled={deleting === selected._id}
              >
                {deleting === selected._id ? <><span className={styles.spin} /> Removing…</> : <><Ic.Trash /> Remove Member</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}