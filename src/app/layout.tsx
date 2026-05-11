import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Volvo EX30 | SUV compact 100 % électrique | Volvo Cars Belgique',
  description:
    'Découvrez la Volvo EX30 100 % électrique, notre plus compacte SUV doté d’une autonomie impressionnante et de capacités de recharge rapide.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
