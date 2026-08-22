// src/components/layout/DashboardLayout.jsx
// Layout for authenticated role dashboards.
// Module 7: fetches unread notification count and passes it to Navbar
// for the bell badge; adds Profile and Notifications sidebar links
// to all roles.

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';
import { getUnreadCount } from '../../services/notificationService.js';

// Shared links appended to every role's sidebar.
const COMMON_LINKS = [
  { label: 'Notifications', path: '/notifications' },
  { label: 'My Profile',    path: '/profile' },
];

const SIDEBAR_LINKS_BY_ROLE = {
  [ROLES.APPLICANT]: [
    { label: 'Dashboard',        path: '/applicant' },
    { label: 'My Applications',  path: '/applicant/applications' },
    { label: 'New Application',  path: '/applicant/applications/new' },
    ...COMMON_LINKS,
  ],
  [ROLES.OFFICER]: [
    { label: 'Dashboard',        path: '/officer' },
    { label: 'Review Queue',     path: '/officer/queue' },
    ...COMMON_LINKS,
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard',        path: '/admin' },
    { label: 'Users',            path: '/admin/users' },
    { label: 'Reports',          path: '/admin/reports' },
    { label: 'Audit Logs',       path: '/admin/audit-logs' },
    ...COMMON_LINKS,
  ],
};

function DashboardLayout() {
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);

  // Fetch unread notification count for the bell badge. Fails silently
  // if the notifications endpoint isn't available yet (404).
  useEffect(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {}); // endpoint not built yet — suppress silently
  }, []);

  const links = SIDEBAR_LINKS_BY_ROLE[currentUser?.role] || [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        variant="dashboard"
        onMenuClick={() => setIsMobileOpen(true)}
        unreadNotifications={unreadCount}
      />
      <div className="flex flex-1 bg-gray-50 dark:bg-slate-950">
        <Sidebar
          links={links}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
        <main className="flex-1 bg-gray-50 p-4 md:p-6 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
