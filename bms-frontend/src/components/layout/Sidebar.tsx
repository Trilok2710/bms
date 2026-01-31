import React, { useState } from 'react';
import { Building2, Zap, Droplets, Home, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { label: 'Buildings', icon: <Building2 size={20} />, path: '/buildings', roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Tasks', icon: <Zap size={20} />, path: '/tasks' },
  { label: 'Readings', icon: <Droplets size={20} />, path: '/readings' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/readings/analytics' },
  { label: 'Staff', icon: <Users size={20} />, path: '/staff', roles: ['ADMIN', 'SUPERVISOR'] },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const visibleItems = sidebarItems.filter(
    item => !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <aside className={`bg-secondary text-white transition-all ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-left hover:bg-gray-700 px-3 py-2 rounded-lg transition"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-8">
        {visibleItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition text-left"
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};
