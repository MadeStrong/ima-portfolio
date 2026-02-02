'use client';

import AdminLayout from '@/components/AdminLayout';
import { mockPortfolio, mockSocialLinks } from '@/lib/mock-data';
import { FolderOpen, Mail, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Mock stats - in production these would come from Supabase
  const stats = {
    portfolioItems: mockPortfolio.length,
    messages: 12,
    unreadMessages: 3,
    leads: 45,
  };

  const recentMessages = [
    { id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Project Inquiry', created_at: new Date().toISOString(), is_read: false },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', subject: 'Collaboration Request', created_at: new Date(Date.now() - 86400000).toISOString(), is_read: true },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', subject: 'Quote Request', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-ima-surface rounded-xl p-6" data-testid="stat-portfolio">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-ima-primary" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">{stats.portfolioItems}</p>
          <p className="text-ima-text-secondary text-sm">Portfolio Items</p>
        </div>

        <div className="bg-ima-surface rounded-xl p-6" data-testid="stat-messages">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-ima-primary" />
            </div>
            {stats.unreadMessages > 0 && (
              <span className="px-2 py-1 bg-ima-primary text-white text-xs rounded-full">
                {stats.unreadMessages} new
              </span>
            )}
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">{stats.messages}</p>
          <p className="text-ima-text-secondary text-sm">Messages</p>
        </div>

        <div className="bg-ima-surface rounded-xl p-6" data-testid="stat-leads">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-ima-primary" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">{stats.leads}</p>
          <p className="text-ima-text-secondary text-sm">Newsletter Leads</p>
        </div>

        <div className="bg-ima-surface rounded-xl p-6" data-testid="stat-socials">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-ima-primary" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">{mockSocialLinks.length}</p>
          <p className="text-ima-text-secondary text-sm">Social Links Active</p>
        </div>
      </div>

      {/* Quick Actions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-ima-surface rounded-xl p-6">
          <h2 className="font-heading font-bold text-lg text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/portfolio"
              className="p-4 bg-ima-background rounded-lg text-center hover:bg-ima-surface-hover transition-colors duration-200"
              data-testid="quick-action-portfolio"
            >
              <FolderOpen className="w-6 h-6 text-ima-primary mx-auto mb-2" />
              <span className="text-white text-sm font-medium">Add Portfolio</span>
            </Link>
            <Link
              href="/admin/content"
              className="p-4 bg-ima-background rounded-lg text-center hover:bg-ima-surface-hover transition-colors duration-200"
              data-testid="quick-action-content"
            >
              <Mail className="w-6 h-6 text-ima-primary mx-auto mb-2" />
              <span className="text-white text-sm font-medium">Edit Content</span>
            </Link>
            <Link
              href="/admin/messages"
              className="p-4 bg-ima-background rounded-lg text-center hover:bg-ima-surface-hover transition-colors duration-200"
              data-testid="quick-action-messages"
            >
              <Mail className="w-6 h-6 text-ima-primary mx-auto mb-2" />
              <span className="text-white text-sm font-medium">View Messages</span>
            </Link>
            <Link
              href="/admin/settings"
              className="p-4 bg-ima-background rounded-lg text-center hover:bg-ima-surface-hover transition-colors duration-200"
              data-testid="quick-action-settings"
            >
              <Eye className="w-6 h-6 text-ima-primary mx-auto mb-2" />
              <span className="text-white text-sm font-medium">Site Settings</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-ima-surface rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-lg text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-ima-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="flex items-center gap-4 p-3 bg-ima-background rounded-lg"
                data-testid={`recent-message-${message.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{message.name}</p>
                    {!message.is_read && (
                      <span className="w-2 h-2 bg-ima-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-ima-text-secondary text-xs truncate">{message.subject}</p>
                </div>
                <span className="text-ima-text-secondary text-xs whitespace-nowrap">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
