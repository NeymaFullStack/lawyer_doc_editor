import DashboardHeader from "@/components/dashboard/header/index";
import { Toaster } from "@/components/shadcn-components/ui/sonner";

export const metadata = {
  title: "Logan - Dashboard",
  description: "Logan Application",
};

export default function Layout({ children }) {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader />
      <Toaster className="left-[16rem]  max-w-full" position="bottom-left" />

      {children}
    </div>
  );
}
