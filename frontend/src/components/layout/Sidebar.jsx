// src/components/layout/Sidebar.jsx
// Responsive dashboard sidebar.
// - Desktop (md and up): always visible, width toggles between full
//   and icon-only ("collapsed") via isCollapsed.
// - Mobile (below md): hidden by default, slides in as an overlay
//   drawer when isMobileOpen is true, with a backdrop to close it.

import { NavLink } from 'react-router-dom';

/**
 * @param {{label: string, path: string}[]} links
 */
function SidebarLinks({ links, isCollapsed }) {
  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            [
              'block rounded-md px-3 py-2 text-sm font-medium',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800',
            ].join(' ')
          }
          title={isCollapsed ? link.label : undefined}
        >
          {isCollapsed ? link.label.charAt(0) : link.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Sidebar({ links, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          'hidden shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 md:flex',
          isCollapsed ? 'w-16' : 'w-64',
        ].join(' ')}
      >
        <SidebarLinks links={links} isCollapsed={isCollapsed} />
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="border-t border-gray-200 p-3 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isCollapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      {/* Mobile drawer + backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-slate-700">
              <span className="font-semibold text-primary-700">Menu</span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <SidebarLinks links={links} isCollapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
