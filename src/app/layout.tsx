import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/auth/context";

export const primaryFont = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Logan - The Ultimate Document Collaboration Tool for Lawyers",
  description:
    "Logain is a secure, efficient, and collaborative document management solution designed exclusively for legal professionals",
  keywords: [
    "lawyers",
    "legal document",
    "document collaboration",
    "secure document sharing",
    "legal software",
    "law firm management",
  ],
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={primaryFont.className}>
      <AuthProvider>
        <body className={primaryFont.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
