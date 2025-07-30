import type { Metadata } from 'next';
import './root.css';

export const metadata: Metadata = {
  title: 'CE.SDK Demo',
  description: 'Build using the CE.SDK'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
