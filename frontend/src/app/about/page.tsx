import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockSettings, mockContent, mockNavigation, mockSocialLinks, contentToMap } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About | IMA',
  description: 'Learn about IMA - a creative studio specializing in visual storytelling and digital solutions.',
};

export default function AboutPage() {
  const settings = mockSettings;
  const content = contentToMap(mockContent);
  const navigation = mockNavigation;
  const socialLinks = mockSocialLinks;

  return (
    <main className="min-h-screen bg-ima-background">
      <Navbar navigation={navigation} settings={settings} />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6" data-testid="about-title">
            {content.about_title || 'About IMA'}
          </h1>
          <p className="text-ima-text-secondary text-lg max-w-3xl">
            {content.about_text || 'We are a creative studio specializing in visual storytelling, brand development, and cutting-edge digital solutions.'}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-ima-text-secondary">
                <p>
                  IMA was founded with a simple mission: to bridge the gap between creative vision 
                  and technical execution. What started as a personal passion for design and 
                  technology has evolved into a comprehensive creative studio.
                </p>
                <p>
                  Today, we work with businesses of all sizes, from startups to established 
                  brands, helping them tell their stories through compelling visuals, engaging 
                  content, and innovative solutions.
                </p>
                <p>
                  As we grow, our vision extends beyond individual projects. We&apos;re building 
                  toward becoming a full-service creative agency, ready to handle everything 
                  from brand strategy to AI-powered automation.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-ima-surface rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1702479744031-2bf1f4bdfd8b?w=800&q=80"
                alt="Creative workspace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-ima-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl text-white mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Boldness',
                description: 'We push creative boundaries and embrace innovative approaches to deliver standout work.',
              },
              {
                title: 'Precision',
                description: 'Every pixel, frame, and line of code is crafted with meticulous attention to detail.',
              },
              {
                title: 'Future-Forward',
                description: 'We stay ahead of trends and technology to ensure your brand remains relevant.',
              },
            ].map((value) => (
              <div key={value.title} className="p-8 bg-ima-background rounded-xl border border-ima-border">
                <h3 className="font-heading font-bold text-xl text-white mb-3">{value.title}</h3>
                <p className="text-ima-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl text-white mb-6">The Road Ahead</h2>
            <p className="text-ima-text-secondary text-lg mb-8">
              IMA is more than a creative studio—it&apos;s a vision for the future. 
              We&apos;re building toward a full-service creative, PR, and tech solutions 
              agency with multiple departments and a talented team of specialists.
            </p>
            <p className="text-ima-text-secondary text-lg mb-10">
              Whether you&apos;re looking for a creative partner today or want to be part 
              of our journey tomorrow, we&apos;d love to connect.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ima-primary text-white rounded-full font-medium hover:bg-ima-primary-hover transition-colors duration-200"
              data-testid="about-cta-button"
            >
              Get in Touch
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer navigation={navigation} socialLinks={socialLinks} settings={settings} />
    </main>
  );
}
