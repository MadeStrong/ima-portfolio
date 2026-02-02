import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockSettings, mockNavigation, mockSocialLinks } from '@/lib/mock-data';
import { Palette, Video, Share2, Cpu, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Services | IMA',
  description: 'Professional creative services including graphic design, video editing, social media management, and AI automation.',
};

const services = [
  {
    id: 'graphics',
    icon: Palette,
    title: 'Graphic Design',
    description: 'We create stunning visual assets that capture your brand essence and communicate your message effectively.',
    features: [
      'Brand Identity & Logo Design',
      'Marketing Materials & Brochures',
      'Social Media Graphics',
      'Packaging Design',
      'UI/UX Design',
      'Print & Digital Advertising',
    ],
  },
  {
    id: 'video',
    icon: Video,
    title: 'Video Editing',
    description: 'Professional video production and post-production services to bring your stories to life.',
    features: [
      'Commercial & Promotional Videos',
      'Social Media Content',
      'Motion Graphics & Animation',
      'Color Grading & Correction',
      'Documentary & Corporate Films',
      'YouTube & Podcast Production',
    ],
  },
  {
    id: 'social',
    icon: Share2,
    title: 'Social Media Management',
    description: 'Strategic social media services to grow your audience and strengthen your online presence.',
    features: [
      'Social Media Strategy',
      'Content Planning & Calendar',
      'Community Management',
      'Influencer Partnerships',
      'Analytics & Reporting',
      'Paid Social Advertising',
    ],
  },
  {
    id: 'ai',
    icon: Cpu,
    title: 'AI Automation',
    description: 'Intelligent automation solutions to streamline your workflows and scale your operations.',
    features: [
      'Workflow Automation',
      'AI Content Generation',
      'Chatbot Development',
      'Data Analysis & Insights',
      'Process Optimization',
      'Custom AI Integrations',
    ],
  },
];

export default function ServicesPage() {
  const settings = mockSettings;
  const navigation = mockNavigation;
  const socialLinks = mockSocialLinks;

  return (
    <main className="min-h-screen bg-ima-background">
      <Navbar navigation={navigation} settings={settings} />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6" data-testid="services-title">
            Our Services
          </h1>
          <p className="text-ima-text-secondary text-lg max-w-2xl">
            Comprehensive creative and technical solutions tailored to elevate your brand 
            and achieve your business goals.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                data-testid={`service-section-${service.id}`}
              >
                <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                  <div className="w-14 h-14 rounded-xl bg-ima-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-ima-primary" />
                  </div>
                  <h2 className="font-heading font-bold text-3xl text-white mb-4">{service.title}</h2>
                  <p className="text-ima-text-secondary mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-ima-text-secondary">
                        <Check className="w-5 h-5 text-ima-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-ima-primary text-white rounded-full font-medium hover:bg-ima-primary-hover transition-colors duration-200"
                    data-testid={`service-cta-${service.id}`}
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} aspect-square bg-ima-surface rounded-2xl overflow-hidden`}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-32 h-32 text-ima-border" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-ima-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-ima-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-ima-primary text-white rounded-full font-medium text-lg hover:bg-ima-primary-hover transition-colors duration-200"
            data-testid="services-cta-button"
          >
            Contact Us
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer navigation={navigation} socialLinks={socialLinks} settings={settings} />
    </main>
  );
}
