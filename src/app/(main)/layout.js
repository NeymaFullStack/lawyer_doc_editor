import UserDetailsProvider from "@/components/auth/UserDetailsProvider";
import Sidebar from "@/components/Sidebar/index";

export default function MainLayout({ children }) {
  return (
    <div className="relative bg-white">
      <UserDetailsProvider>
        <Sidebar />
        <div className="h-screen sm:ml-60">{children}</div>
      </UserDetailsProvider>
    </div>
  );
}
