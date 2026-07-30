// src/components/layout/DashboardLayout.jsx
// Layout for authenticated role dashboards: Navbar + responsive
// Sidebar + content area (rendered via <Outlet/>) + Footer.
//
// Applicant links (Module 3) point at real pages now. Officer/Admin
// links remain placeholders — just a link back to each role's
// dashboard home — until those modules are built.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

const SIDEBAR_LINKS_BY_ROLE = {
  [ROLES.APPLICANT]: [
    { label: 'Dashboard', path: '/applicant' },
    { label: 'My Applications', path: '/applicant/applications' },
    { label: 'New Application', path: '/applicant/applications/new' },
  ],
  [ROLES.OFFICER]: [{ label: 'Dashboard', path: '/officer' }],
  [ROLES.ADMIN]: [{ label: 'Dashboard', path: '/admin' }],
};

function DashboardLayout() {
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = SIDEBAR_LINKS_BY_ROLE[currentUser?.role] || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setIsMobileOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          links={links}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
