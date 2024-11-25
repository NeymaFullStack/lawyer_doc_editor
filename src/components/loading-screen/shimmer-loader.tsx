import { cn } from "@/lib/utils";

type ShimmerLoaderProps = {
  count: number; // Number of shimmer items
  className?: string; // Custom class for container styling
  shape?: "rectangle" | "circle"; // Shape of the shimmer items
  width?: string;
  height?: string;
};

export const ShimmerLoader = ({
  count,
  className = "",
  shape = "rectangle",
  width = "w-60",
  height = "h-48",
}: ShimmerLoaderProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-xl bg-gradient-to-r from-logan-primary-200 to-logan-primary-300 duration-500 animate-pulse bg-opacity-50",
            shape === "circle" ? "rounded-full" : "rounded-xl",
            width,
            height,
            className
          )}
        />
      ))}
    </>
  );
};
