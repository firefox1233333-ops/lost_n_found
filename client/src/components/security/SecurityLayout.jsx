import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SecurityTopBar from './SecurityTopBar';
import SecurityNav from './SecurityNav';
import '../admin/AdminLayout.css';

export default function SecurityLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="m3-admin-layout">
      {/* Sidebar on left */}
      <SecurityNav open={navOpen} onClose={() => setNavOpen(false)} />

      {/* Right column: topbar + content */}
      <div className="m3-admin-right">
        <SecurityTopBar onMenuClick={() => setNavOpen((o) => !o)} />
        <main className="m3-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
