import { FileManagerCaption } from "@/components/file-manager-caption/file-manager-caption";
import { iconColors } from "../../../tailwind.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentDocumentsView } from "./recent-document-view";
import { ClientFoldersView } from "./client-folder-view";

export default function DashboardView() {
  return (
    <div className="h-screen max-h-screen min-h-screen">
      <div className="flex h-full min-h-screen flex-col items-stretch gap-5 self-stretch">
        <FileManagerCaption
          placeholder="Search a client, document..."
          color={iconColors.from}
        />
        <ScrollArea className="flex-grow rounded-tl-xl border-l border-t border-logan-primary-300 bg-logan-primary-200">
          <div className="flex flex-col items-stretch gap-12 px-10 pb-4 pt-10">
            <RecentDocumentsView />
            <ClientFoldersView />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
