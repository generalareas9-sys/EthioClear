// src/components/layout/DashboardLayout.jsx
// Upgraded Dashboard Layout matching Figma structure:
// Persistent Sidebar + Sticky Portal Topbar + Content area + Footer.

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import { getUnreadCount } from '../../services/notificationService.js';

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-app text-text-primary transition-colors duration-150">
      {/* Sidebar with dark navy gradient & user role block */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        unreadNotifications={unreadCount}
      />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          variant="dashboard"
          onMenuClick={() => setIsMobileOpen(true)}
          unreadNotifications={unreadCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-app overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
