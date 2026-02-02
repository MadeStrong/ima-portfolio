// Database types for Supabase PostgreSQL schema

export interface Page {
  id: string;
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sections: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'graphics' | 'video' | 'social_media' | 'ai_automation';
  description: string;
  tools_used: string[];
  media_type?: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'image';
  media_url?: string;
  thumbnail_url?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_visible: boolean;
  display_order: number;
}

export interface ContentBlock {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'image_url';
  updated_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  display_order: number;
  is_visible: boolean;
  is_external: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  subscribe_newsletter: boolean;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  footer_text?: string;
}

// Category labels for display
export const categoryLabels: Record<string, string> = {
  graphics: 'Graphic Design',
  video: 'Video Editing',
  social_media: 'Social Media',
  ai_automation: 'AI Automation',
};

// Social platform icons mapping
export const socialPlatforms = [
  'linkedin',
  'instagram', 
  'facebook',
  'twitter',
  'tiktok',
  'youtube',
  'behance',
  'dribbble',
  'github',
] as const;
