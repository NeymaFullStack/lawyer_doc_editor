import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import SideNav from "./side-nav";
import { ChevronsLeft } from "lucide-react";
import { iconColors } from "../../../tailwind.config";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <SideNav />
      <main className="flex-grow relative">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

const SidebarTrigger = () => {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const isExpanded = state === "expanded" && !isMobile;
  return (
    <div
      className="absolute top-52 -left-3.5 z-20 cursor-pointer rounded-full shadow-badge-sm border border-logan-primary-300 bg-white p-0.5"
      onClick={toggleSidebar}
    >
      <ChevronsLeft
        className={cn("w-6 h-6 text-foreground", { "rotate-180": !isExpanded })}
        color={iconColors.from}
      />
    </div>
  );
};
