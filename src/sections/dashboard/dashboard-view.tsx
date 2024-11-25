import { FileManagerCaption } from "@/components/file-manager-caption/file-manager-caption";
import { iconColors } from "../../../tailwind.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentDocumentsView } from "./recent-document-view";
import { ClientFoldersView } from "./client-folder-view";

export default function DashboardView() {
  return (
    <div className="h-screen min-h-screen max-h-screen">
      <div className="flex flex-col items-stretch gap-5 h-full self-stretch min-h-screen">
        <FileManagerCaption
          placeholder="Search a client, document..."
          color={iconColors.from}
        />
        <ScrollArea className="flex-grow bg-logan-primary-200 rounded-tl-xl border-t border-l border-logan-primary-300">
          <div className="pt-10 px-10  flex flex-col items-stretch gap-12 pb-4">
            <RecentDocumentsView />
            <ClientFoldersView />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
