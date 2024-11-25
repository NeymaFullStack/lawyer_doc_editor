import { ArrowDown, ArrowUp } from "lucide-react";
import { DocumentItemType } from "./type";
import { useEffect, useState, useMemo } from "react";
import { DocumentGridItem } from "./document-grid-item";

type DocumentManagerGridProps = {
  dataSource: DocumentItemType[];
  caption: string;
};

export const DocumentGridManager = ({
  dataSource,
  caption,
}: DocumentManagerGridProps) => {
  const [data, setData] = useState<DocumentItemType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DocumentItemType;
    direction: "asc" | "desc";
  }>({ key: "document_name", direction: "asc" });

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
  const handleSort = (key: keyof DocumentItemType) => {
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
  const getSortIndicator = (key: keyof DocumentItemType) => {
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
        onSort={() => handleSort("document_name")}
        sortIndicator={getSortIndicator("document_name")}
      />

      {/* Grid of Folder Items */}
      <Grid items={sortedData} />
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
const Grid = ({ items }: { items: DocumentItemType[] }) => (
  <div className="grid gap-9 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
    {items.map((item) => (
      <DocumentGridItem key={item.id} document={item} />
    ))}
  </div>
);
