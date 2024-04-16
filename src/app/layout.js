import { Inter } from "next/font/google";
import "../styles/scss/global.scss";

import Sidebar from "@/components/sidebar/Sidebar";
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
        <StoreProvider>
          <div className="bg-white relative">
            <Sidebar />
            <div className="sm:ml-60 h-screen">{children}</div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
