// src/components/layout/Sidebar.jsx
// Upgraded role-based Sidebar matching Figma reference design:
// - Dark navy vertical gradient (#0f2a6b to #1e3a8a) with light text
// - Brand Header: EthioClear (Clear in gold) + "CERTIFICATE SYSTEM" subtitle
// - User block: Avatar/Name + colored Role Pill (Gold for Officer, Red for Admin, Blue for Applicant)
// - Section titles (OVERVIEW, MANAGEMENT, SYSTEM, APPLICANT PORTAL, OFFICER PORTAL)
// - Navigation links with SVG icons, rounded active translucent state
// - Real count badges for unread notifications and pending items
// - Slide-in drawer on mobile with backdrop overlay

import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

// SVG Icons
function DashboardIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function PlusCircleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function DocumentListIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 3.5h7l5 5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5v5h5" />
      <path d="M8 12h8M8 16h6" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3s7 3 7 9c0 5-7 9-7 9s-7-4-7-9c0-6 7-9 7-9Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function QueueIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 6h16M4 12h16M4 18h10" />
      <circle cx="19" cy="18" r="3" />
    </svg>
  );
}

function HistoryIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function UserPlusIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}

function BarChartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function FileTextIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BellIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function UserIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Brand Logo component matching Figma (Ethio + Gold Clear + Subtitle)
function SidebarBrand({ isCollapsed }) {
  return (
    <Link to="/" className="flex items-center gap-3 px-4 py-5 border-b border-white/10 group">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-navy-900 shadow-md ring-1 ring-white/20">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 3s7 3 7 9c0 5-7 9-7 9s-7-4-7-9c0-6 7-9 7-9Z" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!isCollapsed && (
        <div className="overflow-hidden leading-tight">
          <div className="font-sans text-xl font-bold tracking-tight text-white">
            Ethio<span className="text-amber-400">Clear</span>
          </div>
          <div className="text-[9px] font-semibold tracking-widest uppercase text-blue-200/60 mt-0.5">
            Certificate System
          </div>
        </div>
      )}
    </Link>
  );
}

// User Profile Block under Brand
function SidebarUserBlock({ user, isCollapsed }) {
  if (isCollapsed) return null;

  const initials = (user?.fullName || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const rolePill = {
    [ROLES.ADMIN]: { label: 'Administrator', bg: 'bg-red-500/20 text-red-300 border-red-500/30' },
    [ROLES.OFFICER]: { label: 'Verification Officer', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    [ROLES.APPLICANT]: { label: 'Applicant', bg: 'bg-blue-400/20 text-blue-200 border-blue-400/30' },
  }[user?.role] || { label: 'User', bg: 'bg-white/10 text-white border-white/20' };

  return (
    <div className="mx-3 mt-4 mb-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 font-bold text-navy-950 text-sm shadow">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user?.fullName || user?.email}
          </p>
          <span
            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase ${rolePill.bg}`}
          >
            {rolePill.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function SidebarNavSection({ title, links, isCollapsed, onNavigate, unreadCount }) {
  return (
    <div className="mt-4">
      {!isCollapsed && title && (
        <h4 className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/50">
          {title}
        </h4>
      )}
      <div className="space-y-1 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isNotif = link.path === '/notifications' && unreadCount > 0;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/applicant' || link.path === '/officer' || link.path === '/admin'}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 min-h-[44px]',
                  isActive
                    ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20 font-semibold'
                    : 'text-blue-100/75 hover:bg-white/10 hover:text-white',
                  isCollapsed ? 'justify-center' : '',
                ].join(' ')}
              title={isCollapsed ? link.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 text-blue-200 group-hover:text-white transition-colors" />
              {!isCollapsed && <span className="flex-1 truncate">{link.label}</span>}
              {!isCollapsed && isNotif && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  unreadNotifications = 0,
}) {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  // Close drawer on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Sectional Navigation mapping per role
  const sections = [];

  if (role === ROLES.APPLICANT) {
    sections.push({
      title: 'Applicant Portal',
      links: [
        { label: 'Dashboard', path: '/applicant', icon: DashboardIcon },
        { label: 'New Application', path: '/applicant/applications/new', icon: PlusCircleIcon },
        { label: 'My Applications', path: '/applicant/applications', icon: DocumentListIcon },
        { label: 'My Certificate', path: '/verify', icon: ShieldCheckIcon },
      ],
    });
  } else if (role === ROLES.OFFICER) {
    sections.push({
      title: 'Officer Portal',
      links: [
        { label: 'Dashboard', path: '/officer', icon: DashboardIcon },
        { label: 'Review Queue', path: '/officer/queue', icon: QueueIcon },
      ],
    });
  } else if (role === ROLES.ADMIN) {
    sections.push({
      title: 'Overview',
      links: [{ label: 'System Dashboard', path: '/admin', icon: DashboardIcon }],
    });
    sections.push({
      title: 'Management',
      links: [
        { label: 'User Management', path: '/admin/users', icon: UsersIcon },
        { label: 'Officer Management', path: '/admin/users/new-officer', icon: UserPlusIcon },
      ],
    });
    sections.push({
      title: 'System',
      links: [
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChartIcon },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileTextIcon },
      ],
    });
  }

  // Account links available to all authenticated roles
  sections.push({
    title: 'Account',
    links: [
      { label: 'Notifications', path: '/notifications', icon: BellIcon },
      { label: 'My Profile', path: '/profile', icon: UserIcon },
    ],
  });

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0f2a6b] via-[#14327a] to-[#1e3a8a] text-white shadow-xl">
      <SidebarBrand isCollapsed={isCollapsed} />
      <SidebarUserBlock user={currentUser} isCollapsed={isCollapsed} />

      <div className="flex-1 overflow-y-auto px-1 py-2">
        {sections.map((sec, idx) => (
          <SidebarNavSection
            key={sec.title || idx}
            title={sec.title}
            links={sec.links}
            isCollapsed={isCollapsed}
            onNavigate={onCloseMobile}
            unreadCount={unreadNotifications}
          />
        ))}
      </div>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block p-3 border-t border-white/10">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-9 w-full items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-blue-200 transition-colors"
        >
          {isCollapsed ? '»' : '« Collapse Sidebar'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={[
          'hidden shrink-0 transition-all duration-200 md:block',
          isCollapsed ? 'w-20' : 'w-64',
        ].join(' ')}
      >
        <div className={`fixed top-0 bottom-0 z-40 transition-all duration-200 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer with Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
