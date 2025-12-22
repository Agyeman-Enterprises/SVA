import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "agyeman-lms",
  description: "Agyeman Enterprises LMS",
};

import { headers } from "next/headers";
import { TenantProvider } from "../tenants/provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const t = h.get("x-tenant") ?? "default";
  const isTenantId = (v: string): v is import("../tenants/config").TenantId =>
    v === "default" || v === "tls" || v === "spm" || v === "sva";
  const tenant = isTenantId(t) ? t : "default";
  return (
    <html lang="en" data-tenant={tenant}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TenantProvider tenant={tenant}>{children}</TenantProvider>
      </body>
    </html>
  );
}
