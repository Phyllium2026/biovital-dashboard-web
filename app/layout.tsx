import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BIOVITAL',
  description: 'Sistema de monitoreo de biodiversidad y compromisos ambientales',
  manifest: '/manifest.json',
  icons: {
    icon: '/biovital-logo.png',
    apple: '/biovital-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
