import { useEffect, useState } from "react";
import {
  ArrowUpRight, Bell, BookOpen, Check, ChevronRight, CircleHelp,
  Command, Compass, Cpu, Feather, Flame, Grid2X2, Home, Layers3,
  Moon, MoreHorizontal, Palette, Search, Settings2, ShieldCheck,
  Sparkles, Sun, UserRound, WalletCards, Zap
} from "lucide-react";

type Tab = "home" | "essential" | "profile";
type Theme = "dark" | "light";

const navItems: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "essential", label: "Essential", icon: Command },
  { id: "profile", label: "Profile", icon: UserRound }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("ec-demo-theme");
    return saved === "light" ? "light" : "dark";
  });
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ec-demo-theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => setActiveTab("home")}>
          <span className="brand-mark"><span>e</span></span>
          <span className="brand-copy"><strong>essential</strong><small>CORE SYSTEM</small></span>
        </a>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeTab === id ? "side-link active" : "side-link"} onClick={() => setActiveTab(id)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {activeTab === id && <span className="active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-icon"><Layers3 size={17} /></div>
            <strong>Essential Core</strong>
            <span>Demo environment</span>
            <div className="system-progress"><i /></div>
            <small>FOUNDATION · v0.1</small>
          </div>
          <button className="side-link muted" onClick={() => setActiveTab("profile")}><Settings2 size={18} />Settings</button>
          <div className="side-user">
            <div className="avatar small-avatar">A</div>
            <div><strong>AX</strong><span>Personal workspace</span></div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><span>e</span></span><strong>essential</strong></div>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{navItems.find(x => x.id === activeTab)?.label}</strong></div>
          <div className="top-actions">
            <button className="icon-button search-button" aria-label="Search"><Search size={18} /></button>
            <button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={notifications ? "icon-button notification-on" : "icon-button"} aria-label="Toggle notifications" onClick={() => setNotifications(!notifications)}><Bell size={18} /></button>
            <button className="avatar top-avatar" onClick={() => setActiveTab("profile")} aria-label="Open profile">A</button>
          </div>
        </header>

        <div className="content-wrap">
          {activeTab === "home" && <HomeScreen onOpenEssential={() => setActiveTab("essential")} />}
          {activeTab === "essential" && <EssentialScreen />}
          {activeTab === "profile" && <ProfileScreen theme={theme} onThemeChange={setTheme} notifications={notifications} onNotificationsChange={setNotifications} />}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Bottom navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activeTab === id ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => setActiveTab(id)}>
            <span className="mobile-icon"><Icon size={19} strokeWidth={1.9} /></span><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeScreen({ onOpenEssential }: { onOpenEssential: () => void }) {
  return (
    <div className="page">
      <div className="welcome-row">
        <div><div className="eyebrow"><span className="eyebrow-line" /> SATURDAY, NOVEMBER 14</div><h1>Good evening<span className="accent-dot">.</span></h1><p className="page-subtitle">A calmer space for everything that matters.</p></div>
        <div className="welcome-mark"><Sparkles size={23} /></div>
      </div>

      <section className="hero-card">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-kicker"><span className="live-dot" /> THE FOUNDATION</div>
          <h2>One core.<br /><em>Infinite possibilities.</em></h2>
          <p>A shared design language for the next generation of Essential apps.</p>
          <button className="hero-button" onClick={onOpenEssential}>Explore Essential <ArrowUpRight size={16} /></button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="core-orb"><span>e</span></div><div className="orb-node node-one" /><div className="orb-node node-two" /><div className="orb-node node-three" />
        </div>
        <span className="hero-index">EC / 001</span>
      </section>

      <div className="section-heading"><div><div className="eyebrow">YOUR SPACE</div><h2>Overview</h2></div><button className="text-button" onClick={onOpenEssential}>View ecosystem <ArrowUpRight size={15} /></button></div>
      <div className="overview-grid">
        <div className="overview-card"><div className="overview-top"><span className="metric-icon teal"><Layers3 size={18} /></span><span className="metric-label">SYSTEM</span></div><strong>01</strong><p>Core foundation</p><div className="mini-bars"><i /><i /><i /><i /><i /></div></div>
        <div className="overview-card"><div className="overview-top"><span className="metric-icon gold"><Palette size={18} /></span><span className="metric-label">DESIGN TOKENS</span></div><strong>Ready</strong><p>Colors, type & spacing</p><div className="swatches"><i /><i /><i /><i /><i /></div></div>
        <div className="overview-card"><div className="overview-top"><span className="metric-icon violet"><Cpu size={18} /></span><span className="metric-label">COMPONENTS</span></div><strong>02</strong><p>Reusable primitives</p><div className="component-pills"><i /><i /><i /></div></div>
      </div>

      <div className="section-heading lower-heading"><div><div className="eyebrow">QUICK ACCESS</div><h2>Jump back in</h2></div></div>
      <div className="quick-grid">
        <button className="quick-card" onClick={onOpenEssential}><span className="quick-icon"><Command size={19} /></span><span><strong>Essential ecosystem</strong><small>Explore the product family</small></span><ArrowUpRight size={17} /></button>
        <button className="quick-card" onClick={onOpenEssential}><span className="quick-icon gold"><Palette size={19} /></span><span><strong>Design system</strong><small>Tokens and visual language</small></span><ArrowUpRight size={17} /></button>
      </div>
      <footer className="page-footer"><span>ESSENTIAL CORE</span><span>BUILT BY AX <i>·</i> 2026</span></footer>
    </div>
  );
}

function EssentialScreen() {
  const [selected, setSelected] = useState("All");
  const filters = ["All", "Products", "Resources"];
  return (
    <div className="page">
      <div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> THE ECOSYSTEM</div><h1>Essential<span className="accent-dot">.</span></h1><p className="page-subtitle">A family of tools, built on one thoughtful foundation.</p></div><div className="heading-symbol"><Command size={24} /></div></div>
      <section className="essential-feature">
        <div className="feature-copy"><div className="hero-kicker"><span className="live-dot" /> THE SHARED FOUNDATION</div><h2>Everything works<br /><em>better together.</em></h2><p>Shared components. Familiar interactions. A consistent experience across every Essential product.</p><div className="feature-tags"><span>DESIGN</span><span>ENGINEERING</span><span>EXPERIENCE</span></div></div>
        <div className="feature-graphic"><div className="feature-ring ring-a" /><div className="feature-ring ring-b" /><div className="feature-core">e<span>AX</span></div><div className="feature-spark spark-a">✳</div><div className="feature-spark spark-b">✧</div></div>
      </section>
      <div className="section-heading ecosystem-heading"><div><div className="eyebrow">DISCOVER</div><h2>Explore the collection</h2></div><span className="collection-count">03 ITEMS</span></div>
      <div className="filter-row">{filters.map(f => <button key={f} className={selected === f ? "filter-chip selected" : "filter-chip"} onClick={() => setSelected(f)}>{f}</button>)}</div>
      <div className="product-grid">
        {(selected === "All" || selected === "Products") && <>
          <article className="product-card product-study"><div className="product-card-top"><span className="product-icon"><BookOpen size={20} /></span><span className="status-pill in-progress">IN DEVELOPMENT</span></div><div className="product-art study-art"><div className="study-sheet"><i /><i /><i /><b /></div><div className="study-spark">✳</div></div><div className="product-info"><span className="product-category">LEARNING / PRODUCTIVITY</span><h3>EssentialStudy</h3><p>Your academic space to plan, learn and stay organised.</p><span className="product-link">Explore concept <ArrowUpRight size={14} /></span></div></article>
          <article className="product-card product-home"><div className="product-card-top"><span className="product-icon"><Grid2X2 size={20} /></span><span className="status-pill concept">CONCEPT</span></div><div className="product-art home-art"><div className="home-window"><div /><div /><div /><div /></div><div className="home-orbit" /></div><div className="product-info"><span className="product-category">ANDROID / PERSONALISATION</span><h3>AX Home</h3><p>A considered home for your Android experience.</p><span className="product-link">Explore concept <ArrowUpRight size={14} /></span></div></article>
        </>}
        {(selected === "All" || selected === "Resources") && <article className="product-card product-core"><div className="product-card-top"><span className="product-icon"><Command size={20} /></span><span className="status-pill active-status">ACTIVE</span></div><div className="product-art core-art"><div className="core-stack"><i /><i /><i /></div><span>CORE</span></div><div className="product-info"><span className="product-category">FOUNDATION / DESIGN SYSTEM</span><h3>Essential Core</h3><p>The shared design system and component foundation.</p><span className="product-link">You are here <Check size={14} /></span></div></article>}
        {selected === "Products" && <article className="product-card product-melo"><div className="product-card-top"><span className="product-icon"><Feather size={20} /></span><span className="status-pill concept">CONCEPT</span></div><div className="product-art melo-art"><div className="melo-heart">m.</div><div className="melo-bubble" /></div><div className="product-info"><span className="product-category">PRIVATE / SOCIAL</span><h3>Melo</h3><p>A quieter space for conversations with close friends.</p><span className="product-link">Explore concept <ArrowUpRight size={14} /></span></div></article>}
      </div>
      <div className="principle-banner"><div className="principle-icon"><ShieldCheck size={20} /></div><div><strong>One experience, not one-size-fits-all.</strong><p>Each product keeps its own purpose while sharing the same quality bar.</p></div><Sparkles size={18} className="principle-spark" /></div>
      <footer className="page-footer"><span>THE ESSENTIAL ECOSYSTEM</span><span>BUILT BY AX <i>·</i> 2026</span></footer>
    </div>
  );
}

function ProfileScreen({ theme, onThemeChange, notifications, onNotificationsChange }: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
}) {
  const [displayName, setDisplayName] = useState("AX");
  const [editing, setEditing] = useState(false);
  return (
    <div className="page profile-page">
      <div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR ACCOUNT</div><h1>Profile<span className="accent-dot">.</span></h1><p className="page-subtitle">Your identity and preferences.</p></div><div className="heading-symbol"><UserRound size={24} /></div></div>
      <section className="profile-card">
        <div className="profile-cover"><div className="cover-orbit cover-orbit-one" /><div className="cover-orbit cover-orbit-two" /><span>PERSONAL WORKSPACE / 001</span></div>
        <div className="profile-main"><div className="avatar profile-avatar">A</div><div className="profile-name-block">{editing ? <input value={displayName} onChange={e => setDisplayName(e.target.value)} aria-label="Display name" autoFocus /> : <h2>{displayName}</h2>}<p>Essential Core member</p></div><button className="outline-button edit-button" onClick={() => setEditing(!editing)}>{editing ? <><Check size={15} /> Save</> : "Edit profile"}</button></div>
        <div className="profile-meta"><div><span>USERNAME</span><strong>@4ksh2574</strong></div><div><span>ROLE</span><strong>Creator</strong></div><div><span>WORKSPACE</span><strong>Personal</strong></div></div>
      </section>

      <div className="section-heading settings-heading"><div><div className="eyebrow">PREFERENCES</div><h2>App settings</h2></div></div>
      <section className="settings-card">
        <div className="setting-row"><span className="setting-icon"><Palette size={18} /></span><div className="setting-copy"><strong>Appearance</strong><small>Choose how Essential looks</small></div><div className="theme-switch"><button className={theme === "light" ? "chosen" : ""} onClick={() => onThemeChange("light")} aria-label="Light theme"><Sun size={15} /></button><button className={theme === "dark" ? "chosen" : ""} onClick={() => onThemeChange("dark")} aria-label="Dark theme"><Moon size={15} /></button></div></div>
        <div className="setting-row"><span className="setting-icon"><Bell size={18} /></span><div className="setting-copy"><strong>Notifications</strong><small>Product updates and activity</small></div><button className={notifications ? "toggle on" : "toggle"} onClick={() => onNotificationsChange(!notifications)} aria-label="Toggle notifications"><i /></button></div>
        <button className="setting-row setting-button"><span className="setting-icon"><ShieldCheck size={18} /></span><span className="setting-copy"><strong>Privacy & security</strong><small>Your data and account controls</small></span><ChevronRight size={17} className="setting-chevron" /></button>
        <button className="setting-row setting-button"><span className="setting-icon"><CircleHelp size={18} /></span><span className="setting-copy"><strong>Help & feedback</strong><small>Get help with Essential Core</small></span><ChevronRight size={17} className="setting-chevron" /></button>
      </section>
      <div className="profile-version"><span>ESSENTIAL CORE</span><strong>Version 0.1.0 · Demo</strong></div>
      <footer className="page-footer"><span>YOUR SPACE, YOUR RULES</span><span>BUILT BY AX <i>·</i> 2026</span></footer>
    </div>
  );
}

export default App;
