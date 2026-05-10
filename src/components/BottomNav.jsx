import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Folder, Users, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/notes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Notes</span>
      </NavLink>
      <NavLink to="/folders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Folder size={24} />
        <span>Folders</span>
      </NavLink>
      <NavLink to="/shared" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users size={24} />
        <span>Shared</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Settings size={24} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
