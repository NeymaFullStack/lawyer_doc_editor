import { EditorLayout } from "@/layouts/editor";

type EditorPageLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ "document-id": string }>;
};

export default async function EditorPageLayout({
  children,
  params,
}: EditorPageLayoutProps) {
  const documentId = (await params)["document-id"];
  return <EditorLayout id={documentId}>{children}</EditorLayout>;
}
