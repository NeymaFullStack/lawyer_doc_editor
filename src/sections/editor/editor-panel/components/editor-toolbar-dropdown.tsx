import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdown } from "@/components/hook-form/dropdown-provider";

type ToolBarDropDownProps = {
  button: React.ReactNode;
  content: React.ReactNode;
  dropdownId: string;
};

export const ToolBarDropDown = ({
  button,
  content,
  dropdownId,
}: ToolBarDropDownProps) => {
  const { open, setOpen } = useDropdown();

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        setOpen(!open);
      }
    };

    window.addEventListener("keydown", handleHotkey);
    return () => {
      window.removeEventListener("keydown", handleHotkey);
    };
  }, [open, setOpen]);

  return (
    <DropdownMenu
      open={dropdownId === "search" ? open : undefined}
      onOpenChange={(open) => {
        dropdownId === "search" && setOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <span className="p-0 h-7 bg-transparent">{button}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="p-2 mt-1 grid gap-2 text-logan-black-foreground font-semibold rounded-xl dropDownContent"
        align="start"
      >
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ToolBarDropDown.displayName = "ToolBarDropDown";
