import { ViewProvider } from "@/components/file-manager-caption/context";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return <ViewProvider defaultView={"grid"}>{children}</ViewProvider>;
}
