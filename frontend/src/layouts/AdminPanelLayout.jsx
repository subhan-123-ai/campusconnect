import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

function getDefaultSidebarOpen() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024;
}

function isDesktopViewport() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

export default function AdminPanelLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(getDefaultSidebarOpen);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const syncSidebar = (event) => {
      setSidebarOpen(event.matches);
    };

    setSidebarOpen(mediaQuery.matches);
    mediaQuery.addEventListener('change', syncSidebar);
    return () => mediaQuery.removeEventListener('change', syncSidebar);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const closeSidebarOnMobile = () => {
    if (!isDesktopViewport()) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <AdminSidebar onClose={closeSidebar} onNavigate={closeSidebarOnMobile} />
      </aside>

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[margin-left] duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">CampusConnect Admin</h2>
            <p className="text-xs text-slate-500">Platform-wide management dashboard</p>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
