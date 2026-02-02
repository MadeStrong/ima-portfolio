'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { mockPortfolio } from '@/lib/mock-data';
import { categoryLabels } from '@/lib/types';
import type { PortfolioItem } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(mockPortfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'graphics' as PortfolioItem['category'],
    description: '',
    tools_used: '',
    media_type: 'image' as PortfolioItem['media_type'],
    media_url: '',
    thumbnail_url: '',
    is_featured: false,
    is_published: true,
  });

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description,
        tools_used: item.tools_used.join(', '),
        media_type: item.media_type || 'image',
        media_url: item.media_url || '',
        thumbnail_url: item.thumbnail_url || '',
        is_featured: item.is_featured,
        is_published: item.is_published,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'graphics',
        description: '',
        tools_used: '',
        media_type: 'image',
        media_url: '',
        thumbnail_url: '',
        is_featured: false,
        is_published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newItem: PortfolioItem = {
      id: editingItem?.id || String(Date.now()),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tools_used: formData.tools_used.split(',').map(t => t.trim()).filter(Boolean),
      media_type: formData.media_type,
      media_url: formData.media_url || undefined,
      thumbnail_url: formData.thumbnail_url || undefined,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      created_at: editingItem?.created_at || now,
      updated_at: now,
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <AdminLayout title="Portfolio Manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-ima-text-secondary">Manage your portfolio items</p>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors duration-200"
          data-testid="add-portfolio-item"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-ima-surface rounded-xl overflow-hidden"
            data-testid={`portfolio-admin-item-${item.id}`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-ima-background">
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ima-text-secondary">
                  No image
                </div>
              )}
              {item.is_featured && (
                <span className="absolute top-2 right-2 p-1.5 bg-ima-primary rounded-full">
                  <Star size={14} className="text-white" />
                </span>
              )}
              {!item.is_published && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-ima-background/80 rounded text-xs text-ima-text-secondary">
                  Draft
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <span className="text-xs text-ima-primary font-medium">{categoryLabels[item.category]}</span>
              <h3 className="font-heading font-bold text-white mt-1 mb-2">{item.title}</h3>
              <p className="text-ima-text-secondary text-sm line-clamp-2 mb-4">{item.description}</p>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-ima-background rounded-lg text-ima-text-secondary hover:text-white transition-colors duration-200"
                  data-testid={`edit-portfolio-${item.id}`}
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-ima-background rounded-lg text-ima-text-secondary hover:text-ima-error transition-colors duration-200"
                  data-testid={`delete-portfolio-${item.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-ima-text-secondary mb-4">No portfolio items yet</p>
          <button
            onClick={() => openModal()}
            className="text-ima-primary hover:underline"
          >
            Add your first item
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-ima-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="portfolio-modal">
            <div className="sticky top-0 bg-ima-surface border-b border-ima-border p-6 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
                <label className="block text-sm font-medium text-white mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none"
                  data-testid="portfolio-title-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PortfolioItem['category'] })}
                    className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none"
                    data-testid="portfolio-category-select"
                  >
                    <option value="graphics">Graphic Design</option>
                    <option value="video">Video Editing</option>
                    <option value="social_media">Social Media</option>
                    <option value="ai_automation">AI Automation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Media Type</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value as PortfolioItem['media_type'] })}
                    className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none"
                    data-testid="portfolio-media-type-select"
                  >
                    <option value="image">Image</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none resize-none"
                  data-testid="portfolio-description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Tools Used (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                  placeholder="Adobe Photoshop, Figma, After Effects"
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="portfolio-tools-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Media URL {formData.media_type !== 'image' && '(paste video link)'}
                </label>
                <input
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder={formData.media_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="portfolio-media-url-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="portfolio-thumbnail-input"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
                    data-testid="portfolio-featured-checkbox"
                  />
                  <span className="text-white text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
                    data-testid="portfolio-published-checkbox"
                  />
                  <span className="text-white text-sm">Published</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 border border-ima-border text-white rounded-lg font-medium hover:bg-ima-surface-hover transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors duration-200"
                  data-testid="portfolio-save-button"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
