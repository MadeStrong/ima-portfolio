'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavItem, SiteSettings } from '@/lib/types';

interface NavbarProps {
  navigation: NavItem[];
  settings: SiteSettings;
}

export default function Navbar({ navigation, settings }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-ima-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3" data-testid="nav-logo">
              {settings?.logo_url && (
                <img
                  src={settings.logo_url}
                  alt={settings?.site_name || 'IMA'}
                  className="h-10 w-auto"
                />
              )}
              <span className="font-heading font-bold text-xl text-white">
                {settings?.site_name || 'IMA'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.is_external ? '_blank' : undefined}
                  rel={item.is_external ? 'noopener noreferrer' : undefined}
                  className={`font-heading text-sm tracking-wide transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-ima-text-secondary hover:text-white'
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-ima-primary text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-ima-primary-hover transition-colors duration-200"
                data-testid="nav-cta-button"
              >
                Get in Touch
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-ima-background pt-20 md:hidden">
          <div className="flex flex-col items-center gap-6 py-12">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.is_external ? '_blank' : undefined}
                className={`font-heading text-2xl transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-ima-text-secondary'
                }`}
                data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-ima-primary text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-ima-primary-hover transition-colors duration-200 mt-4"
              data-testid="mobile-nav-cta"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
