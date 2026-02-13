import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sky RTGGuide - Rainbow Tourism Group AI Assistant',
  description: 'AI-powered chatbot for RTG policies, dress codes, and ISO standards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
