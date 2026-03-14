import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OTShield',
  description: 'OT security operations dashboard with AI-assisted triage and Supabase-backed demo state.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full bg-brand-bg text-zinc-100">{children}</body>
    </html>
  );
}
