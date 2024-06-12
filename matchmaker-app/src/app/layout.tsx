import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import './css';
import './globals.scss';
//This is the ROOT LAYOUT

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='h-screen p-8 flex flex-col items-stretch font-mono box-border'>{children}</body>
    </html>
  );
}
