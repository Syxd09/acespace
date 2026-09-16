import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { SampleProvider } from '@/context/SampleContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import SampleTray from '@/components/SampleTray';
import ArchitecturalAIBot from '@/components/ArchitecturalAIBot';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Ace Spaces — Material, made architectural',
  description: 'Ace Spaces creates architectural materials, through-body mineral surfaces and fabricated elements for considered spaces in Bengaluru, India.',
  keywords: ['architectural materials', 'surfaces', 'solid surface', 'fabrication', 'Bengaluru', 'interior architecture', 'sample box'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteContentProvider>
          <SampleProvider>
            <SiteHeader />
            <PageTransition>
              {children}
            </PageTransition>
            <SiteFooter />
            <SampleTray />
            <ArchitecturalAIBot />
          </SampleProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
