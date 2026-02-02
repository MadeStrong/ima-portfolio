import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Type,
  Navigation,
  Share2,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth, useData } from "../App";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FolderOpen, label: "Portfolio", href: "/admin/portfolio" },
  { icon: FileText, label: "Pages", href: "/admin/pages" },
  { icon: Type, label: "Content", href: "/admin/content" },
  { icon: Navigation, label: "Navigation", href: "/admin/navigation" },
  { icon: Share2, label: "Social Links", href: "/admin/social-links" },
  { icon: Mail, label: "Messages", href: "/admin/messages" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B] border-b border-[#1F1F1F] px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings?.logo_url && (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
          )}
          <span className="font-heading font-bold text-lg text-white">
            Admin
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white"
          data-testid="admin-mobile-menu-toggle"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-[#1F1F1F] transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#2A2A2A]">
          {settings?.logo_url && (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
          )}
          <span className="font-heading font-bold text-lg text-white">
            IMA Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#E10600] text-white"
                    : "text-[#B3B3B3] hover:bg-[#2A2A2A] hover:text-white"
                }`}
                data-testid={`admin-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#E10600] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[#B3B3B3] text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#2A2A2A] text-[#B3B3B3] hover:text-white transition-colors text-sm"
              data-testid="admin-view-site"
            >
              View Site
              <ChevronRight size={16} />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-[#2A2A2A] text-[#B3B3B3] hover:text-[#E10600] transition-colors"
              data-testid="admin-logout-button"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Header */}
        <header className="h-16 border-b border-[#1F1F1F] px-6 flex items-center">
          <h1 className="font-heading font-bold text-xl text-white">{title}</h1>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
