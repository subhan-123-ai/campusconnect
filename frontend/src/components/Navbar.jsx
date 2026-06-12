import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsStudentSession } from '../store/authStore';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resources', label: 'Resources' },
  { to: '/events', label: 'Events' },
  { to: '/study-partners', label: 'Study Partners' },
  { to: '/complaints', label: 'Complaints' },
];

const Navbar = ({ onMenuClick, isLoggedIn, sidebarOpen }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isStudentLoggedIn = useAuthStore(selectIsStudentSession) && isLoggedIn;
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    setShowMobileNav(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {isStudentLoggedIn && onMenuClick && (
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
          <Link
            to={isStudentLoggedIn ? '/dashboard' : '/'}
            className="truncate text-xl font-bold text-blue-600 sm:text-2xl"
          >
            CampusConnect
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {isStudentLoggedIn &&
            navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isStudentLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => setShowMobileNav((open) => !open)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Toggle navigation menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex max-w-[180px] items-center gap-2 rounded-lg bg-blue-100 px-2 py-2 transition hover:bg-blue-200 sm:max-w-none sm:px-4"
                >
                  <span className="text-xl sm:text-2xl">👤</span>
                  <span className="truncate font-medium text-gray-800 sm:inline">
                    {user?.name}
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 sm:text-base">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-4 sm:text-base"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {isStudentLoggedIn && showMobileNav && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setShowMobileNav(false)}
                className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
