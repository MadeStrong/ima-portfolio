import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioGrid from '@/components/PortfolioGrid';
import { mockSettings, mockNavigation, mockSocialLinks, mockPortfolio } from '@/lib/mock-data';

export const metadata = {
  title: 'Portfolio | IMA',
  description: 'Explore our creative work in graphic design, video editing, social media, and AI automation.',
};

export default function PortfolioPage() {
  const settings = mockSettings;
  const navigation = mockNavigation;
  const socialLinks = mockSocialLinks;
  const portfolio = mockPortfolio.filter(item => item.is_published);

  return (
    <main className="min-h-screen bg-ima-background">
      <Navbar navigation={navigation} settings={settings} />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6" data-testid="portfolio-title">
            Our Work
          </h1>
          <p className="text-ima-text-secondary text-lg max-w-2xl">
            A showcase of our creative projects across graphic design, video production, 
            social media campaigns, and AI automation solutions.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-24" data-testid="portfolio-grid-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGrid items={portfolio} />
        </div>
      </section>

      <Footer navigation={navigation} socialLinks={socialLinks} settings={settings} />
    </main>
  );
}
