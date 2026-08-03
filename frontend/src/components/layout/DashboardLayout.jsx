// src/components/layout/DashboardLayout.jsx
// Layout for authenticated role dashboards: Navbar + responsive
// Sidebar + content area (rendered via <Outlet/>) + Footer.
//
// Sidebar links are minimal placeholders for now — just a link back
// to each role's dashboard home — since the pages those links would
// point to (applications list, review queue, user management, etc.)
// don't exist yet and are out of scope for this module.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

const SIDEBAR_LINKS_BY_ROLE = {
  [ROLES.APPLICANT]: [{ label: 'Dashboard', path: '/applicant' }],
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
