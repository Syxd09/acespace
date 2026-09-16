import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Administration — Ace Spaces',
  description: 'Private administration portal for Ace Spaces material catalog, leads, and fabrication metrics.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
