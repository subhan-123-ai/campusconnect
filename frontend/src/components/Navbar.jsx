import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onMenuClick, isLoggedIn, sidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isLoggedIn && onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to={user ? '/dashboard' : '/'} className="text-2xl font-bold text-blue-600">
            CampusConnect
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Dashboard
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Resources
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Events
              </Link>
              <Link to="/study-partners" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Study Partners
              </Link>
              <Link to="/complaints" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Complaints
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
              >
                <span className="text-2xl">👤</span>
                <span className="font-medium text-gray-800 hidden md:inline">{user.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
