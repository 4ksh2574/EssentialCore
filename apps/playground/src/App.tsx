import { useEffect, useRef, useState, type TouchEvent, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  ArrowLeft, ArrowUpRight, Bell, BookOpen, BriefcaseBusiness, Check, ChevronRight, CircleHelp,
  Command, Feather, Grid2X2, Home, Layers3, Moon, MoreHorizontal,
  Palette, Search, Settings2, ShieldCheck, Sparkles, Sun, UserRound,
  Accessibility, Languages, Info, SlidersHorizontal, MousePointer2, ListChecks, TextCursorInput
} from "lucide-react";

type Tab = "home" | "essential" | "settings" | "profile";
type Theme = "dark" | "light";

const navItems: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "essential", label: "Essential", icon: Command },
  { id: "settings", label: "Settings", icon: Settings2 }
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("ec-demo-theme");
    return saved === "light" ? "light" : "dark";
  });
  const [notifications, setNotifications] = useState(true);
  const [profileActionsOpen, setProfileActionsOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [settingsNavigationKey, setSettingsNavigationKey] = useState(0);
  const [settingsDetailOpen, setSettingsDetailOpen] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartedOnControl = useRef(false);
  const pillDragging = useRef(false);

  const navigateToTab = (nextTab: Tab) => {
    if (nextTab === "settings") setSettingsNavigationKey(value => value + 1);
    setActiveTab(nextTab);
    setHeaderCollapsed(false);
    setProfileActionsOpen(false);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ec-demo-theme", theme);
  }, [theme]);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest(".profile-action-anchor")) {
        setProfileActionsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
    const target = event.target as HTMLElement | null;
    touchStartedOnControl.current = Boolean(target?.closest(
      "input,button,textarea,select,[role='slider'],.core-demo-slider-wrap"
    ));
  };
  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const deltaY = touchStartY.current - event.changedTouches[0].clientY;
    const deltaX = touchStartX.current - event.changedTouches[0].clientX;
    const startedOnControl = touchStartedOnControl.current;
    touchStartedOnControl.current = false;

    // Controls own their gestures; never reinterpret a slider drag as page navigation.
    if (startedOnControl) return;

    // Keep page swipes off profile and nested settings screens.
    const horizontalSwipeDisabled = activeTab === "profile" || (activeTab === "settings" && settingsDetailOpen);
    if (!horizontalSwipeDisabled && Math.abs(deltaX) > 64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const currentIndex = navItems.findIndex(item => item.id === activeTab);
      const nextIndex = Math.max(0, Math.min(navItems.length - 1, currentIndex + (deltaX > 0 ? 1 : -1)));
      if (nextIndex !== currentIndex) navigateToTab(navItems[nextIndex].id);
      return;
    }

    if (deltaY > 48) { setHeaderCollapsed(true); setProfileActionsOpen(false); }
    if (deltaY < -48) setHeaderCollapsed(false);
  };

  const handlePillPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeTab === "profile" || (activeTab === "settings" && settingsDetailOpen)) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pillDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setProfileActionsOpen(false);
  };
  const updatePillPreview = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pillDragging.current || activeTab === "profile" || (activeTab === "settings" && settingsDetailOpen)) return;
    const track = event.currentTarget.parentElement;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
    const index = Math.min(navItems.length - 1, Math.floor(relativeX / (rect.width / navItems.length)));
    const nextTab = navItems[index].id;
    if (nextTab !== activeTab) navigateToTab(nextTab);
  };
  const handlePillPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pillDragging.current) return;
    updatePillPreview(event);
    pillDragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleProfileTap = () => {
    if (profileActionsOpen) {
      setProfileActionsOpen(false);
      setActiveTab("profile");
      setHeaderCollapsed(false);
    } else {
      setProfileActionsOpen(true);
    }
  };

  return (
    <div className={headerCollapsed ? "app-shell header-is-collapsed" : "app-shell"}>
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={event => { event.preventDefault(); navigateToTab("home"); }}>
          <span className="brand-mark"><span>e</span></span>
          <span className="brand-copy"><strong>essential</strong><small>CORE SYSTEM</small></span>
        </a>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeTab === id ? "side-link active" : "side-link"} onClick={() => navigateToTab(id)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {activeTab === id && <span className="active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card"><div className="system-icon"><Layers3 size={17} /></div><strong>Essential Core</strong><span>Demo environment</span><div className="system-progress"><i /></div><small>FOUNDATION · v0.1</small></div>
          <div className="side-user"><div className="avatar small-avatar">A</div><div><strong>AX</strong><span>Personal workspace</span></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <main className={`main-area ${activeTab === "settings" ? "settings-active" : ""}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className={`topbar home-topbar ${headerCollapsed ? "header-collapsed" : ""}`}>
          {activeTab === "home" && <HomeHeader />}
          {activeTab !== "home" && activeTab !== "settings" && <div className="mobile-brand"><span className="brand-mark"><span>e</span></span><strong>essential</strong></div>}
          {activeTab !== "settings" && <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{navItems.find(x => x.id === activeTab)?.label}</strong></div>}
          <div className={profileActionsOpen ? "top-actions profile-action-anchor actions-open" : "top-actions profile-action-anchor"}>
            <button className="avatar top-avatar" onClick={handleProfileTap} aria-label="Profile and quick settings" aria-expanded={profileActionsOpen}>A</button>
            <div className="profile-quick-actions" aria-hidden={!profileActionsOpen}>
              <button className={notifications ? "icon-button notification-on" : "icon-button"} aria-label="Toggle notifications" onClick={() => setNotifications(!notifications)}><Bell size={18} /></button>
              <button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        <div className="content-wrap">
          {activeTab === "home" && <HomeScreen onOpenEssential={() => navigateToTab("essential")} />}
          {activeTab === "essential" && <EssentialScreen />}
          {activeTab === "settings" && <SettingsScreen key={settingsNavigationKey} theme={theme} notifications={notifications} onNotificationsChange={setNotifications} onOpenProfile={() => { setActiveTab("profile"); setHeaderCollapsed(false); setProfileActionsOpen(false); }} onDetailChange={setSettingsDetailOpen} />}
          {activeTab === "profile" && <ProfileScreen />}
        </div>
      </main>

      <nav className="mobile-nav liquid-nav" aria-label="Main navigation">
        <div className="liquid-nav-track">
          {(() => {
            const selected = navItems.find(item => item.id === activeTab) ?? navItems[0];
            const SelectedIcon = selected.icon;
            return (
              <div
                className="liquid-nav-drop"
                style={{ transform: `translate3d(${Math.max(0, navItems.findIndex(item => item.id === activeTab)) * 100}%, -50%, 0)` }}
                onPointerDown={handlePillPointerDown}
                onPointerMove={updatePillPreview}
                onPointerUp={handlePillPointerUp}
                onPointerCancel={() => { pillDragging.current = false; }}
                onClick={() => { if (activeTab === "settings") navigateToTab("settings"); else if (activeTab === "profile") navigateToTab("home"); }}
                role="slider"
                aria-label="Slide to preview pages or tap Settings to return to its main page"
                aria-valuemin={0}
                aria-valuemax={navItems.length - 1}
                aria-valuenow={navItems.findIndex(item => item.id === activeTab)}
              >
                <SelectedIcon className="liquid-nav-active-icon" size={18} strokeWidth={2.1} />
                <span>{selected.label}</span>
              </div>
            );
          })()}
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={activeTab === id ? "mobile-nav-item active" : "mobile-nav-item"}
              aria-label={label}
              aria-current={activeTab === id ? "page" : undefined}
              onClick={() => navigateToTab(id)}
            >
              <Icon size={17} strokeWidth={1.9} />
            </button>
          ))}
        </div>
      </nav>   </div>
  );
}

function HomeHeader() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 16 ? "Good afternoon" : "Good evening";
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", month: "long", day: "numeric"
  }).format(now).toUpperCase();
  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true
  }).format(now);
  return (
    <div className="home-header-copy">
      <h1>{greeting}<span className="accent-dot">,</span></h1>
      <div className="home-header-meta"><span className="home-time">{timeLabel}</span><span className="home-meta-divider" /><span className="eyebrow home-date">{dateLabel}</span></div>
    </div>
  );
}

function HomeScreen({ onOpenEssential }: { onOpenEssential: () => void }) {
  return (
    <div className="page home-minimal">
      <button className="home-ecosystem-link" onClick={onOpenEssential}>
        <span>ESSENTIAL ECOSYSTEM</span><ArrowUpRight size={15} />
      </button>
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

function ProfileScreen() {
  const [displayName, setDisplayName] = useState("AX");
  const [editing, setEditing] = useState(false);
  return (
    <div className="page profile-page">
      <div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR ACCOUNT</div><h1>Profile<span className="accent-dot">.</span></h1><p className="page-subtitle">Your identity and personal workspace.</p></div><div className="heading-symbol"><UserRound size={24} /></div></div>
      <section className="profile-card">
        <div className="profile-cover"><div className="cover-orbit cover-orbit-one" /><div className="cover-orbit cover-orbit-two" /><span>PERSONAL WORKSPACE / 001</span></div>
        <div className="profile-main"><div className="avatar profile-avatar">A</div><div className="profile-name-block">{editing ? <input value={displayName} onChange={e => setDisplayName(e.target.value)} aria-label="Display name" autoFocus /> : <h2>{displayName}</h2>}<p>Essential Core member</p></div><button className="outline-button edit-button" onClick={() => setEditing(!editing)}>{editing ? <><Check size={15} /> Save</> : "Edit profile"}</button></div>
        <div className="profile-meta"><div><span>USERNAME</span><strong>@4ksh2574</strong></div><div><span>ROLE</span><strong>Creator</strong></div><div><span>WORKSPACE</span><strong>Personal</strong></div></div>
      </section>
      <footer className="page-footer"><span>YOUR SPACE, YOUR IDENTITY</span><span>BUILT BY AX <i>·</i> 2026</span></footer>
    </div>
  );
}

function LiquidToggle({ checked, onChange, label, className = "" }: { checked: boolean; onChange: (value: boolean) => void; label: string; className?: string }) {
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(checked ? 1 : 0);
  const moved = useRef(false);
  const getProgress = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const track = event.currentTarget.querySelector(".liquid-theme-track");
    if (!track) return dragStartProgress.current;
    const rect = track.getBoundingClientRect();
    const thumbWidth = rect.width * 0.557;
    const minCenter = rect.left + thumbWidth / 2 + 2;
    const maxCenter = rect.right - thumbWidth / 2 - 2;
    return Math.max(0, Math.min(1, (event.clientX - minCenter) / Math.max(1, maxCenter - minCenter)));
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    dragStartX.current = event.clientX;
    dragStartProgress.current = checked ? 1 : 0;
    moved.current = false;
    setDragProgress(getProgress(event));
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragProgress === null) return;
    if (Math.abs(event.clientX - dragStartX.current) > 3) moved.current = true;
    setDragProgress(getProgress(event));
  };
  const handlePointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragProgress === null) return;
    const finalProgress = getProgress(event);
    const next = moved.current ? finalProgress >= 0.5 : !checked;
    setDragProgress(null);
    onChange(next);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const visualProgress = dragProgress ?? (checked ? 1 : 0);
  const visualOn = dragProgress === null ? checked : dragProgress >= 0.5;
  return (
    <button
      className={`liquid-theme-toggle ${visualOn ? "is-on" : "is-off"} ${dragProgress !== null ? "is-dragging" : ""} ${className}`}
      type="button" role="switch" aria-checked={checked} aria-label={label}
      style={{ "--toggle-progress": visualProgress } as React.CSSProperties}
      onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}
      onKeyDown={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); onChange(!checked); } }}
    >
      <span className="liquid-theme-track"><span className="liquid-theme-thumb"><span className="liquid-theme-glint" /></span></span>
    </button>
  );
}

function SettingsScreen({ theme, notifications, onNotificationsChange, onOpenProfile, onDetailChange }: {
  theme: Theme; notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void; onOpenProfile: () => void;
  onDetailChange: (isOpen: boolean) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customDemoOn, setCustomDemoOn] = useState(false);

  const [sliderValue, setSliderValue] = useState(65);
  const [sliderPressed, setSliderPressed] = useState(false);
  const sliderDragging = useRef(false);
  const sliderPointerOffset = useRef(0);
  const updateSliderFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!sliderDragging.current) return;
    const wrap = event.currentTarget.parentElement;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const centerX = event.clientX - sliderPointerOffset.current;
    const next = Math.max(0, Math.min(100, ((centerX - rect.left) / rect.width) * 100));
    setSliderValue(Math.round(next));
  };
  const handleSliderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const wrap = event.currentTarget.parentElement;
    if (!wrap) return;
    const thumbRect = event.currentTarget.getBoundingClientRect();
    sliderPointerOffset.current = event.clientX - (thumbRect.left + thumbRect.width / 2);
    sliderDragging.current = true;
    setSliderPressed(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleSliderPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    sliderDragging.current = false;
    setSliderPressed(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleSliderKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setSliderValue(value => Math.min(100, value + step)); }
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setSliderValue(value => Math.max(0, value - step)); }
    else if (event.key === "Home") { event.preventDefault(); setSliderValue(0); }
    else if (event.key === "End") { event.preventDefault(); setSliderValue(100); }
  };
  const [buttonDemoOn, setButtonDemoOn] = useState(false);
  const [selectionDemo, setSelectionDemo] = useState("Default");
  const [textDemo, setTextDemo] = useState("");

  useEffect(() => {
    onDetailChange(selectedCategory !== null);
    return () => onDetailChange(false);
  }, [selectedCategory, onDetailChange]);
  const categories = [
    { title: "General", description: "Core preferences and behaviour", icon: Settings2 },
    { title: "Workspace", description: "Personal workspace", icon: BriefcaseBusiness },
    { title: "Appearance", description: "Visual preferences and display", icon: Palette },
    { title: "Toggle", description: "Interactive theme switch", icon: Moon },
    { title: "Slider", description: "Adjustable range controls", icon: SlidersHorizontal },
    { title: "Buttons", description: "Actions and button states", icon: MousePointer2 },
    { title: "Selection", description: "Radio and segmented choices", icon: ListChecks },
    { title: "Text fields", description: "Text input fundamentals", icon: TextCursorInput },
    { title: "Notifications", description: "Notification preferences", icon: Bell },
    { title: "Privacy & security", description: "Privacy and account protection", icon: ShieldCheck },
    { title: "Accessibility", description: "Comfort and accessibility options", icon: Accessibility },
    { title: "Language & region", description: "Language and regional preferences", icon: Languages },
    { title: "Help & feedback", description: "Guides, support and suggestions", icon: CircleHelp },
    { title: "About Essential", description: "One Core. Infinite Possibilities.", icon: Info }
  ];
  const selected = categories.find(item => item.title === selectedCategory);
  const filtered = categories.filter(item => (item.title + " " + item.description).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page settings-page core-settings-page nothing-settings-page">
      <header className="nothing-settings-top">
        {selected ? <button className="nothing-settings-back" onClick={() => setSelectedCategory(null)} aria-label="Back to settings"><ArrowLeft size={22} /></button> : <span />}
        <button className="nothing-settings-avatar" onClick={onOpenProfile} aria-label="Open account profile"><span>A</span></button>
      </header>
      {selected ? <>
        <h1 className="nothing-settings-title">{selected.title}</h1>
        {selected.title === "Toggle" && <p className="nothing-settings-subtitle">The white capsule smoothly slides between the left and right sides of the green track.</p>}
        <section className="nothing-settings-group nothing-settings-detail">
          {selected.title === "Toggle" ? <div className="toggle-demo-list">
            <div className="toggle-demo-intro"><strong>Liquid Glass Toggle</strong><p>A glossy liquid-glass switch with a soft, elastic lens.</p></div>
            <div className="nothing-settings-row liquid-toggle-setting-row">
              <span className="nothing-settings-icon"><Sparkles size={22} /></span>
              <span className="nothing-settings-copy"><strong>Theme toggle</strong><small>Interactive liquid-glass switch</small></span>
              <LiquidToggle checked={customDemoOn} onChange={setCustomDemoOn} label="Liquid Glass theme toggle demo" />
            </div>
            <p className="toggle-demo-note">Hold and slide the white capsule anywhere along the track. Release on either side to set the switch.</p>
          </div> : selected.title === "Slider" ? <div className="control-demo-list">
            <div className="control-demo-intro"><strong>Slider</strong><p>A simple range control for adjusting a value.</p></div>
            <div className="control-demo-panel">
              <div className="control-demo-label"><strong>Intensity</strong><span>{sliderValue}%</span></div>
              <div className="core-demo-slider-wrap" style={{ "--slider-progress": `${sliderValue}%`, "--slider-position": `${sliderValue}%` } as React.CSSProperties}>
                <div className="core-demo-slider-track" />
                <div
                  className={`core-demo-slider-thumb ${sliderPressed ? "is-pressed" : ""}`}
                  role="slider"
                  tabIndex={0}
                  aria-label="Slider intensity demo"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={sliderValue}
                  onPointerDown={handleSliderPointerDown}
                  onPointerMove={updateSliderFromPointer}
                  onPointerUp={handleSliderPointerEnd}
                  onPointerCancel={handleSliderPointerEnd}
                  onKeyDown={handleSliderKeyDown}
                ><span /></div>
              </div>
              <div className="control-demo-caption"><span>0%</span><span>100%</span></div>
            </div>
          </div> : selected.title === "Buttons" ? <div className="control-demo-list">
            <div className="control-demo-intro"><strong>Buttons</strong><p>Primary and secondary actions with clear states.</p></div>
            <div className="control-demo-panel control-demo-buttons">
              <button className="core-demo-primary" onClick={() => setButtonDemoOn(!buttonDemoOn)}>{buttonDemoOn ? "Activated" : "Primary action"}</button>
              <button className="core-demo-secondary" onClick={() => setButtonDemoOn(false)}>Reset</button>
            </div>
          </div> : selected.title === "Selection" ? <div className="control-demo-list">
            <div className="control-demo-intro"><strong>Selection controls</strong><p>Choose one option from a small set.</p></div>
            <div className="control-demo-panel">
              <div className="core-demo-segmented">{["Default", "Comfort", "Compact"].map(option => <button key={option} className={selectionDemo === option ? "active" : ""} onClick={() => setSelectionDemo(option)}>{option}</button>)}</div>
              <small className="control-demo-hint">Selected: {selectionDemo}</small>
            </div>
          </div> : selected.title === "Text fields" ? <div className="control-demo-list">
            <div className="control-demo-intro"><strong>Text fields</strong><p>Simple inputs for short pieces of information.</p></div>
            <div className="control-demo-panel">
              <label className="core-demo-field"><span>Display name</span><input value={textDemo} onChange={event => setTextDemo(event.target.value)} placeholder="Enter a name" /></label>
              <small className="control-demo-hint">{textDemo.length ? textDemo.length + " characters" : "Your text appears here as you type."}</small>
            </div>
          </div> : selected.title === "Appearance" ? <div className="nothing-settings-info"><span className="nothing-settings-icon"><Palette size={23} /></span><strong>Appearance</strong><p>Display preferences and visual customisation for Essential Core.</p></div> : selected.title === "Notifications" ? <div className="nothing-settings-row">
            <span className="nothing-settings-icon"><Bell size={22} /></span><span className="nothing-settings-copy"><strong>Notifications</strong><small>Product updates and activity</small></span>
            <LiquidToggle checked={notifications} onChange={onNotificationsChange} label="Notifications" />
          </div> : <div className="nothing-settings-info">
            <span className="nothing-settings-icon"><selected.icon size={23} /></span>
            <strong>{selected.title}</strong>
            <p>{selected.title === "Workspace" ? "Your personal workspace is where shared Essential tools and preferences come together." : selected.title === "General" ? "General preferences for Essential Core will live here. Product-wide defaults are kept simple and consistent." : selected.title === "Privacy & security" ? "Privacy and account protection controls will appear here when Essential Core account services are connected." : selected.title === "Accessibility" ? "Accessibility preferences will be shared across Essential apps as the common settings framework grows." : selected.title === "Language & region" ? "Language and regional options will be managed here when localization support is added." : selected.title === "Help & feedback" ? "Help resources and feedback options will appear here as Essential ecosystem services are connected." : "Essential Core is the shared foundation for the Essential ecosystem."}</p>
            {selected.title === "About Essential" && <small>Version 0.1.0</small>}
          </div>}
        </section>
      </> : <>
        <h1 className="nothing-settings-title">Settings</h1>
        <label className="nothing-settings-search"><Search size={21} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search settings" aria-label="Search settings" />{search && <button onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
        <section className="nothing-settings-group" aria-label="Settings categories">
          {filtered.map(({ title, description, icon: Icon }) => <button className="nothing-settings-row" key={title} onClick={() => setSelectedCategory(title)}>
            <span className="nothing-settings-icon"><Icon size={22} strokeWidth={1.9} /></span>
            <span className="nothing-settings-copy"><strong>{title}</strong><small>{title === "Notifications" ? (notifications ? "Enabled" : "Disabled") : title === "Appearance" ? (theme === "dark" ? "Dark theme" : "Light theme") : description}</small></span>
            <ChevronRight size={19} className="nothing-settings-chevron" />
          </button>)}
          {filtered.length === 0 && <p className="nothing-settings-empty">No settings found for “{search}”.</p>}
        </section>
      </>}
      <div className="nothing-settings-safe-bottom" />
    </div>
  );
}
export default App;
