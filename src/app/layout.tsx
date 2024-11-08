import "../styles/scss/global.scss";
import StoreProvider from "@/components/ssr/reduxStore/StoreProvider";
import { Inter } from "next/font/google";

export const metadata = {
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

const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--inter-font",
});

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.variable}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
