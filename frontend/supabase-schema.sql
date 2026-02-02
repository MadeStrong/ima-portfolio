-- IMA Portfolio CMS Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('graphics', 'video', 'social_media', 'ai_automation')),
  description TEXT NOT NULL,
  tools_used TEXT[] DEFAULT '{}',
  media_type VARCHAR(20) CHECK (media_type IN ('youtube', 'instagram', 'tiktok', 'twitter', 'image')),
  media_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content blocks table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'html', 'image_url')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(100) NOT NULL,
  href VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Messages/contact submissions table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  subscribe_newsletter BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(50) DEFAULT 'contact_form',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(100) DEFAULT 'IMA',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(20) DEFAULT '#E10600',
  footer_text TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio(is_published);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_navigation_order ON navigation(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(display_order);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published pages" ON pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published portfolio" ON portfolio
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view content" ON content
  FOR SELECT USING (true);

CREATE POLICY "Public can view visible navigation" ON navigation
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view visible social links" ON social_links
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

-- Public can submit messages
CREATE POLICY "Public can create messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) have full access
CREATE POLICY "Admins can manage pages" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage portfolio" ON portfolio
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage content" ON content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage navigation" ON navigation
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage social links" ON social_links
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings if not exists
INSERT INTO settings (site_name, logo_url, favicon_url, primary_color, footer_text)
SELECT 'IMA', 
  'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
  'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
  '#E10600',
  '© 2025 IMA. All rights reserved.'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Insert default navigation
INSERT INTO navigation (label, href, display_order, is_visible, is_external)
SELECT * FROM (VALUES
  ('Home', '/', 0, true, false),
  ('Portfolio', '/portfolio', 1, true, false),
  ('Services', '/services', 2, true, false),
  ('About', '/about', 3, true, false),
  ('Contact', '/contact', 4, true, false)
) AS v(label, href, display_order, is_visible, is_external)
WHERE NOT EXISTS (SELECT 1 FROM navigation);

-- Insert default content blocks
INSERT INTO content (key, value, type)
SELECT * FROM (VALUES
  ('hero_title', 'Creative Solutions for the Digital Age', 'text'),
  ('hero_subtitle', 'Graphic Design • Video Editing • Social Media • AI Automation', 'text'),
  ('hero_cta', 'View Our Work', 'text'),
  ('about_title', 'About IMA', 'text'),
  ('about_text', 'We are a creative studio specializing in visual storytelling, brand development, and cutting-edge digital solutions.', 'text'),
  ('services_title', 'What We Do', 'text'),
  ('contact_title', 'Let''s Create Together', 'text'),
  ('contact_subtitle', 'Have a project in mind? We would love to hear from you.', 'text')
) AS v(key, value, type)
WHERE NOT EXISTS (SELECT 1 FROM content);

-- Insert sample social links
INSERT INTO social_links (platform, url, is_visible, display_order)
SELECT * FROM (VALUES
  ('instagram', 'https://instagram.com/ima', true, 0),
  ('linkedin', 'https://linkedin.com/company/ima', true, 1),
  ('behance', 'https://behance.net/ima', true, 2),
  ('youtube', 'https://youtube.com/@ima', true, 3)
) AS v(platform, url, is_visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM social_links);
