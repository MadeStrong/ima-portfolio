import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IMA - Creative Solutions for the Digital Age',
  description: 'Creative studio specializing in Graphic Design, Video Editing, Social Media Management, and AI Automation.',
  icons: {
    icon: 'https://customer-assets.emergentagent.com/job_ee8839b2-9350-41a5-9777-cc145839fd61/artifacts/dh6cyvhn_3.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ima-background text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
