'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { mockNavigation } from '@/lib/mock-data';
import type { NavItem } from '@/lib/types';
import { Plus, GripVertical, Pencil, Trash2, X, ExternalLink, Eye, EyeOff } from 'lucide-react';

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>(mockNavigation);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    is_external: false,
    is_visible: true,
  });

  const openModal = (item?: NavItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        href: item.href,
        is_external: item.is_external,
        is_visible: item.is_visible,
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        href: '',
        is_external: false,
        is_visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setItems(items.map(i => 
        i.id === editingItem.id 
          ? { ...i, ...formData }
          : i
      ));
    } else {
      const newItem: NavItem = {
        id: String(Date.now()),
        ...formData,
        display_order: items.length,
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this navigation item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const toggleVisibility = (id: string) => {
    setItems(items.map(i => 
      i.id === id ? { ...i, is_visible: !i.is_visible } : i
    ));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    newItems.forEach((item, i) => item.display_order = i);
    setItems(newItems);
  };

  return (
    <AdminLayout title="Navigation Manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-ima-text-secondary">Manage your site navigation menu</p>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors duration-200"
          data-testid="add-nav-item"
        >
          <Plus size={18} />
          Add Link
        </button>
      </div>

      {/* Navigation Items */}
      <div className="bg-ima-surface rounded-xl overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-ima-text-secondary mb-4">No navigation items yet</p>
            <button onClick={() => openModal()} className="text-ima-primary hover:underline">
              Add your first link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-ima-border">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 ${!item.is_visible ? 'opacity-50' : ''}`}
                data-testid={`nav-item-${item.id}`}
              >
                {/* Drag Handle */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-ima-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical size={16} />
                  </button>
                </div>

                {/* Order Number */}
                <span className="w-8 h-8 rounded-full bg-ima-background flex items-center justify-center text-sm text-ima-text-secondary">
                  {index + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.label}</span>
                    {item.is_external && (
                      <ExternalLink size={14} className="text-ima-text-secondary" />
                    )}
                  </div>
                  <span className="text-sm text-ima-text-secondary">{item.href}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className="p-2 text-ima-text-secondary hover:text-white transition-colors"
                    data-testid={`toggle-visibility-${item.id}`}
                  >
                    {item.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 text-ima-text-secondary hover:text-white transition-colors"
                    data-testid={`edit-nav-${item.id}`}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-ima-text-secondary hover:text-ima-error transition-colors"
                    data-testid={`delete-nav-${item.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-ima-surface rounded-2xl w-full max-w-md" data-testid="nav-modal">
            <div className="p-6 border-b border-ima-border flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-white">
                {editingItem ? 'Edit Navigation Link' : 'Add Navigation Link'}
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
                <label className="block text-sm font-medium text-white mb-2">Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home"
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="nav-label-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">URL *</label>
                <input
                  type="text"
                  required
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/about or https://example.com"
                  className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="nav-href-input"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_external}
                    onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                    className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
                    data-testid="nav-external-checkbox"
                  />
                  <span className="text-white text-sm">External link</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="w-5 h-5 rounded border-ima-border bg-ima-background text-ima-primary focus:ring-ima-primary"
                    data-testid="nav-visible-checkbox"
                  />
                  <span className="text-white text-sm">Visible</span>
                </label>
              </div>

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
                  data-testid="nav-save-button"
                >
                  {editingItem ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
