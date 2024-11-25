import { DocumentProvider } from "@/layouts/document";

type DocumentPageLayoutProps = {
  children: React.ReactNode;
};

export default async function DocumentPageLayout({
  children,
}: DocumentPageLayoutProps) {
  return <DocumentProvider>{children}</DocumentProvider>;
}
