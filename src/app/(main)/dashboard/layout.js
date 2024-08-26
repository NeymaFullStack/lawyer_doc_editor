import DashboardHeader from "@/components/dashboard/header/index";

export const metadata = {
  title: "Logan - Dashboard",
  description: "Logan Application",
};

export default function Layout({ children }) {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader />
      {children}
    </div>
  );
}
