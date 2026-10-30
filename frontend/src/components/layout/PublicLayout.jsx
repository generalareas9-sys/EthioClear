// src/components/layout/PublicLayout.jsx
// Layout for public-facing pages:
// - Solid White Sticky Navbar (sticky top-0 z-50)
// - Main Content with no overlapping margins
// - Deep Navy Footer (#0A1A44)

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FB] text-slate-900">
      <Navbar variant="public" />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
