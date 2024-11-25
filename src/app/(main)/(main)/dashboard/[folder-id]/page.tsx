import { FolderView } from "@/sections/folders/folder-view";

type FolderPageProps = {
  params: Promise<{ "folder-id": string }>;
};
export default async function FolderPage({ params }: FolderPageProps) {
  const folderId = (await params)["folder-id"];
  return <FolderView folderId={folderId}></FolderView>;
}
