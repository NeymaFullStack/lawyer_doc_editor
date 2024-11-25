import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FolderItemType } from "./type";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Icon } from "../icons";
import { iconColors } from "../../../tailwind.config";
import { formatTimestamp } from "@/lib/date";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import { FolderContextContent } from "./folder-context-content";
import { ShimmerTable } from "../loading-screen/shimmer-table";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

type ClientManagerTableProps = {
  dataSource: FolderItemType[];
  caption: string;
  loading: boolean;
};

export const ClientManagerTable = ({
  dataSource,
  caption,
  loading,
}: ClientManagerTableProps) => {
  const router = useRouter();
  const [data, setData] = useState<FolderItemType[]>(dataSource);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FolderItemType;
    direction: "asc" | "desc";
  } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null); // Track hovered row by ID

  // Sync `data` with `dataSource` whenever `dataSource` changes
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const sortData = (key: keyof FolderItemType) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortIndicator = (key: keyof FolderItemType) =>
    sortConfig?.key === key ? (
      sortConfig.direction === "asc" ? (
        <ArrowUp className="size-4" />
      ) : (
        <ArrowDown className="size-4" />
      )
    ) : null;

  const columns = [
    { label: "Name", key: "title" as keyof FolderItemType },
    { label: "Last modified", key: "updated_at" as keyof FolderItemType },
    { label: "Folders", key: null },
  ];

  if (loading) return <ShimmerTable rows={4} cols={3} />;

  return (
    <div className="flex flex-col items-stretch gap-6">
      <div className="flex gap-5 items-center">
        <h3 className="m-0 text-lg font-semibold">{caption}</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none">
            {columns.map(({ label, key }, id) => (
              <TableHead
                key={label}
                className={cn(
                  "cursor-pointer border-none select-none",
                  !id && "p-0"
                )}
                onClick={key ? () => sortData(key) : undefined}
              >
                <div
                  className={cn(
                    "inline-flex items-center gap-2 text-logan-black p-1 px-2 rounded-md transition-all duration-200 text-sm font-bold",
                    { "hover:bg-logan-primary-300": key }
                  )}
                >
                  {label} {key && getSortIndicator(key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="rounded-xl bg-white">
          {data.map((client, index) => (
            <TableRow
              key={client.id}
              onMouseEnter={() => setHoveredRow(client.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() =>
                router.push(paths.dashboard.root + "/" + client.id)
              }
              className={cn(
                "text-logan-black group hover:bg-logan-primary-300 ",
                index === 0 &&
                  "[&_td:first-child]:rounded-tl-xl [&_td:last-child]:rounded-tr-xl",
                index === data.length - 1 &&
                  "[&_td:first-child]:rounded-bl-xl [&_td:last-child]:rounded-br-xl"
              )}
            >
              <TableCell className="p-0">
                <TitleCell
                  title={client.title}
                  isHovered={hoveredRow === client.id}
                />
              </TableCell>
              <TableCell className="p-0">
                <DateCell date={client.updated_at} />
              </TableCell>
              <TableCell className="p-0">
                <FoldersCell folders={client.sub_projects ?? []} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const TitleCell = ({
  title,
  isHovered,
}: {
  title: string;
  isHovered: boolean;
}) => (
  <ContextMenu>
    <ContextMenuTrigger className="flex gap-4 items-center cursor-pointer p-4">
      <Icon
        iconName="client"
        fill={isHovered ? iconColors.from : iconColors.gray}
        iconClassName="size-5"
      />
      <span className="text-sm font-bold group-hover:text-logan-blue">
        {title}
      </span>
    </ContextMenuTrigger>
    <FolderContextContent />
  </ContextMenu>
);

const DateCell = ({ date }: { date: Date }) => (
  <ContextMenu>
    <ContextMenuTrigger className="text-logan-black-foreground text-xs font-medium cursor-pointer p-4 w-full flex">
      {formatTimestamp(date)}
    </ContextMenuTrigger>
    <FolderContextContent />
  </ContextMenu>
);

const FoldersCell = ({ folders }: { folders: FolderItemType[] }) => {
  const normalizeFolders = folders.slice(0, 4).map((folder) => folder.title);
  const additionalCount = folders.length > 4 ? folders.length - 4 : null;

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex gap-2.5 items-center cursor-pointer p-4">
        {normalizeFolders.map((folder, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-logan-primary-300 px-2 py-1 flex items-center gap-1"
          >
            <span className="bg-clip-text text-transparent bg-primary-gradient text-xs font-medium">
              {folder}
            </span>
          </div>
        ))}
        {additionalCount && (
          <div className="rounded-lg bg-logan-primary-300 px-2 py-1 flex items-center gap-1">
            <span className="bg-clip-text text-transparent bg-primary-gradient text-xs font-medium">
              {additionalCount}+
            </span>
          </div>
        )}
      </ContextMenuTrigger>
      <FolderContextContent />
    </ContextMenu>
  );
};
