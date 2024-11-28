// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google';
import RootLayoutClient from '@/app/RootLayoutClient';

// Font tanımlamaları
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ['latin'] });

// Metadata tanımlaması
export const metadata: Metadata = {
  title: "DX-HRSAM",
  description: "HR Survey Application Management",
};

// Root Layout (Server Component)
export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <RootLayoutClient>{children}</RootLayoutClient>
      </body>
      </html>
  );
}