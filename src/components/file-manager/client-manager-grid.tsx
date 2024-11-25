import { ArrowDown, ArrowUp } from "lucide-react";
import { FolderGridItem } from "./folder-grid-item";
import { FolderItemType } from "./type";
import { useEffect, useState, useMemo } from "react";
import { paths } from "@/routes/path";
import { ShimmerLoader } from "../loading-screen/shimmer-loader";

type ClientGridManagerProps = {
  dataSource: FolderItemType[];
  caption: string;
  loading: boolean;
};

export const ClientGridManager = ({
  dataSource,
  caption,
  loading,
}: ClientGridManagerProps) => {
  const [data, setData] = useState<FolderItemType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FolderItemType;
    direction: "asc" | "desc";
  }>({ key: "title", direction: "asc" });

  // Sort Data Function
  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";
      return direction === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue > bValue
        ? -1
        : 1;
    });
  }, [data, sortConfig]);

  // Handle Sort Updates
  const handleSort = (key: keyof FolderItemType) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Set initial data from dataSource
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  // Get Sort Indicator
  const getSortIndicator = (key: keyof FolderItemType) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="size-4" />
    ) : (
      <ArrowDown className="size-4" />
    );
  };

  return (
    <div className="flex flex-col items-stretch gap-6">
      {/* Header with Caption and Sort Controls */}
      <Header
        caption={caption}
        onSort={() => handleSort("title")}
        sortIndicator={getSortIndicator("title")}
      />

      {/* Grid of Folder Items */}
      <Grid items={sortedData} loading={loading} />
    </div>
  );
};

// Header Component
const Header = ({
  caption,
  onSort,
  sortIndicator,
}: {
  caption: string;
  onSort: () => void;
  sortIndicator: JSX.Element | null;
}) => (
  <div className="flex gap-5 items-center">
    <h3 className="m-0 text-lg font-semibold">{caption}</h3>
    <span
      className="py-1 px-2 flex gap-0.5 items-center cursor-pointer select-none bg-logan-primary-300 rounded-lg"
      onClick={onSort}
    >
      <span className="text-xs">Name</span>
      {sortIndicator}
    </span>
  </div>
);

// Grid Component
const Grid = ({
  items,
  loading,
}: {
  items: FolderItemType[];
  loading: boolean;
}) => (
  <div className="grid gap-x-9 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {loading ? (
      <ShimmerLoader
        count={20}
        className="from-white to-logan-primary-300"
        height="h-14"
        width="w-auto"
      />
    ) : (
      items.map((item) => {
        const href = paths.dashboard.root + "/" + item.id;
        return (
          <FolderGridItem
            key={item.id}
            title={item.title ?? ""}
            level="client"
            href={href}
          />
        );
      })
    )}
  </div>
);
