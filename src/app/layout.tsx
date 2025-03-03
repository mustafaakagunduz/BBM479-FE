import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import RootLayoutClient from '@/app/RootLayoutClient';

export const metadata: Metadata = {
  title: "DX-HRSAM",
  description: "HR Survey Application Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}