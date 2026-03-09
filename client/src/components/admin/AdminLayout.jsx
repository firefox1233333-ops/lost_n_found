import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopBar from './AdminTopBar';
import AdminNav from './AdminNav';
import './AdminLayout.css';

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="m3-admin-layout">
      <AdminTopBar onMenuClick={() => setNavOpen((o) => !o)} />
      <div className="m3-admin-body">
        <AdminNav open={navOpen} onClose={() => setNavOpen(false)} />
        <main className="m3-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
