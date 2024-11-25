"use client";
import React, { useState, useMemo } from "react";
import { Icon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useViewContext } from "./context";
import { iconColors } from "../../../tailwind.config";
import { cn } from "@/lib/utils";

type TreeCaptionProps = {
  color: string | { from: string; to: string };
  placeholder: string;
};

export const FileManagerCaption = ({
  color,
  placeholder,
}: TreeCaptionProps) => {
  const { view, setView } = useViewContext();
  const [query, setQuery] = useState<string>("");

  // Determine if the current view is grid
  const isGrid = useMemo(() => view === "grid", [view]);

  // Define switch class based on the provided color
  const switchClass = cn(
    "data-[state=checked]:bg-logan-blue",
    color === iconColors["light-blue"] && "data-[state=checked]:bg-logan-pink"
  );

  // Handle input value changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="mt-4 pr-10 relative flex justify-between items-center">
      <div className="absolute left-5 top-3.5 aspect-square size-4">
        <Search className="size-5 text-logan-black-foreground" />
      </div>
      <Input
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="h-12 w-1/2 rounded-xl pl-14 bg-logan-primary-200"
      />
      <div className="flex gap-5 items-center">
        <div className="flex items-center gap-3 p-2 rounded-md bg-logan-primary-200 border border-logan-primary-300">
          <Icon
            iconName="list"
            fill={isGrid ? iconColors["light-blue"] : color}
          />
          <Switch
            checked={isGrid}
            className={switchClass}
            onCheckedChange={(checked) => setView(checked ? "grid" : "list")}
          />
          <Icon
            iconName="tile"
            fill={!isGrid ? iconColors["light-blue"] : color}
          />
        </div>
        <span className="p-2 rounded-md bg-logan-primary-200 size-10 flex justify-center items-center border border-logan-primary-300">
          <Icon iconName="plus" iconClassName="size-5" fill={iconColors.from} />
        </span>
      </div>
    </div>
  );
};
