"use client";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { cn } from "@/utils/shadcn-utils";
import React, { useEffect, useRef, useState } from "react";
import FontSizeTool from "./toolbar-tools/FontSizeTool";
import Alignment from "./toolbar-tools/Alignment";
import FontFamily from "./toolbar-tools/FontFamily";
import Highlighter from "./toolbar-tools/Highlighter";
import Zoom from "./toolbar-tools/Zoom";

function ToolBar({ editor }) {
  const toolbarRef = useRef(null);
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const handleEditorBlur = (event) => {
      // Check if the blur event was triggered by a click on a toolbar button
      event.preventDefault(); // Prevent losing focus
      if (
        (toolbar &&
          (toolbar === event.target || toolbar.contains(event.target))) ||
        event.target === editor.view.dom ||
        editor.view.dom.contains(event.target)
      ) {
        // editor.chain().focus().run(); // Re-focus the editor
      } else {
        // editor.chain().blur().run();
      }
    };

    window?.addEventListener("click", handleEditorBlur);

    return () => {
      window?.removeEventListener("click", handleEditorBlur);
    };
  }, [editor]);
  return (
    <div
      className={
        "toolbar flex h-[3rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-2"
      }
      ref={toolbarRef}
    >
      {editor && (
        <>
          <div className="flex items-center gap-1">
            {
              <Highlighter /> /*<button>
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/comment.svg"}
            remWidth={1.8}
            remHeight={1.8}
            alt="Comment"
          />
        </button>
        <button>
          <RemSizeImage
            imagePath={"/assets/icons/search-blue.svg"}
            remWidth={1.8}
            remHeight={1.8}
            alt="Search"
          />
        </button>
        <RemSizeImage
          imagePath={"/assets/icons/quillicons/seprator-icon.svg"}
          remWidth={0.15}
          remHeight={0.1}
          alt="Separator"
        /> */
            }
            <button onClick={() => editor.commands.undo()}>
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/undo-icon.svg"}
                remWidth={1.8}
                remHeight={1.8}
                alt="Undo"
              />
            </button>
            <button onClick={() => editor.commands.redo()}>
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/redo-icon.svg"}
                remWidth={1.8}
                remHeight={1.8}
                alt="Redo"
              />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {true && (
              <div className={cn("flex items-center gap-2")}>
                <div className="tip-fnt-family flex items-center">
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/case-change.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Highlighter"
                  />

                  <FontFamily editor={editor} />
                </div>
                <div className="tip-fnt-size flex items-center">
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/line-height.svg"}
                    remWidth={1.2}
                    remHeight={1.2}
                    alt="Dropdown"
                  />
                  <FontSizeTool editor={editor} />
                </div>
                <RemSizeImage
                  imagePath={"/assets/icons/quillicons/seprator-icon.svg"}
                  remWidth={0.15}
                  remHeight={0.1}
                  alt="Separator"
                />
                <button
                  className={cn(
                    "p-[0.1rem]",
                    editor?.isActive("underline") &&
                      "rounded-md bg-secondary-blue",
                  )}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/underline.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Underline"
                  />
                </button>
                <button
                  className={cn(
                    "p-[0.1rem]",
                    editor?.isActive("italic") &&
                      "rounded-md bg-secondary-blue",
                  )}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/italic-icon.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Italic"
                  />
                </button>
                <button
                  className={cn(
                    "p-[0.1rem]",
                    editor?.isActive("bold") && "rounded-md bg-secondary-blue",
                  )}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/bold-icon.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Bold"
                  />
                </button>
                <RemSizeImage
                  imagePath={"/assets/icons/quillicons/seprator-icon.svg"}
                  remWidth={0.15}
                  remHeight={0.1}
                  alt="Separator"
                />
                <div className="flex items-center">
                  <Alignment editor={editor} />
                </div>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/bullets-icon.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Bullets"
                  />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/quillicons/numbering-list.svg"}
                    remWidth={1.1}
                    remHeight={1.1}
                    alt="Numbering"
                  />
                </button>
              </div>
            )}
            <Zoom />
          </div>
        </>
      )}
    </div>
  );
}

export default ToolBar;
