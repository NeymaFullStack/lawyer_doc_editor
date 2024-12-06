import React from "react";
import { Icon, icons } from "@/components/icons";
import { useHover } from "@/hooks/use-hover";
import { cn } from "@/lib/utils";
import { iconColors } from "../../../../../tailwind.config";

type ToolBarItemProps = {
  iconName: keyof typeof icons;
  className?: string;
  dropdownIcon?: boolean;
  isSelected?: boolean;
  isBlack?: boolean;
  customColor?: string;
  onClick?: () => void;
  disabled: boolean;
};

export const ToolBarItem = React.forwardRef<HTMLSpanElement, ToolBarItemProps>(
  (
    {
      iconName,
      className,
      dropdownIcon,
      isSelected,
      isBlack,
      onClick,
      disabled,
      customColor,
    },
    ref
  ) => {
    const { hover, handleMouseOut, handleMouseOver } = useHover();

    const iconFill = isBlack
      ? hover || isSelected
        ? iconColors.white
        : iconColors.gray
      : hover || isSelected
      ? iconColors.white
      : iconColors.from;

    const spanClasses = cn(
      `h-7 bg-logan-primary-200 rounded-md cursor-pointer transition-colors flex items-center justify-center gap-2`,
      isBlack ? "hover:bg-logan-black" : "hover:bg-primary-gradient",
      isSelected && (isBlack ? "bg-logan-black" : "bg-primary-gradient"),
      disabled && "cursor-not-allowed opacity-50",
      dropdownIcon ? "w-11" : "w-7",
      className
    );

    return (
      <span
        ref={ref}
        className={spanClasses}
        onMouseOver={!disabled ? handleMouseOver : undefined}
        onMouseOut={handleMouseOut}
        onClick={!disabled ? onClick : undefined}
      >
        <Icon iconName={iconName} fill={iconFill} customColor={customColor} />
        {dropdownIcon && <Icon iconName="dropdownicon" fill={iconFill} />}
      </span>
    );
  }
);

ToolBarItem.displayName = "ToolBarItem";
