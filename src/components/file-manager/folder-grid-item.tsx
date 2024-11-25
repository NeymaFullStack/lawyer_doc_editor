import { iconColors } from "../../../tailwind.config";
import { Icon } from "../icons";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import { useHover } from "@/hooks/use-hover";
import { cn } from "@/lib/utils";
import { FolderContextContent } from "./folder-context-content";
import { useRouter } from "next/navigation";

type FolderGridItemProps = {
  title: string;
  level: "client" | "folder";
  href: string;
};

export const FolderGridItem = ({ title, level, href }: FolderGridItemProps) => {
  const iconName = level === "client" ? "client" : "folder";
  const router = useRouter();

  const { hover, handleMouseOut, handleMouseOver } = useHover();

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="bg-white rounded-xl text-logan-black min-w-48 flex items-center py-4 px-5 gap-4 border border-logan-primary-300 hover:bg-logan-primary-300 transition-all duration-200 ease-linear"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={() => router.push(href)}
      >
        <Icon
          iconName={iconName}
          fill={hover ? iconColors.from : iconColors.gray}
          iconClassName="size-7"
        />
        <div
          className={cn("text-sm font-semibold truncate select-none", {
            "text-logan-blue": hover,
          })}
        >
          {title}
        </div>
      </ContextMenuTrigger>
      <FolderContextContent />
    </ContextMenu>
  );
};
