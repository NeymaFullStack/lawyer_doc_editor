import { useTabContext } from "./use-tab-context";
import { ChevronsLeft } from "lucide-react";
import { iconColors } from "../../../../tailwind.config";
import { cn } from "@/lib/utils";
import { TAB_ITEMS } from "./config-tab";
import { Icon, icons } from "@/components/icons";
import { useHover } from "@/hooks/use-hover";

export const EditorTabGroupView = () => {
  const { isOpen, setOpen, selected, setSelected } = useTabContext();

  const handleTabClick = (label: string) => {
    setSelected(label);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Collapse/Expand Button */}
      <div
        className="size-10 inline-flex justify-center items-center cursor-pointer"
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        <ChevronsLeft
          className={cn("size-6 transition-transform", isOpen && "rotate-180")}
          color={iconColors.from}
        />
      </div>

      {/* Tab Items */}
      <div className="flex flex-col gap-4">
        {TAB_ITEMS.map((item) => (
          <TabItem
            key={item.label}
            iconName={item.icon}
            isSelected={selected === item.label}
            onClick={() => handleTabClick(item.label)}
          />
        ))}
      </div>
    </div>
  );
};

type TabItemProps = {
  iconName: keyof typeof icons;
  isSelected: boolean;
  onClick: () => void;
};

const TabItem = ({ iconName, isSelected, onClick }: TabItemProps) => {
  const { hover, handleMouseOut, handleMouseOver } = useHover();

  return (
    <span
      className={cn(
        "size-10 bg-logan-primary-200 hover:bg-primary-gradient rounded-xl cursor-pointer transition-colors",
        { "bg-primary-gradient": isSelected }
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    >
      <Icon
        iconName={iconName}
        fill={hover || isSelected ? iconColors.white : iconColors.from}
      />
    </span>
  );
};
