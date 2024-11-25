"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import axios, { endpoints } from "@/lib/axios";
import React from "react";
import { DocumentItemType } from "@/components/file-manager/type";
import { Icon } from "@/components/icons";
import { iconColors } from "../../../tailwind.config";
import { formatDateToCustomFormat } from "@/lib/date";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useWindowWidth } from "@/hooks/use-window-width";
import { useFetcher } from "@/hooks/use-fetcher";
import { ShimmerLoader } from "@/components/loading-screen/shimmer-loader";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

type RecentDocumentViewProps = {
  document: DocumentItemType;
};

const fetchRecentDocuments = async (): Promise<DocumentItemType[]> => {
  const res = await axios.get(endpoints.document.recent);
  return res.data;
};

const DEFAULT_THUMBNAILS =
  "https://logandocuments.s3.amazonaws.com/thumbnails/0878c28d-7c9f-4a83-96a1-f73dd6b15a4f-2024-10-09_18:26:51.jpg";

export const RecentDocumentsView = () => {
  const { data: documents, loading } = useFetcher(fetchRecentDocuments, []);
  const { state, isMobile } = useSidebar();
  const windowWidth = useWindowWidth();

  const scrollWidth = React.useMemo(() => {
    if (isMobile) return windowWidth - 96;
    return state === "expanded" ? windowWidth - 352 : windowWidth - 192;
  }, [state, isMobile, windowWidth]);

  const renderRecentDocumentGroup = documents?.map((document, key) => (
    <RecentDocumentView key={key} document={document} />
  ));

  return (
    <div className="flex flex-col items-stretch gap-5">
      <h3 className="m-0 text-lg font-semibold">Recent Documents</h3>
      <ScrollArea
        className={cn(
          "px-7 pt-7 pb-5 rounded-xl bg-white border border-logan-primary-300 transition-all duration-200 ease-linear"
        )}
        style={{ width: `${scrollWidth}px` }}
      >
        <div className="flex items-center gap-7 w-max">
          {loading ? <ShimmerLoader count={10} /> : renderRecentDocumentGroup}
        </div>
        <ScrollBar orientation="horizontal" className="mx-2 mb-1" />
      </ScrollArea>
    </div>
  );
};

const RecentDocumentView = ({ document }: RecentDocumentViewProps) => {
  const router = useRouter();
  const { document_name, project_path, updated_at } = document;
  const thumbnail_url = document?.metadata?.thumbnail_url ?? DEFAULT_THUMBNAILS;

  const formattedUpdateDate = formatDateToCustomFormat(new Date(updated_at));

  const renderBadge = (
    name: string,
    isFirst: boolean,
    isLast: boolean,
    key: number
  ) => {
    if (!isFirst && !isLast)
      return (
        <React.Fragment key={key}>
          <span className="bg-clip-text text-transparent bg-primary-gradient text-[10px] font-semibold">
            /
          </span>
          <span className="bg-clip-text text-transparent bg-primary-gradient text-[10px] font-semibold">
            ...
          </span>
        </React.Fragment>
      );
    return (
      <React.Fragment key={key}>
        {!isFirst && (
          <span className="bg-clip-text text-transparent bg-primary-gradient text-[10px] font-semibold">
            /
          </span>
        )}
        <span className="rounded-full px-2 py-0.5 bg-logan-primary-300  flex items-center gap-1">
          {!isFirst && (
            <Icon
              iconName="gradient-folder"
              fill={{ from: iconColors.from, to: iconColors.to }}
              iconClassName="size-2"
            />
          )}
          <span className="bg-clip-text text-transparent bg-primary-gradient text-[10px] font-semibold">
            {name}
          </span>
        </span>
      </React.Fragment>
    );
  };

  const renderBadgeGroup = (badges: string[]) =>
    badges.map((badge, key) =>
      renderBadge(badge, key === 0, key === badges.length - 1, key)
    );

  return (
    <div
      className="p-4 flex flex-col gap-4 items-stretch rounded-xl bg-logan-primary-200"
      onClick={() => {
        router.push(paths.dashboard.document + `/${document.id}`);
      }}
    >
      <div className="flex flex-col gap-2.5">
        <span className="flex gap-1 items-center flex-row">
          {renderBadgeGroup(project_path)}
        </span>
        <h5 className="m-0 text-xs font-semibold">{document_name}</h5>
      </div>
      <div className="relative h-20 overflow-hidden">
        <img
          src={thumbnail_url}
          className="w-full aspect-auto absolute"
          alt="document_thumbsnails"
        />
      </div>

      <span className="text-logan-black-foreground text-xs font-medium">
        Last modified on {formattedUpdateDate}
      </span>
    </div>
  );
};
