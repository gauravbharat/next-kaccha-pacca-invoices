import '@/app/ui/global.css';
import { inter } from './ui/fonts';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Accounts',
    default: 'Accounts',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* By adding Inter to the <body> element, the font will be applied throughout your application. 
      Here, you're also adding the Tailwind antialiased class which smooths out the font. 
      It's not necessary to use this class, but it adds a nice touch. */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
