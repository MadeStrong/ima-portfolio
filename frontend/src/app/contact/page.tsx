import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { mockSettings, mockContent, mockNavigation, mockSocialLinks, contentToMap } from '@/lib/mock-data';
import { Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact | IMA',
  description: 'Get in touch with IMA for your next creative project.',
};

export default function ContactPage() {
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
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6" data-testid="contact-title">
            {content.contact_title || "Let's Create Together"}
          </h1>
          <p className="text-ima-text-secondary text-lg max-w-2xl">
            {content.contact_subtitle || 'Have a project in mind? We would love to hear from you.'}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-ima-surface rounded-2xl p-8 md:p-10">
                <h2 className="font-heading font-bold text-2xl text-white mb-8">Send us a message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="bg-ima-surface rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-ima-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-white">Email</h3>
                </div>
                <p className="text-ima-text-secondary">hello@ima.studio</p>
              </div>

              <div className="bg-ima-surface rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-ima-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-ima-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-white">Location</h3>
                </div>
                <p className="text-ima-text-secondary">Available Worldwide<br />Remote-First Studio</p>
              </div>

              {/* Social Links */}
              <div className="bg-ima-surface rounded-xl p-6">
                <h3 className="font-heading font-bold text-white mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-ima-background text-ima-text-secondary text-sm hover:bg-ima-primary hover:text-white transition-all duration-200 capitalize"
                      data-testid={`contact-social-${link.platform}`}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer navigation={navigation} socialLinks={socialLinks} settings={settings} />
    </main>
  );
}
