'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { mockSettings } from '@/lib/mock-data';
import type { SiteSettings } from '@/lib/types';
import { Save, Upload } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout title="Site Settings">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* General Settings */}
        <section className="bg-ima-surface rounded-xl p-6">
          <h2 className="font-heading font-bold text-lg text-white mb-6">General</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white focus:border-ima-primary focus:outline-none"
                data-testid="settings-site-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Footer Text</label>
              <input
                type="text"
                value={settings.footer_text || ''}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                placeholder="© 2025 Your Company. All rights reserved."
                className="w-full h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                data-testid="settings-footer-text"
              />
            </div>
          </div>
        </section>

        {/* Branding */}
        <section className="bg-ima-surface rounded-xl p-6">
          <h2 className="font-heading font-bold text-lg text-white mb-6">Branding</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Logo URL</label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="settings-logo-url"
                />
                {settings.logo_url && (
                  <div className="w-12 h-12 rounded-lg bg-ima-background flex items-center justify-center">
                    <img src={settings.logo_url} alt="Logo preview" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
              <p className="text-xs text-ima-text-secondary mt-2">
                Enter a URL to your logo image. For file uploads, use Supabase Storage.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Favicon URL</label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={settings.favicon_url || ''}
                  onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="settings-favicon-url"
                />
                {settings.favicon_url && (
                  <div className="w-12 h-12 rounded-lg bg-ima-background flex items-center justify-center">
                    <img src={settings.favicon_url} alt="Favicon preview" className="max-w-full max-h-full" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  placeholder="#E10600"
                  className="flex-1 h-12 px-4 bg-ima-background border border-ima-border rounded-lg text-white placeholder:text-ima-text-secondary/50 focus:border-ima-primary focus:outline-none"
                  data-testid="settings-primary-color"
                />
                <div 
                  className="w-12 h-12 rounded-lg border border-ima-border"
                  style={{ backgroundColor: settings.primary_color }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Supabase Info */}
        <section className="bg-ima-surface rounded-xl p-6">
          <h2 className="font-heading font-bold text-lg text-white mb-4">Database Configuration</h2>
          <p className="text-ima-text-secondary text-sm mb-4">
            This site uses Supabase for data storage. Configure your credentials in the environment variables:
          </p>
          <div className="bg-ima-background rounded-lg p-4 font-mono text-sm">
            <p className="text-ima-text-secondary">NEXT_PUBLIC_SUPABASE_URL=your-project-url</p>
            <p className="text-ima-text-secondary">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-ima-primary text-white rounded-lg font-medium hover:bg-ima-primary-hover disabled:opacity-50 transition-colors"
            data-testid="settings-save-button"
          >
            {isSaving ? (
              <span className="spinner" />
            ) : (
              <Save size={18} />
            )}
            Save Settings
          </button>
          {saved && (
            <span className="text-ima-success text-sm">Settings saved successfully!</span>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
