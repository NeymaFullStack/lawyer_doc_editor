import { Inter } from "next/font/google";
import "../styles/scss/global.scss";

import StoreProvider from "@/components/ssr/reduxStore/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Logan",
  description: "Logan Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
