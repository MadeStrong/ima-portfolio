// Mock data for demonstration when Supabase is not configured
import type { ContentBlock, NavItem, SocialLink, PortfolioItem, SiteSettings } from './types';

export const mockSettings: SiteSettings = {
  id: 'default',
  site_name: 'IMA',
  logo_url: 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
  favicon_url: 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
  primary_color: '#E10600',
  footer_text: '© 2025 IMA. All rights reserved.',
};

export const mockContent: ContentBlock[] = [
  { id: '1', key: 'hero_title', value: 'Creative Solutions for the Digital Age', type: 'text', updated_at: new Date().toISOString() },
  { id: '2', key: 'hero_subtitle', value: 'Graphic Design • Video Editing • Social Media • AI Automation', type: 'text', updated_at: new Date().toISOString() },
  { id: '3', key: 'hero_cta', value: 'View Our Work', type: 'text', updated_at: new Date().toISOString() },
  { id: '4', key: 'about_title', value: 'About IMA', type: 'text', updated_at: new Date().toISOString() },
  { id: '5', key: 'about_text', value: 'We are a creative studio specializing in visual storytelling, brand development, and cutting-edge digital solutions. Our mission is to transform ideas into impactful experiences that resonate with audiences and drive results.', type: 'text', updated_at: new Date().toISOString() },
  { id: '6', key: 'services_title', value: 'What We Do', type: 'text', updated_at: new Date().toISOString() },
  { id: '7', key: 'contact_title', value: "Let's Create Together", type: 'text', updated_at: new Date().toISOString() },
  { id: '8', key: 'contact_subtitle', value: 'Have a project in mind? We would love to hear from you.', type: 'text', updated_at: new Date().toISOString() },
];

export const mockNavigation: NavItem[] = [
  { id: '1', label: 'Home', href: '/', display_order: 0, is_visible: true, is_external: false },
  { id: '2', label: 'Portfolio', href: '/portfolio', display_order: 1, is_visible: true, is_external: false },
  { id: '3', label: 'Services', href: '/services', display_order: 2, is_visible: true, is_external: false },
  { id: '4', label: 'About', href: '/about', display_order: 3, is_visible: true, is_external: false },
  { id: '5', label: 'Contact', href: '/contact', display_order: 4, is_visible: true, is_external: false },
];

export const mockSocialLinks: SocialLink[] = [
  { id: '1', platform: 'instagram', url: 'https://instagram.com/ima', is_visible: true, display_order: 0 },
  { id: '2', platform: 'linkedin', url: 'https://linkedin.com/company/ima', is_visible: true, display_order: 1 },
  { id: '3', platform: 'behance', url: 'https://behance.net/ima', is_visible: true, display_order: 2 },
  { id: '4', platform: 'youtube', url: 'https://youtube.com/@ima', is_visible: true, display_order: 3 },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: '1',
    title: 'Brand Identity Design',
    category: 'graphics',
    description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines.',
    tools_used: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    media_type: 'image',
    thumbnail_url: 'https://images.unsplash.com/photo-1600590008363-1c7dcf5d568d?w=800',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Launch Video',
    category: 'video',
    description: 'Cinematic product launch video with motion graphics and professional color grading.',
    tools_used: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    media_type: 'youtube',
    media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Social Media Campaign',
    category: 'social_media',
    description: 'Comprehensive social media strategy and content creation for product launch.',
    tools_used: ['Canva', 'Adobe Express', 'Hootsuite'],
    media_type: 'image',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    is_featured: false,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'AI Workflow Automation',
    category: 'ai_automation',
    description: 'Custom AI-powered automation system for content scheduling and analytics.',
    tools_used: ['Python', 'OpenAI API', 'Zapier', 'Make'],
    media_type: 'image',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to convert content array to object
export function contentToMap(content: ContentBlock[]): Record<string, string> {
  const map: Record<string, string> = {};
  content.forEach((block) => {
    map[block.key] = block.value;
  });
  return map;
}
