import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function getDefaultSidebarOpen() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024;
}

function isDesktopViewport() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

export default function AppLayout({ children, isLoggedIn = false }) {
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
    <div className="min-h-screen w-full bg-gray-50">
      {isLoggedIn && (
        <>
          {/* Mobile overlay */}
          <div
            className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${
              sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={closeSidebar}
            aria-hidden={!sidebarOpen}
          />

          {/* Fixed sidebar — stays in place while page scrolls */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-hidden={!sidebarOpen}
          >
            <Sidebar onClose={closeSidebar} onNavigate={closeSidebarOnMobile} />
          </aside>
        </>
      )}

      {/* Main column — offset on desktop when sidebar is open */}
      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[margin-left] duration-300 ease-in-out ${
          isLoggedIn && sidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <Navbar
          onMenuClick={toggleSidebar}
          isLoggedIn={isLoggedIn}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
