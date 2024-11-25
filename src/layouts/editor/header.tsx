import { ShimmerLoader } from "@/components/loading-screen/shimmer-loader";
import { useDocumentContext } from "../document";
import { formatTimestamp } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { iconColors } from "../../../tailwind.config";

export const Header = () => {
  const { document } = useDocumentContext();
  if (!document) return <ShimmerHeader />;

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-lg font-bold p-0 m-0 capitalize">
        {document.document_name}
      </h1>
      <div className="flex gap-5 items-center">
        <span className="text-xs text-logan-black-foreground font-medium">
          Last version saved at{" "}
          {formatTimestamp(document.current_version.created_at)}
        </span>
        <div className="flex items-stretch gap-4">
          <Button className="!bg-primary-gradient opacity-90 hover:opacity-100 inline-flex gap-3 items-center rounded-xl">
            <Icon iconName="save" fill={iconColors.white}></Icon>
            <span className="text-white text-sm font-bold">Save</span>
          </Button>
          <Button className="!bg-logan-primary-200 opacity-90 hover:opacity-100 inline-flex gap-3 items-center rounded-xl">
            <Icon iconName="export" fill={iconColors.from}></Icon>
            <span className="text-logan-blue text-sm font-bold">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

const ShimmerHeader = () => {
  return (
    <header className="flex justify-between mr-8 items-center">
      {/* Placeholder for document name */}
      <div className="w-40 h-10 rounded-lg bg-gradient-to-r from-logan-primary-200 to-logan-primary-300 duration-500 animate-pulse" />

      <div className="flex gap-5 items-center">
        {/* Placeholder for last version saved at text */}
        <div className="w-64 h-10 rounded-lg bg-gradient-to-r from-logan-primary-200 to-logan-primary-300 duration-500 animate-pulse" />

        {/* Placeholder for buttons */}
        <div className="flex items-stretch gap-4">
          <ShimmerLoader count={2} width="w-28" height="h-10" />
        </div>
      </div>
    </header>
  );
};
