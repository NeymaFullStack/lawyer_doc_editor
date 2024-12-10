import { useTabContext } from "./use-tab-context";
import { ChevronsLeft } from "lucide-react";
import { iconColors } from "../../../../tailwind.config";
import { cn } from "@/lib/utils";
import { TAB_ITEMS } from "./config-tab";
import { Icon, icons } from "@/components/icons";
import { useHover } from "@/hooks/use-hover";
import { useMemo } from "react";

export const EditorTabGroupView = () => {
  const {
    isOpen,
    setOpen,
    selected,
    setSelected,
    showPreview,
    setShowPreview,
  } = useTabContext();

  const handleTabClick = (label: string) => {
    const isPreview = label === "Preview";
    const togglingPreview = isPreview && showPreview;
    setSelected(label);
    setShowPreview(isPreview ? !togglingPreview : false);
    setOpen(isOpen && label === selected ? !isOpen : true);
  };

  const handleArrowClick = () => {
    setOpen(!isOpen);
    if (showPreview) setShowPreview(false);
    if (!isOpen && selected === "Preview") setShowPreview(true);
  };

  const tabItems = useMemo(
    () =>
      TAB_ITEMS.map((item) => (
        <TabItem
          key={item.label}
          iconName={item.icon}
          isSelected={selected === item.label}
          onClick={() => handleTabClick(item.label)}
        />
      )),
    [TAB_ITEMS, selected, handleTabClick]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Collapse/Expand Button */}
      <div
        className="size-10 inline-flex justify-center items-center cursor-pointer"
        onClick={handleArrowClick}
      >
        <ChevronsLeft
          className={cn("size-6 transition-transform", isOpen && "rotate-180")}
          color={iconColors.from}
        />
      </div>

      {/* Tab Items */}
      <div className="flex flex-col gap-4">{tabItems}</div>
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
  const backgroundClass = isSelected
    ? "bg-primary-gradient"
    : "bg-logan-primary-200 hover:bg-primary-gradient";

  return (
    <span
      className={cn(
        "size-10 rounded-xl cursor-pointer transition-colors",
        backgroundClass
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    >
      <Icon
        iconName={iconName}
        className="size-10"
        fill={hover || isSelected ? iconColors.white : iconColors.from}
      />
    </span>
  );
};
