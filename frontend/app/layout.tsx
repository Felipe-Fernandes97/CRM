import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import LiquidChromeWrapper from '@/components/ui/LiquidChromeWrapper';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM System",
  description: "Sistema de CRM desenvolvido com Next.js e NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link href="https://fonts.cdnfonts.com/css/bitcount-grid-double" rel="stylesheet" />
      </head>
      <body className={`${poppins.className} min-h-screen bg-[#000000] text-white antialiased relative`}>
        {/* Liquid Chrome Background - Global */}
        <div className="fixed inset-0 z-0">
          <LiquidChromeWrapper />
        </div>
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
