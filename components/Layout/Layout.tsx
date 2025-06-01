import { useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "IBTIKAR RMS" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Close mobile sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't show layout on auth pages
  if (router.pathname.startsWith("/auth/")) {
    return <>{children}</>;
  }

  // Show enhanced loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Chargement...
            </h3>
            <p className="text-slate-500">Initialisation de l'application</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 lg:static lg:inset-auto
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <div className="animate-fade-in">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
