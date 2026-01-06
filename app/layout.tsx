import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fountain Birthdays',
  description: 'Track and celebrate birthdays with style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


