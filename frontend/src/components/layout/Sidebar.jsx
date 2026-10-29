// src/components/layout/Sidebar.jsx
// Responsive dashboard sidebar.
// - Desktop (md and up): fixed navigation with expandable/collapsible width.
// - Mobile (below md): smooth slide-in drawer with backdrop, full keyboard accessibility and touch friendly (min-44px).

import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function SidebarLinks({ links, isCollapsed, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1.5 px-3 py-4" aria-label="Sidebar navigation">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
              isActive
                ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-950/60 dark:text-primary-300'
                : 'text-text-secondary hover:bg-card-subtle hover:text-text-primary',
            ].join(' ')}
          title={isCollapsed ? link.label : undefined}
        >
          {isCollapsed ? (
            <span className="w-full text-center text-base font-bold">{link.label.charAt(0)}</span>
          ) : (
            <span>{link.label}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Sidebar({ links, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          'hidden shrink-0 flex-col border-r border-border-theme bg-surface transition-all duration-200 md:flex',
          isCollapsed ? 'w-16' : 'w-64',
        ].join(' ')}
      >
        <SidebarLinks links={links} isCollapsed={isCollapsed} />
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-11 items-center justify-center border-t border-border-theme text-xs font-medium text-text-muted hover:bg-card-subtle hover:text-text-primary transition-colors focus-visible:outline-primary-600"
        >
          {isCollapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      {/* Mobile drawer + backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-surface shadow-2xl border-r border-border-theme animate-in slide-in-from-left duration-200">
            <div className="flex h-16 items-center justify-between border-b border-border-theme px-4">
              <img src="/logo.svg" alt="EthioClear" className="h-7 w-auto object-contain" style={{ maxWidth: '140px' }} />
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-card-subtle hover:text-text-primary transition-colors focus-visible:outline-primary-600"
              >
                ✕
              </button>
            </div>
            
            <SidebarLinks links={links} isCollapsed={false} onNavigate={onCloseMobile} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
