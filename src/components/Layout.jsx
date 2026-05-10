import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <main>
      <div className="page-container">
        <Outlet />
      </div>
      <BottomNav />
    </main>
  );
};

export default Layout;
