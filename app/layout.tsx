import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { SampleProvider } from '@/context/SampleContext';
import SampleTray from '@/components/SampleTray';

export const metadata: Metadata = {
  title: 'Ace Spaces — Material, made architectural',
  description: 'Ace Spaces creates architectural materials, through-body mineral surfaces and fabricated elements for considered spaces in Bengaluru, India.',
  keywords: ['architectural materials', 'surfaces', 'solid surface', 'fabrication', 'Bengaluru', 'interior architecture', 'sample box'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SampleProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <SampleTray />
        </SampleProvider>
      </body>
    </html>
  );
}
