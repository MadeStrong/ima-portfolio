'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { mockSocialLinks } from '@/lib/mock-data';
import { socialPlatforms } from '@/lib/types';
import type { SocialLink } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>(mockSocialLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: 'instagram',
    url: '',
    is_visible: true,
  });

  const openModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        is_visible: link.is_visible,
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: 'instagram',
        url: '',
        is_visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLink) {
      setLinks(links.map(l => 
        l.id === editingLink.id 
          ? { ...l, ...formData }
          : l
      ));
    } else {
      const newLink: SocialLink = {
        id: String(Date.now()),
        ...formData,
        display_order: links.length,
      };
      setLinks([...links, newLink]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this social link?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  const toggleVisibility = (id: string) => {
    setLinks(links.map(l => 
      l.id === id ? { ...l, is_visible: !l.is_visible } : l
    ));
  };

  const formatPlatformName = (platform: string) => {
    if (platform === 'x') return 'X (Twitter)';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <AdminLayout title="Social Links Manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-ima-text-secondary">Manage social media profile links</p>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors duration-200"
          data-testid="add-social-link"
        >
          <Plus size={18} />
          Add Link
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            className={`bg-ima-surface rounded-xl p-5 ${!link.is_visible ? 'opacity-50' : ''}`}
            data-testid={`social-link-${link.id}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-bold text-white capitalize">
                {formatPlatformName(link.platform)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleVisibility(link.id)}
                  className="p-2 text-ima-text-secondary hover:text-white transition-colors"
                  data-testid={`toggle-social-${link.id}`}
                >
                  {link.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openModal(link)}
                  className="p-2 text-ima-text-secondary hover:text-white transition-colors"
                  data-testid={`edit-social-${link.id}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-ima-text-secondary hover:text-ima-error transition-colors"
                  data-testid={`delete-social-${link.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ima-text-secondary text-sm hover:text-ima-primary transition-colors truncate block"
            >
              {link.url}
            </a>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12">
          <p className="text-ima-text-secondary mb-4">No social links yet</p>
          <button onClick={() => openModal()} className="text-ima-primary hover:underline">
            Add your first link
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-ima-surface rounded-2xl w-full max-w-md" data-testid="social-modal">
            <div className="p-6 border-b border-ima-border flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingLink ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-ima-text-secondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Platform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none"
                  data-testid="social-platform-select"
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {formatPlatformName(platform)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="social-url-input"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
                  data-testid="social-visible-checkbox"
                />
                <span className="text-white text-sm">Visible on site</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 border border-ima-border text-white rounded-lg font-medium hover:bg-ima-surface-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors"
                  data-testid="social-save-button"
                >
                  {editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
