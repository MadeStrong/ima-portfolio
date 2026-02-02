'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockSettings } from '@/lib/mock-data';
import {
  LayoutDashboard,
  FolderOpen,
  Type,
  Navigation,
  Share2,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FolderOpen, label: 'Portfolio', href: '/admin/portfolio' },
  { icon: Type, label: 'Content', href: '/admin/content' },
  { icon: Navigation, label: 'Navigation', href: '/admin/navigation' },
  { icon: Share2, label: 'Social Links', href: '/admin/social-links' },
  { icon: Mail, label: 'Messages', href: '/admin/messages' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ima-background flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-ima-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading font-bold text-2xl text-white mb-4">Supabase Not Configured</h1>
          <p className="text-ima-text-secondary mb-6">
            To use the admin dashboard, please configure Supabase by adding your credentials to <code className="bg-ima-surface px-2 py-1 rounded">.env.local</code>
          </p>
          <Link href="/" className="text-ima-primary hover:underline">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  const settings = mockSettings;

  return (
    <div className="min-h-screen bg-ima-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-ima-background border-b border-ima-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings.logo_url && (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
          )}
          <span className="font-heading font-bold text-lg text-white">Admin</span>
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
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-ima-surface transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-ima-surface-hover">
          {settings.logo_url && (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
          )}
          <span className="font-heading font-bold text-lg text-white">IMA Admin</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-ima-primary text-white'
                    : 'text-ima-text-secondary hover:bg-ima-surface-hover hover:text-white'
                }`}
                data-testid={`admin-nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ima-surface-hover">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-ima-primary flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Admin</p>
              <p className="text-ima-text-secondary text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-ima-surface-hover text-ima-text-secondary hover:text-white transition-colors duration-200 text-sm"
              data-testid="admin-view-site"
            >
              View Site
              <ChevronRight size={16} />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-ima-surface-hover text-ima-text-secondary hover:text-ima-primary transition-colors duration-200"
              data-testid="admin-logout-button"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Header */}
        <header className="h-16 border-b border-ima-border px-6 flex items-center">
          <h1 className="font-heading font-bold text-xl text-white">{title}</h1>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
