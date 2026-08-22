// src/components/layout/PublicLayout.jsx
// Layout for public-facing pages (landing, login, register): a plain
// Navbar + content + Footer, no sidebar.

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar variant="public" />
      <main className="flex-1 bg-gray-50 dark:bg-slate-950">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
