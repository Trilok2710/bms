import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Building2 } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Building2 size={28} />
              <span className="text-xl font-bold">BMS</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm">{user.firstName} {user.lastName}</span>
              <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="text-sm mb-4">
              <p>{user.firstName} {user.lastName}</p>
              <p className="text-gray-400">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
