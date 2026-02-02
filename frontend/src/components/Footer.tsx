import Link from 'next/link';
import {
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Facebook,
  Github,
} from 'lucide-react';
import type { NavItem, SocialLink, SiteSettings } from '@/lib/types';

interface FooterProps {
  navigation: NavItem[];
  socialLinks: SocialLink[];
  settings: SiteSettings;
}

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
  github: Github,
};

function BehanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

export default function Footer({ navigation, socialLinks, settings }: FooterProps) {
  const getSocialIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform === 'behance') return <BehanceIcon />;
    if (lowerPlatform === 'dribbble') return <DribbbleIcon />;
    if (lowerPlatform === 'tiktok') return <TiktokIcon />;
    
    const Icon = socialIcons[lowerPlatform];
    return Icon ? <Icon size={20} /> : null;
  };

  return (
    <footer className="bg-ima-background border-t border-ima-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              {settings?.logo_url && (
                <img
                  src={settings.logo_url}
                  alt={settings?.site_name || 'IMA'}
                  className="h-12 w-auto"
                />
              )}
              <span className="font-heading font-bold text-2xl text-white">
                {settings?.site_name || 'IMA'}
              </span>
            </Link>
            <p className="text-ima-text-secondary max-w-md mb-6">
              Creative solutions for the digital age. We transform ideas into
              impactful visual experiences.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-ima-surface flex items-center justify-center text-ima-text-secondary hover:bg-ima-primary hover:text-white transition-all duration-200"
                  data-testid={`footer-social-${link.platform}`}
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-ima-text-secondary hover:text-white transition-colors duration-200"
                    data-testid={`footer-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Get in Touch</h4>
            <ul className="space-y-3 text-ima-text-secondary">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors duration-200">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors duration-200">
                  View Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-ima-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ima-text-secondary text-sm">
            {settings?.footer_text || '© 2025 IMA. All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 text-sm text-ima-text-secondary">
            <Link href="/admin/login" className="hover:text-white transition-colors duration-200" data-testid="footer-admin-link">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
