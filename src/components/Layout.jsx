import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Main Layout - Provides the shell with responsive navigation.
 */
const Layout = () => {
  // Start with sidebar open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full flex flex-col h-screen bg-surface-container-low transition-colors duration-300 font-sans text-on-surface overflow-hidden">
      <Navbar onMenuToggle={handleMenuToggle} />

      <div className="flex flex-1 overflow-hidden h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full animate-fade-in custom-scrollbar relative">
          <div className="max-w-400 mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
