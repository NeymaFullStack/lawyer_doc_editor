import Sidebar from "@/components/Sidebar/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="relative bg-white">
      <Sidebar />
      <div className="h-screen sm:ml-60">{children}</div>
    </div>
  );
}
