import DashboardHeader from "@/components/dashboard/header/index";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Logan - Dashboard",
  description: "Logan Application",
};

export default function Layout({ children }) {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader />
      <Toaster
        toastOptions={{
          style: { width: "max-content" },
          className: "left-[14rem]",
        }}
        position="bottom-left"
      />

      {children}
    </div>
  );
}
