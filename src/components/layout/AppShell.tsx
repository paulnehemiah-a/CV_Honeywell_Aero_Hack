/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Application Shell  (Sidebar + TopBar + content slot)
   ───────────────────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  AudioLines,
  Radar,
  ListChecks,
  FileBarChart,
  FlaskConical,
  Settings,
  Wifi,
  WifiOff,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

/* ── Sidebar ────────────────────────────────────────────────────────── */
const navItems = [
  { to: '/',               label: 'Dashboard',           icon: LayoutDashboard },
  { to: '/audio',          label: 'Audio Verification',  icon: AudioLines },
  { to: '/radar',          label: 'Radar Verification',  icon: Radar },
  { to: '/runs',           label: 'Test Runs',           icon: ListChecks },
  { to: '/reports',        label: 'Reports',             icon: FileBarChart },
  { to: '/calibration',    label: 'Calibration Lab',     icon: FlaskConical },
  { to: '/settings',       label: 'Settings',            icon: Settings },
];

function Sidebar({ collapsed, toggle }: { collapsed: boolean; toggle: () => void }) {
  return (
    <aside
      className={`shrink-0 flex flex-col border-r border-border-base bg-bg-surface
        transition-[width] duration-200 ${collapsed ? 'w-16' : 'w-56'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border-base">
        <div className="w-7 h-7 rounded bg-info/20 flex items-center justify-center shrink-0">
          <span className="text-info font-bold text-sm font-mono">V</span>
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-text-primary truncate">
            VERIDECK
          </span>
        )}
        <button
          onClick={toggle}
          className="ml-auto text-text-muted hover:text-text-primary transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-2 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded text-[13px] font-medium transition-colors
              ${isActive
                ? 'bg-info/10 text-info'
                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-base px-3 py-3 flex flex-col gap-1.5 text-[11px] text-text-muted">
        {!collapsed && (
          <>
            <StatusRow icon={<WifiOff size={12} />} label="Offline Mode" value="Off" />
            <StatusRow icon={<Activity size={12} />} label="Model Status" value="Mock" />
            <span className="font-mono mt-1 text-text-muted/60">v0.1.0-demo</span>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-1">
            <WifiOff size={12} />
            <span className="font-mono text-[9px]">v0.1</span>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatusRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
      <span className="ml-auto font-mono text-text-secondary">{value}</span>
    </div>
  );
}

/* ── Top Bar ────────────────────────────────────────────────────────── */
function TopBar() {
  const location = useLocation();

  // Derive breadcrumb from path
  const segments = location.pathname.split('/').filter(Boolean);
  const crumbLabels: Record<string, string> = {
    audio: 'Audio Verification',
    radar: 'Radar Verification',
    runs: 'Test Runs',
    reports: 'Reports',
    calibration: 'Calibration Lab',
    settings: 'Settings',
  };

  return (
    <header className="h-11 border-b border-border-base bg-bg-surface flex items-center px-4 gap-4 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted">
        <span className="text-text-secondary font-medium">Dashboard</span>
        {segments.map((seg, i) => (
          <React.Fragment key={i}>
            <span className="text-text-muted">/</span>
            <span className="text-text-secondary font-medium">{crumbLabels[seg] ?? seg}</span>
          </React.Fragment>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search…"
          className="bg-bg-elevated border border-border-base rounded pl-7 pr-3 py-1 text-xs
            text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus w-44"
        />
      </div>

      {/* Notifications */}
      <button className="relative text-text-muted hover:text-text-primary transition-colors">
        <Bell size={16} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-info" />
      </button>

      {/* User badge */}
      <div className="flex items-center gap-2 ml-1">
        <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-base flex items-center justify-center text-[10px] font-bold text-text-secondary">
          DM
        </div>
        <span className="text-xs text-text-secondary hidden lg:inline">Demo Mode</span>
      </div>
    </header>
  );
}

/* ── App Shell ──────────────────────────────────────────────────────── */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
