'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { mockContent } from '@/lib/mock-data';
import type { ContentBlock } from '@/lib/types';
import { Save, Plus, X } from 'lucide-react';

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentBlock[]>(mockContent);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleEdit = (block: ContentBlock) => {
    setEditingKey(block.key);
    setEditValue(block.value);
  };

  const handleSave = (key: string) => {
    setContent(content.map(c => 
      c.key === key 
        ? { ...c, value: editValue, updated_at: new Date().toISOString() }
        : c
    ));
    setEditingKey(null);
    setEditValue('');
  };

  const handleAddNew = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    
    const newBlock: ContentBlock = {
      id: String(Date.now()),
      key: newKey.toLowerCase().replace(/\s+/g, '_'),
      value: newValue,
      type: 'text',
      updated_at: new Date().toISOString(),
    };
    
    setContent([...content, newBlock]);
    setIsAddingNew(false);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (key: string) => {
    if (confirm('Are you sure you want to delete this content block?')) {
      setContent(content.filter(c => c.key !== key));
    }
  };

  // Group content by section
  const groupedContent = {
    hero: content.filter(c => c.key.startsWith('hero')),
    about: content.filter(c => c.key.startsWith('about')),
    services: content.filter(c => c.key.startsWith('services')),
    contact: content.filter(c => c.key.startsWith('contact')),
    other: content.filter(c => !['hero', 'about', 'services', 'contact'].some(s => c.key.startsWith(s))),
  };

  const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderContentSection = (title: string, blocks: ContentBlock[]) => {
    if (blocks.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="font-heading font-bold text-lg text-white mb-4">{title}</h2>
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.key}
              className="bg-ima-surface rounded-xl p-5"
              data-testid={`content-block-${block.key}`}
            >
              <div className="flex items-start justify-between mb-3">
                <label className="text-sm font-medium text-ima-text-secondary">
                  {formatKey(block.key)}
                </label>
                <div className="flex items-center gap-2">
                  {editingKey === block.key ? (
                    <>
                      <button
                        onClick={() => handleSave(block.key)}
                        className="p-2 text-ima-success hover:bg-ima-surface-hover rounded-lg transition-colors"
                        data-testid={`save-content-${block.key}`}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="p-2 text-ima-text-secondary hover:bg-ima-surface-hover rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(block)}
                        className="text-xs text-ima-primary hover:underline"
                        data-testid={`edit-content-${block.key}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(block.key)}
                        className="text-xs text-ima-error hover:underline"
                        data-testid={`delete-content-${block.key}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {editingKey === block.key ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none resize-none"
                  autoFocus
                  data-testid={`content-textarea-${block.key}`}
                />
              ) : (
                <p className="text-white">{block.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title="Content Editor">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-ima-text-secondary">Edit text content across your site</p>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover transition-colors duration-200"
          data-testid="add-content-block"
        >
          <Plus size={18} />
          Add Block
        </button>
      </div>

      {/* Add New Block Form */}
      {isAddingNew && (
        <div className="bg-ima-surface rounded-xl p-6 mb-8" data-testid="new-content-form">
          <h3 className="font-heading font-bold text-white mb-4">Add New Content Block</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Key (e.g., hero_tagline)</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="section_name"
                className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                data-testid="new-content-key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Value</label>
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                rows={3}
                placeholder="Your content here..."
                className="w-full px-4 py-3 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none resize-none"
                data-testid="new-content-value"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-ima-border text-white rounded-lg hover:bg-ima-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-ima-primary text-white rounded-lg hover:bg-ima-primary-hover transition-colors"
                data-testid="save-new-content"
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {renderContentSection('Hero Section', groupedContent.hero)}
      {renderContentSection('About Section', groupedContent.about)}
      {renderContentSection('Services Section', groupedContent.services)}
      {renderContentSection('Contact Section', groupedContent.contact)}
      {renderContentSection('Other', groupedContent.other)}
    </AdminLayout>
  );
}
