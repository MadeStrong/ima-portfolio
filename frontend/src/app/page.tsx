import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockSettings, mockContent, mockNavigation, mockSocialLinks, mockPortfolio, contentToMap } from '@/lib/mock-data';
import { categoryLabels } from '@/lib/types';
import { Palette, Video, Share2, Cpu, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Brand identity, logos, marketing materials, and visual content that captures your essence.',
    href: '/services#graphics',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Professional video production, motion graphics, and post-production services.',
    href: '/services#video',
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Strategy, content creation, and management to grow your online presence.',
    href: '/services#social',
  },
  {
    icon: Cpu,
    title: 'AI Automation',
    description: 'Intelligent workflows and automation solutions to scale your operations.',
    href: '/services#ai',
  },
];

export default function HomePage() {
  const settings = mockSettings;
  const content = contentToMap(mockContent);
  const navigation = mockNavigation;
  const socialLinks = mockSocialLinks;
  const featuredPortfolio = mockPortfolio.filter(item => item.is_featured).slice(0, 3);

  return (
    <main className="min-h-screen bg-ima-background">
      <Navbar navigation={navigation} settings={settings} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-ima-background via-transparent to-ima-background" />
          <img
            src="https://images.unsplash.com/photo-1767477665606-a29603e1c479?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-tight">
              {content.hero_title || 'Creative Solutions for the Digital Age'}
            </h1>
            <p className="text-lg sm:text-xl text-ima-text-secondary mb-10 max-w-2xl">
              {content.hero_subtitle || 'Graphic Design • Video Editing • Social Media • AI Automation'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ima-primary text-white rounded-full font-medium hover:bg-ima-primary-hover transition-colors duration-200"
                data-testid="hero-cta-primary"
              >
                {content.hero_cta || 'View Our Work'}
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-ima-border text-white rounded-full font-medium hover:border-white transition-colors duration-200"
                data-testid="hero-cta-secondary"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-ima-background" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
              {content.services_title || 'What We Do'}
            </h2>
            <p className="text-ima-text-secondary max-w-2xl mx-auto">
              Comprehensive creative services to elevate your brand and drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group p-6 bg-ima-surface rounded-xl border border-transparent hover:border-ima-primary transition-all duration-300"
                  data-testid={`service-card-${service.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-ima-primary/10 flex items-center justify-center mb-4 group-hover:bg-ima-primary transition-colors duration-200">
                    <Icon className="w-6 h-6 text-ima-primary group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">{service.title}</h3>
                  <p className="text-ima-text-secondary text-sm">{service.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-24 bg-ima-surface/30" data-testid="featured-work-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">
                Featured Work
              </h2>
              <p className="text-ima-text-secondary">
                Selected projects that showcase our expertise.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-ima-primary hover:underline font-medium"
              data-testid="view-all-work-link"
            >
              View All Work
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPortfolio.map((item) => (
              <article
                key={item.id}
                className="group bg-ima-background border border-ima-border rounded-xl overflow-hidden hover:border-ima-surface-hover transition-all duration-300"
                data-testid={`featured-item-${item.id}`}
              >
                <div className="relative aspect-video bg-ima-surface overflow-hidden">
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ima-background/80 text-xs font-medium text-white">
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-ima-text-secondary text-sm line-clamp-2">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-ima-background" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            {content.contact_title || "Let's Create Together"}
          </h2>
          <p className="text-ima-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            {content.contact_subtitle || 'Have a project in mind? We would love to hear from you.'}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-ima-primary text-white rounded-full font-medium text-lg hover:bg-ima-primary-hover transition-colors duration-200"
            data-testid="cta-button"
          >
            Start a Project
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer navigation={navigation} socialLinks={socialLinks} settings={settings} />
    </main>
  );
}
