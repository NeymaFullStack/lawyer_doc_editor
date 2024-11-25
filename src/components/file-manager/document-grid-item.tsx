import React from "react";
import { formatDateToCustomFormat } from "@/lib/date";
import { DocumentItemType } from "./type";
import { iconColors } from "../../../tailwind.config";
import { Icon } from "../icons";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

type DocumentGridItemProps = {
  document: DocumentItemType;
};

const DEFAULT_THUMBNAILS =
  "https://logandocuments.s3.amazonaws.com/thumbnails/0878c28d-7c9f-4a83-96a1-f73dd6b15a4f-2024-10-09_18:26:51.jpg";

export const DocumentGridItem = ({ document }: DocumentGridItemProps) => {
  const router = useRouter();
  const { document_name, project_path, updated_at } = document;

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
      className="p-4 flex flex-col gap-4 items-stretch rounded-xl bg-white border border-transparent hover:border-logan-blue hover:bg-logan-primary-300 transition-all duration-200 ease-linear"
      onClick={() => {
        router.push(`${paths.dashboard.document}/${document.id}`);
      }}
    >
      <div className="flex flex-col gap-2.5">
        <span className="flex gap-1 items-center flex-row">
          {renderBadgeGroup(project_path)}
        </span>
        <h5 className="m-0 text-xs font-semibold">{document_name}</h5>
      </div>
      <div className="relative aspect-video overflow-hidden border border-logan-primary-200">
        <img
          src={DEFAULT_THUMBNAILS}
          className="h-full aspect-auto absolute"
          alt="document_thumbsnails"
        />
      </div>

      <span className="text-logan-black-foreground text-xs font-medium">
        Last modified on {formattedUpdateDate}
      </span>
    </div>
  );
};
