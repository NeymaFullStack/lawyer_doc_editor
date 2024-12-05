import React, { useState, useEffect } from "react";
import { EditorUploadModal } from "./editor-upload-modal";
import { ToolBar_ITEMS } from "./config-toobar";
import { EditorColorPicker } from "./editor-color-picker";
import { Icon, icons } from "@/components/icons";
import { useHover } from "@/hooks/use-hover";
import { iconColors } from "../../../../tailwind.config";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { EditorSearchAndReplace } from "./editor-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdown } from "@/components/hook-form/dropdown-provider";

type EditorToolbarProps = {
  editor: Editor | null;
};

interface ActiveStates {
  [key: string]: boolean;
}

export const EditorToolbarView = ({ editor }: EditorToolbarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const canUndo = editor?.can().undo();
  const canRedo = editor?.can().redo();
  const [selectedColor, setSelectedColor] = useState(iconColors.gray);
  const [selectedHighlight, setSelectedHighlight] = useState(iconColors.white);

  const [activeStates, setActiveStates] = useState<ActiveStates>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    color: false,
    highlight: false,
    bullets: false,
    ordered: false,
  });

  const editorActions = (editor: Editor | null) => ({
    search: () => console.log("Search clicked"),
    chatai: () => console.log("Chat AI clicked"),
    commentplus: () => console.log("Comment Plus clicked"),
    previous: () => editor?.commands?.undo(),
    next: () => editor?.commands?.redo(),
    bold: () => editor?.commands?.toggleBold(),
    italic: () => editor?.commands?.toggleItalic(),
    underline: () => editor?.commands?.toggleUnderline(),
    color: (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setSelectedColor(color);
    },
    highlight: (hightlight: string) => {
      editor?.commands?.toggleHighlight({ color: hightlight });
      setSelectedHighlight(hightlight);
    },
    bullets: () => editor?.commands?.toggleBulletList(),
    ordered: () => editor?.commands?.toggleOrderedList(),
    footnotes: () => console.log("Footnotes clicked"),
    image: () => setOpen(true),
  });

  useEffect(() => {
    if (editor) {
      setActiveStates({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        color: editor.isActive("textStyle", { color: selectedColor }),
        highlight: editor.isActive("highlight", { color: selectedHighlight }),
        bullets: editor.isActive("bulletList"),
        ordered: editor.isActive("orderedList"),
      });
    }
  }, [editor?.state]);

  const actions = editor ? editorActions(editor) : {};

  return (
    <div className="h-11 px-5 py-2">
      <div className="flex items-center gap-[10px]">
        {ToolBar_ITEMS.map((item: any, index: number) => (
          <React.Fragment key={index}>
            {item.dropdown ? (
              <ToolBarDropDown
                button={
                  <ToolBarItem
                    iconName={item.icon}
                    isSelected={
                      activeStates[item.label as keyof typeof activeStates]
                    }
                    customColor={
                      item.label === "color" ? selectedColor : selectedHighlight
                    }
                    isBlack={index > 4 && true}
                    disabled={false}
                  />
                }
                content={
                  item.label === "search" ? (
                    <EditorSearchAndReplace editor={editor} />
                  ) : (
                    <EditorColorPicker
                      onChange={actions[item.label as keyof typeof actions]}
                    />
                  )
                }
              />
            ) : (
              <ToolBarItem
                iconName={item.icon}
                isSelected={
                  activeStates[item.label as keyof typeof activeStates]
                }
                onClick={actions[item.label as keyof typeof actions]}
                isBlack={index > 4 && true}
                disabled={
                  item.label === "previous"
                    ? !canUndo
                    : item.label === "next"
                    ? !canRedo
                    : false
                }
              />
            )}
            {item.divider && <Divider key={`divider-${index}`} />}
          </React.Fragment>
        ))}
      </div>
      <EditorUploadModal open={open} setOpen={setOpen} editor={editor} />
    </div>
  );
};

export const Divider = () => (
  <span className="border-r border-logan-primary-400 h-6"></span>
);

type ToolBarItemProps = {
  iconName: keyof typeof icons;
  dropdownIcon?: boolean;
  isSelected: boolean;
  isBlack?: boolean;
  customColor?: string;
  onClick?: () => void;
  disabled: boolean;
};

const ToolBarItem = React.forwardRef<HTMLSpanElement, ToolBarItemProps>(
  (
    {
      iconName,
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
      dropdownIcon ? "w-11" : "w-7"
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

type ToolBarDropDownProps = {
  button: React.ReactNode;
  content: React.ReactNode;
};

const ToolBarDropDown = ({ button, content }: ToolBarDropDownProps) => {
  const { setOpen } = useDropdown();

  return (
    <DropdownMenu onOpenChange={(open) => setOpen(open)}>
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
