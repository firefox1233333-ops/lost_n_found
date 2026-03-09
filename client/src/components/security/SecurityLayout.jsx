import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SecurityTopBar from './SecurityTopBar';
import SecurityNav from './SecurityNav';
import '../admin/AdminLayout.css';

export default function SecurityLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="m3-admin-layout">
      <SecurityTopBar onMenuClick={() => setNavOpen((o) => !o)} />
      <div className="m3-admin-body">
        <SecurityNav open={navOpen} onClose={() => setNavOpen(false)} />
        <main className="m3-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
