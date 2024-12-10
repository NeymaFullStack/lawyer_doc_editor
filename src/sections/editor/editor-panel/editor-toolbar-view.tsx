import React, { useState, useEffect, useCallback } from "react";
import { EditorUploadModal } from "./components/editor-upload-modal";
import { ToolBar_ITEMS } from "./config-toobar";
import { EditorColorPicker } from "./components/editor-color-picker";
import { iconColors } from "../../../../tailwind.config";
import { Editor } from "@tiptap/core";
import { EditorSearchAndReplace } from "./components/editor-search";
import { Label } from "@/components/ui/label";
import { useTabContext } from "../editor-tab-group/use-tab-context";
import { ToolBarDropDown } from "./components/editor-toolbar-dropdown";
import { ToolBarItem } from "./components/editor-toolbar-item";
import { EditorHyperLink } from "./components/editor-hyper-link";
import isTextSelected from "./utils/utils";
import { useDropdown } from "@/components/hook-form/dropdown-provider";
import { EditorComment } from "./components/editor-comment";

type EditorToolbarProps = {
  editor: Editor | null;
};

interface ActiveStates {
  [key: string]: boolean;
}

export const EditorToolbarView = ({ editor }: EditorToolbarProps) => {
  const { showPreview } = useTabContext();
  const { isSearch, isComment, setIsComment } = useDropdown();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isImage, setIsImage] = useState<boolean>(false);
  const canUndo = editor?.can().undo();
  const canRedo = editor?.can().redo();
  const [selectedColor, setSelectedColor] = useState(iconColors.gray);
  const [selectedHighlight, setSelectedHighlight] = useState(iconColors.white);

  const [activeStates, setActiveStates] = useState<ActiveStates>({
    search: false,
    commentplus: false,
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    color: false,
    highlight: false,
    hyperlink: false,
    bullets: false,
    ordered: false,
    image: false,
  });

  const onLink = useCallback(() => {
    if (!editor || !isTextSelected(editor)) return;

    editor.chain().focus().toggleLink({ href: "" }).run();
  }, [editor]);

  const editorActions = (editor: Editor | null) => ({
    search: () => console.log("Search clicked"),
    chatai: () => console.log("Chat AI clicked"),
    commentplus: () => {},
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
    image: () => setIsImage(true),
    hyperlink: () => onLink(),
  });

  useEffect(() => {
    if (editor) {
      setActiveStates({
        search: isSearch,
        commentplus: isComment,
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        color: editor.isActive("textStyle", { color: selectedColor }),
        highlight: editor.isActive("highlight", { color: selectedHighlight }),
        hyperlink: editor.isActive("link"),
        bullets: editor.isActive("bulletList"),
        ordered: editor.isActive("orderedList"),
        image: isImage,
      });
    }
  }, [editor?.state, isSearch, isComment, isImage]);

  const actions = editor ? editorActions(editor) : {};

  const handleSetZoom = (zoomLevel: number) => {
    editor?.commands.setZoom(zoomLevel);
    setZoomLevel(zoomLevel);
  };

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
                    disabled={showPreview}
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
                dropdownId={item.label}
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
                  showPreview
                    ? true
                    : item.label === "previous"
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
        <div className="flex flex-1 items-center justify-end gap-1">
          <ToolBarItem
            iconName="minus"
            isBlack={true}
            onClick={() => handleSetZoom(zoomLevel - 0.25)}
            disabled={showPreview}
          />
          <Label
            id="zoomLevel"
            className="w-14 h-7 bg-white text-smaller p-2 rounded-md text-center"
          >
            {zoomLevel * 100}%
          </Label>

          <ToolBarItem
            iconName="plus"
            isBlack={true}
            onClick={() => handleSetZoom(zoomLevel + 0.25)}
            disabled={showPreview}
          />
        </div>
      </div>
      <EditorComment editor={editor} />
      <EditorHyperLink editor={editor} />
      <EditorUploadModal open={isImage} setOpen={setIsImage} editor={editor} />
    </div>
  );
};

export const Divider = () => (
  <span className="border-r border-logan-primary-400 h-6"></span>
);
