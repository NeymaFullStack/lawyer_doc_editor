import DashboardHeader from "@/components/dashboard/header/DashboardHeader";

export const metadata = {
  title: "Logan - Dashboard",
  description: "Logan Application",
};

export default function Layout({ children }) {
  return (
    <div className="h-full flex flex-col">
      <DashboardHeader />
      {children}
    </div>
  );
}
