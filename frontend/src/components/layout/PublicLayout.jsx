// src/components/layout/PublicLayout.jsx
// Layout for public-facing pages: Sticky Navbar + Content + Dark Navy Footer.

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-app text-text-primary transition-colors duration-150">
      <Navbar variant="public" />
      <main className="flex-1 bg-app">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
