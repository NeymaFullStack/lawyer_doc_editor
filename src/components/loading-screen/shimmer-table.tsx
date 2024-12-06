import React from "react";
import { cn } from "@/lib/utils"; // Utility function for class names

type ShimmerTableProps = {
  cols: number; // Number of columns
  rows: number; // Number of rows
  className?: string; // Custom class for styling
};

export const ShimmerTable: React.FC<ShimmerTableProps> = ({
  cols,
  rows,
  className = "",
}) => {
  return (
    <div className={cn("w-full rounded-lg", className)}>
      {/* Table Body */}
      <div className="divide-y divide-logan-primary-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-${cols} w-full animate-pulse gap-4 px-4 py-2`}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 w-full rounded bg-logan-primary-300"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
