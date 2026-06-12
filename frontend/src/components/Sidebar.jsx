import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsStudentSession } from '../store/authStore';

export default function Sidebar({ onClose, onNavigate }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isStudentSession = useAuthStore(selectIsStudentSession);
  const navigate = useNavigate();
  const studentMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Resources', path: '/resources', icon: '📚' },
    { label: 'Upload Resource', path: '/upload-resource', icon: '⬆️' },
    { label: 'Events', path: '/events', icon: '📅' },
    { label: 'Study Partners', path: '/study-partners', icon: '👥' },
    { label: 'Complaints', path: '/complaints', icon: '📝' },
    { label: 'My Complaints', path: '/my-complaints', icon: '📋' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  const menuItems = studentMenuItems;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-1 rounded-lg transition mb-1 text-sm font-medium ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  const handleNavClick = () => {
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const universityLabel =
    typeof user?.university === 'object'
      ? user.university.shortName
      : user?.university || 'Campus';

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-900 text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-800 p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold">CC</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">CampusConnect</h1>
            <p className="text-xs text-gray-400">Student Platform</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <p className="mb-3 px-3 text-xs font-bold uppercase text-gray-500">Menu</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={linkClass}
          >
            <span className="shrink-0 text-lg">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-gray-800 p-4">
        <div className="mb-4 rounded-lg bg-gray-800 p-4 text-center">
          <div className="mb-2 text-3xl">👤</div>
          <p className="truncate text-sm font-bold text-white">
            {isStudentSession ? user?.name || 'Student' : 'Student'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {isStudentSession
              ? `${universityLabel} • ${user?.department || '—'} • Sem ${user?.semester || '—'}`
              : 'Please log in'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger py-2 font-medium text-white transition hover:bg-red-600"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
