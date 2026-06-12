import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { label: 'Overview', path: '/admin', icon: '📊', end: true },
  { label: 'Universities', path: '/admin/universities', icon: '🏛️' },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Resources', path: '/admin/resources', icon: '📚' },
  { label: 'Events', path: '/admin/events', icon: '📅' },
  { label: 'Complaints', path: '/admin/complaints', icon: '📝' },
];

export default function AdminSidebar({ onClose, onNavigate }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-1 rounded-lg transition mb-1 text-sm font-medium ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const handleNavClick = () => onNavigate?.();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-900 text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-lg font-bold">🛡️</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-slate-400">CampusConnect Control</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <p className="mb-3 px-3 text-xs font-bold uppercase text-slate-500">Management</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={handleNavClick}
            className={linkClass}
          >
            <span className="shrink-0 text-lg">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-800 p-4">
        <div className="mb-4 rounded-lg bg-slate-800 p-4 text-center">
          <div className="mb-2 text-3xl">🛡️</div>
          <p className="truncate text-sm font-bold text-white">{user?.name || 'Admin'}</p>
          <p className="mt-1 text-xs text-slate-400">Super Admin • All Universities</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 font-medium text-white transition hover:bg-red-700"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
