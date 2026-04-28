// src/app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

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
  type: string;
  targetAll: boolean;
  readBy: string[];
  createdAt: string;
}
type Tab = "dashboard" | "members" | "notifications" | "send";
type Theme = "blue" | "dark";

const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Members: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Delete: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  Moon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

export default function AdminPage(): JSX.Element {
  const router = useRouter();
  const [tab,       setTab]       = useState<Tab>("dashboard");
  const [members,   setMembers]   = useState<Member[]>([]);
  const [notifs,    setNotifs]    = useState<Notif[]>([]);
  const [theme,     setTheme]     = useState<Theme>("blue");
  const [loading,   setLoading]   = useState(true);
  const [animate,   setAnimate]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState<Member | null>(null);
  const [sending,   setSending]   = useState(false);
  const [sendDone,  setSendDone]  = useState(false);
  const [notifForm, setNotifForm] = useState({
    title: "", message: "", type: "info", targetAll: true,
  });
  const [formErr, setFormErr] = useState<Record<string,string>>({});

  const isDark = theme === "dark";

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

  /* ── Auth check ── */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) { router.replace("/admin/login"); return; }
      const data = await res.json();
      if (data.user?.role !== "admin") { router.replace("/"); return; }
      setLoading(false);
      setTimeout(() => setAnimate(true), 60);
    })();
  }, [router]);

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/members");
    if (res.ok) { const d = await res.json(); setMembers(d.members || []); }
  }, []);

  const fetchNotifs = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) { const d = await res.json(); setNotifs(d.notifications || []); }
  }, []);

  useEffect(() => { if (!loading) { fetchMembers(); fetchNotifs(); } }, [loading, fetchMembers, fetchNotifs]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function toggleActive(m: Member) {
    await fetch(`/api/members/${m._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !m.isActive }),
    });
    fetchMembers();
  }

  async function deleteMember(id: string) {
    if (!confirm("Remove this member permanently?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setSelected(null);
    fetchMembers();
  }

  async function sendNotification() {
    const e: Record<string,string> = {};
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
      setSendDone(true);
      setNotifForm({ title:"", message:"", type:"info", targetAll:true });
      fetchNotifs();
      setTimeout(() => setSendDone(false), 3000);
    }
    setSending(false);
  }

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.profession.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive   = members.filter((m) => m.isActive).length;
  const totalNotifs   = notifs.length;
  const totalReadRate = notifs.length > 0
    ? Math.round((notifs.reduce((a, n) => a + n.readBy.length, 0) / (notifs.length * Math.max(members.length, 1))) * 100)
    : 0;

  if (loading) return (
    <div className={`${styles.loadScreen} ${isDark ? styles.loadScreenDark : ""}`}>
      <div className={styles.spinner} />
      <p className={styles.loadTxt}>Loading admin panel…</p>
    </div>
  );

  return (
    <div className={`${styles.page} ${isDark ? styles.pageDark : ""} ${animate ? styles.pageIn : ""}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className={`${styles.sidebar} ${isDark ? styles.sidebarDark : ""}`}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg width="26" height="26" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="32" rx="26" ry="24" fill="#1a2d7c"/>
              <ellipse cx="40" cy="32" rx="20" ry="18" fill="#243a96"/>
              <path d="M40 18L43 26L51 26L45 31L47 39L40 34L33 39L35 31L29 26L37 26Z" fill="#c9912a"/>
              <rect x="36" y="50" width="8" height="18" rx="4" fill="#1a2d7c"/>
            </svg>
          </div>
          <div>
            <div className={`${styles.brandTitle} ${isDark ? styles.brandTitleDark : ""}`}>Al Falah</div>
            <div className={styles.brandRole}>Admin Panel</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {([
            ["dashboard",     "Dashboard",     <Icon.Dashboard     key="d"/>],
            ["members",       "Members",       <Icon.Members       key="m"/>],
            ["notifications", "Notifications", <Icon.Bell          key="b"/>],
            ["send",          "Send Notice",   <Icon.Send          key="s"/>],
          ] as [Tab, string, JSX.Element][]).map(([t, label, icon]) => (
            <button
              key={t}
              className={[
                styles.navBtn,
                tab === t           ? styles.navActive     : "",
                isDark              ? styles.navBtnDark    : "",
                tab === t && isDark ? styles.navActiveDark : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setTab(t)}
            >
              {icon} <span>{label}</span>
              {t === "members" && (
                <span className={styles.chip}>{members.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sideFooter}>
          <button className={`${styles.themeBtn} ${isDark ? styles.themeBtnDark : ""}`} onClick={toggleTheme}>
            {isDark ? <Icon.Sun /> : <Icon.Moon />}
            <span>{isDark ? "Blue Mode" : "Dark Mode"}</span>
          </button>
          <div className={`${styles.adminBadge} ${isDark ? styles.adminBadgeDark : ""}`}>
            <span className={styles.adminDot} />
            <span>Admin</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <Icon.Logout /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className={`${styles.main} ${isDark ? styles.mainDark : ""}`}>

        {/* Header */}
        <div className={`${styles.header} ${isDark ? styles.headerDark : ""}`}>
          <div>
            <h1 className={`${styles.pageTitle} ${isDark ? styles.pageTitleDark : ""}`}>
              {tab === "dashboard"     && "Dashboard Overview"}
              {tab === "members"       && "Member Management"}
              {tab === "notifications" && "All Notifications"}
              {tab === "send"          && "Send Notification"}
            </h1>
            <p className={`${styles.pageSub} ${isDark ? styles.pageSubDark : ""}`}>
              Al Falah Foundation — Admin Control Panel
            </p>
          </div>
          <div className={`${styles.headerRight} ${isDark ? styles.headerRightDark : ""}`}>
            <span className={styles.adminPill}>🛡️ Admin</span>
          </div>
        </div>

        <div className={styles.content}>

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <>
              {/* Stats */}
              <div className={styles.statsRow}>
                {[
                  { icon:"👥", label:"Total Members",  value: members.length,   color:"#1a2d7c" },
                  { icon:"✅", label:"Active Members", value: totalActive,       color:"#3ab060" },
                  { icon:"🔔", label:"Notifications",  value: totalNotifs,      color:"#c9912a" },
                  { icon:"📈", label:"Read Rate",      value: `${totalReadRate}%`, color:"#2d6be4" },
                ].map((s) => (
                  <div key={s.label} className={`${styles.statBox} ${isDark ? styles.statBoxDark : ""}`}>
                    <div className={styles.statTop}>
                      <span className={styles.statEmoji}>{s.icon}</span>
                      <div className={styles.statDot} style={{ background: s.color }} />
                    </div>
                    <div className={`${styles.statNum} ${isDark ? styles.statNumDark : ""}`}>{s.value}</div>
                    <div className={`${styles.statLbl} ${isDark ? styles.statLblDark : ""}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent members */}
              <div className={`${styles.tableCard} ${isDark ? styles.tableCardDark : ""}`}>
                <div className={styles.tableHead}>
                  <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`}>Recent Members</h3>
                  <button className={`${styles.viewAllBtn} ${isDark ? styles.viewAllBtnDark : ""}`} onClick={() => setTab("members")}>
                    View All →
                  </button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr className={`${styles.thead} ${isDark ? styles.theadDark : ""}`}>
                        <th>Name</th><th>Email</th><th>Profession</th><th>Blood</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.slice(0,5).map((m) => (
                        <tr key={m._id} className={`${styles.trow} ${isDark ? styles.trowDark : ""}`}>
                          <td className={`${styles.tdName} ${isDark ? styles.tdNameDark : ""}`}>
                            <div className={`${styles.miniAvatar} ${isDark ? styles.miniAvatarDark : ""}`}>
                              {m.profilePic
                                ? <img src={m.profilePic} alt="" className={styles.miniAvatarImg} />
                                : m.fullName.charAt(0).toUpperCase()
                              }
                            </div>
                            {m.fullName}
                          </td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>{m.email}</td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>{m.profession}</td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>
                            <span className={styles.bloodTag}>{m.bloodGroup}</span>
                          </td>
                          <td className={`${styles.td} ${isDark ? styles.tdDark : ""}`}>
                            <span className={m.isActive ? styles.activePill : styles.inactivePill}>
                              {m.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent notifications */}
              <div className={`${styles.tableCard} ${isDark ? styles.tableCardDark : ""}`}>
                <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`} style={{marginBottom:16}}>Recent Notifications</h3>
                {notifs.slice(0,4).map((n) => (
                  <div key={n._id} className={`${styles.notifRow} ${isDark ? styles.notifRowDark : ""}`}>
                    <div className={styles.notifRowLeft}>
                      <span className={`${styles.typeDot} ${n.type === "urgent" ? styles.dotRed : n.type === "warning" ? styles.dotOrange : n.type === "success" ? styles.dotGreen : styles.dotBlue}`} />
                      <div>
                        <div className={`${styles.notifRowTitle} ${isDark ? styles.notifRowTitleDark : ""}`}>{n.title}</div>
                        <div className={`${styles.notifRowSub} ${isDark ? styles.notifRowSubDark : ""}`}>{n.readBy.length} member{n.readBy.length !== 1 ? "s" : ""} read</div>
                      </div>
                    </div>
                    <span className={`${styles.notifDate} ${isDark ? styles.notifDateDark : ""}`}>
                      {new Date(n.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── MEMBERS TAB ── */}
          {tab === "members" && (
            <>
              {/* Search */}
              <div className={`${styles.searchBar} ${isDark ? styles.searchBarDark : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:"#8896b3"}}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text" placeholder="Search members by name, email or profession…"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className={`${styles.searchInput} ${isDark ? styles.searchInputDark : ""}`}
                />
                {search && (
                  <button onClick={() => setSearch("")} className={styles.clearBtn}><Icon.Close /></button>
                )}
              </div>

              {/* Members grid */}
              <div className={styles.membersGrid}>
                {filtered.map((m) => (
                  <div key={m._id} className={`${styles.memberCard} ${isDark ? styles.memberCardDark : ""}`}>
                    <div className={styles.memberCardTop}>
                      <div className={`${styles.mAvatar} ${isDark ? styles.mAvatarDark : ""}`}>
                        {m.profilePic
                          ? <img src={m.profilePic} alt="" className={styles.mAvatarImg} />
                          : <span className={styles.mAvatarInit}>{m.fullName.charAt(0).toUpperCase()}</span>
                        }
                      </div>
                      <span className={m.isActive ? styles.activePill : styles.inactivePill}>
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h4 className={`${styles.mName} ${isDark ? styles.mNameDark : ""}`}>{m.fullName}</h4>
                    <p className={`${styles.mProfession} ${isDark ? styles.mProfessionDark : ""}`}>{m.profession}</p>
                    <p className={`${styles.mEmail} ${isDark ? styles.mEmailDark : ""}`}>{m.email}</p>
                    <div className={styles.mTags}>
                      <span className={`${styles.bloodTag} ${isDark ? styles.bloodTagDark : ""}`}>🩸 {m.bloodGroup}</span>
                      <span className={`${styles.classTag} ${isDark ? styles.classTagDark : ""}`}>{m.className}</span>
                    </div>
                    <div className={styles.memberCardActions}>
                      <button
                        className={`${styles.cardActionBtn} ${isDark ? styles.cardActionBtnDark : ""}`}
                        onClick={() => setSelected(m)}
                      >
                        <Icon.Eye /> Details
                      </button>
                      <button
                        className={`${styles.cardActionBtn} ${isDark ? styles.cardActionBtnDark : ""}`}
                        onClick={() => toggleActive(m)}
                        style={{ color: m.isActive ? "#e8832a" : "#3ab060" }}
                      >
                        {m.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className={`${styles.cardActionBtn} ${styles.deleteBtn}`}
                        onClick={() => deleteMember(m._id)}
                      >
                        <Icon.Delete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className={`${styles.empty} ${isDark ? styles.emptyDark : ""}`}>
                  <span style={{fontSize:44}}>🔍</span>
                  <p>No members found</p>
                </div>
              )}
            </>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {tab === "notifications" && (
            <div className={styles.notifList}>
              {notifs.length === 0 ? (
                <div className={`${styles.empty} ${isDark ? styles.emptyDark : ""}`}>
                  <span style={{fontSize:44}}>🔔</span><p>No notifications sent yet</p>
                </div>
              ) : notifs.map((n) => (
                <div key={n._id} className={`${styles.notifAdminCard} ${isDark ? styles.notifAdminCardDark : ""}`}>
                  <div className={styles.notifAdminTop}>
                    <span className={`${styles.typeTag} ${ n.type==="urgent"?"typeUrgent": n.type==="warning"?"typeWarning": n.type==="success"?"typeSuccess":"typeInfo" }`}>{n.type}</span>
                    <span className={`${styles.notifDate} ${isDark ? styles.notifDateDark : ""}`}>
                      {new Date(n.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                    </span>
                    <span className={`${styles.readCount} ${isDark ? styles.readCountDark : ""}`}>
                      {n.readBy.length} read
                    </span>
                    <span className={`${styles.scopeTag} ${isDark ? styles.scopeTagDark : ""}`}>
                      {n.targetAll ? "All Members" : "Selected"}
                    </span>
                  </div>
                  <h4 className={`${styles.nTitle} ${isDark ? styles.nTitleDark : ""}`}>{n.title}</h4>
                  <p className={`${styles.nMsg} ${isDark ? styles.nMsgDark : ""}`}>{n.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── SEND TAB ── */}
          {tab === "send" && (
            <div className={`${styles.sendCard} ${isDark ? styles.sendCardDark : ""}`}>
              <h3 className={`${styles.cardTitle} ${isDark ? styles.cardTitleDark : ""}`} style={{marginBottom:24}}>
                Send Notification to Members
              </h3>

              {sendDone && (
                <div className={`${styles.successBanner} ${isDark ? styles.successBannerDark : ""}`}>
                  ✅ Notification sent successfully!
                </div>
              )}

              <div className={styles.sendForm}>
                <div className={styles.sendField}>
                  <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>Title *</label>
                  <input
                    type="text" placeholder="Notification title"
                    value={notifForm.title}
                    onChange={(e) => setNotifForm({...notifForm, title: e.target.value})}
                    className={`${styles.sendInput} ${isDark ? styles.sendInputDark : ""} ${formErr.title ? styles.sendInputErr : ""}`}
                  />
                  {formErr.title && <span className={styles.sendErr}>{formErr.title}</span>}
                </div>

                <div className={styles.sendField}>
                  <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>Message *</label>
                  <textarea
                    rows={5} placeholder="Write your message to members…"
                    value={notifForm.message}
                    onChange={(e) => setNotifForm({...notifForm, message: e.target.value})}
                    className={`${styles.sendTextarea} ${isDark ? styles.sendInputDark : ""} ${formErr.message ? styles.sendInputErr : ""}`}
                  />
                  {formErr.message && <span className={styles.sendErr}>{formErr.message}</span>}
                </div>

                {/* Type */}
                <div className={styles.sendField}>
                  <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>Type</label>
                  <div className={styles.typeRow}>
                    {(["info","success","warning","urgent"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={[
                          styles.typeBtn,
                          notifForm.type === t ? styles.typeBtnActive : "",
                          isDark ? styles.typeBtnDark : "",
                          notifForm.type === t && isDark ? styles.typeBtnActiveDark : "",
                        ].filter(Boolean).join(" ")}
                        style={notifForm.type === t ? {
                          background: t==="urgent"?"linear-gradient(135deg,#c94444,#e05555)": t==="warning"?"linear-gradient(135deg,#c97a2a,#e8832a)": t==="success"?"linear-gradient(135deg,#2a9652,#3ab060)":"linear-gradient(135deg,#1a5ec9,#2d6be4)",
                          borderColor:"transparent", color:"#fff",
                        } : {}}
                        onClick={() => setNotifForm({...notifForm, type: t})}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div className={styles.sendField}>
                  <label className={`${styles.sendLabel} ${isDark ? styles.sendLabelDark : ""}`}>Send To</label>
                  <div className={styles.targetRow}>
                    <button
                      type="button"
                      className={`${styles.targetBtn} ${notifForm.targetAll ? styles.targetActive : ""} ${isDark ? styles.targetBtnDark : ""}`}
                      onClick={() => setNotifForm({...notifForm, targetAll: true})}
                    >
                      👥 All Members
                    </button>
                  </div>
                </div>

                <button
                  className={`${styles.sendSubmit} ${isDark ? styles.sendSubmitDark : ""} ${sending ? styles.sendSubmitLoading : ""}`}
                  onClick={sendNotification}
                  disabled={sending}
                >
                  {sending ? (
                    <><span className={styles.spin} /> Sending…</>
                  ) : (
                    <><Icon.Send /> Send Notification</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══ MEMBER DETAIL MODAL ══ */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div
            className={`${styles.modal} ${isDark ? styles.modalDark : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={`${styles.modalClose} ${isDark ? styles.modalCloseDark : ""}`} onClick={() => setSelected(null)}>
              <Icon.Close />
            </button>

            <div className={styles.modalHeader}>
              <div className={`${styles.modalAvatar} ${isDark ? styles.modalAvatarDark : ""}`}>
                {selected.profilePic
                  ? <img src={selected.profilePic} alt="" className={styles.modalAvatarImg} />
                  : <span className={styles.modalAvatarInit}>{selected.fullName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div>
                <h2 className={`${styles.modalName} ${isDark ? styles.modalNameDark : ""}`}>{selected.fullName}</h2>
                <p className={`${styles.modalProfession} ${isDark ? styles.modalProfessionDark : ""}`}>{selected.profession}</p>
                <span className={selected.isActive ? styles.activePill : styles.inactivePill}>
                  {selected.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className={styles.modalGrid}>
              {[
                ["Email",        selected.email],
                ["Phone",        selected.phone],
                ["Class/Desig.", selected.className],
                ["Blood Group",  selected.bloodGroup],
                ["Skills",       selected.skills],
                ["Address",      selected.address],
                ["Joined",       new Date(selected.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})],
              ].map(([label, value]) => (
                <div key={label} className={`${styles.modalRow} ${isDark ? styles.modalRowDark : ""}`}>
                  <span className={`${styles.modalLabel} ${isDark ? styles.modalLabelDark : ""}`}>{label}</span>
                  <span className={`${styles.modalVal} ${isDark ? styles.modalValDark : ""}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.modalToggleBtn} ${isDark ? styles.modalToggleBtnDark : ""}`}
                onClick={() => { toggleActive(selected); setSelected({...selected, isActive: !selected.isActive}); }}
                style={{color: selected.isActive ? "#e8832a" : "#3ab060"}}
              >
                {selected.isActive ? "Deactivate Member" : "Activate Member"}
              </button>
              <button className={styles.modalDeleteBtn} onClick={() => deleteMember(selected._id)}>
                <Icon.Delete /> Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}