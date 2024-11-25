import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ManagerItemType } from "./type";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Icon } from "../icons";
import { iconColors } from "../../../tailwind.config";
import { formatTimestamp } from "@/lib/date";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import { FolderContextContent } from "./folder-context-content";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

type FolderManagerTableProps = {
  dataSource: ManagerItemType[];
  caption: string;
};

type SortConfig = {
  key: keyof ManagerItemType;
  direction: "asc" | "desc";
};

export const FolderManagerTable = ({
  dataSource,
  caption,
}: FolderManagerTableProps) => {
  const router = useRouter();
  const [data, setData] = useState(dataSource);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Sync `data` with `dataSource` on changes
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const sortData = (key: keyof ManagerItemType) => {
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

  const getSortIndicator = (key: keyof ManagerItemType) =>
    sortConfig?.key === key ? (
      sortConfig.direction === "asc" ? (
        <ArrowUp className="size-4" />
      ) : (
        <ArrowDown className="size-4" />
      )
    ) : null;

  const columns = [
    { label: "Name", key: "title" as keyof ManagerItemType },
    { label: "Last Opened", key: "updated_at" as keyof ManagerItemType },
  ];

  return (
    <div className="flex flex-col items-stretch gap-6">
      <div className="flex gap-5 items-center">
        <h3 className="m-0 text-lg font-semibold capitalize">{caption}</h3>
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
                onClick={() => sortData(key)}
              >
                <div
                  className={cn(
                    "inline-flex items-center gap-2 text-logan-black p-1 px-2 rounded-md transition-all duration-200 text-sm font-bold",
                    { "hover:bg-logan-primary-300": !!key }
                  )}
                >
                  {label} {getSortIndicator(key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="rounded-xl bg-white">
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() =>
                router.push(
                  `${
                    item.type === "document"
                      ? paths.dashboard.document
                      : paths.dashboard.root
                  }/${item.id}`
                )
              }
              className={cn(
                "text-logan-black group hover:bg-logan-primary-300",
                {
                  "[&_td:first-child]:rounded-tl-xl [&_td:last-child]:rounded-tr-xl ":
                    !index,
                },
                {
                  "[&_td:first-child]:rounded-bl-xl [&_td:last-child]:rounded-br-xl":
                    index === data.length - 1,
                }
              )}
            >
              <TableCell className="p-0">
                <TitleCell
                  title={item.title}
                  type={item.type}
                  isHovered={hoveredRow === item.id}
                />
              </TableCell>
              <TableCell className="p-0">
                <DateCell date={item.updated_at} />
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
  type,
  isHovered,
}: {
  title: string;
  type: "document" | "folder";
  isHovered: boolean;
}) => (
  <ContextMenu>
    <ContextMenuTrigger className="flex gap-4 items-center cursor-pointer p-4">
      <Icon
        iconName={type === "folder" ? "folder" : "document"}
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

const DateCell = ({ date }: { date: string | Date }) => {
  const formattedDate =
    typeof date === "string"
      ? formatTimestamp(new Date(date))
      : formatTimestamp(date);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="text-logan-black-foreground text-xs font-medium cursor-pointer p-4 w-full flex">
        {formattedDate}
      </ContextMenuTrigger>
      <FolderContextContent />
    </ContextMenu>
  );
};
