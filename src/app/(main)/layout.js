import Sidebar from "@/components/Sidebar/index";

export default function MainLayout({ children }) {
  console.log("renderLayout");
  return (
    <div className="relative bg-white">
      <Sidebar />
      <div className="h-screen sm:ml-60">{children}</div>
    </div>
  );
}
