import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
