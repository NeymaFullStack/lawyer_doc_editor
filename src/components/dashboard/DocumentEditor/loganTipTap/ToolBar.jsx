"use client";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Select } from "antd";
import React from "react";

function ToolBar({ editor }) {
  return (
    <div
      className={
        "toolbar flex h-[3rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-2"
      }
    >
      <div className="flex items-center gap-1">
        {/* <button>
          <RemSizeImage
            imagePath={
              true
                ? "/assets/icons/quillicons/highlighter-active.svg"
                : "/assets/icons/quillicons/highlighter.svg"
            }
            remWidth={1.8}
            remHeight={1.8}
            alt="Highlighter"
          />
        </button>
        <button>
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
        /> */}
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
        <div className="tip-fnt-family flex items-center">
          <button>
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/case-change.svg"}
              remWidth={1.1}
              remHeight={1.1}
              alt="Highlighter"
            />
          </button>
          <Select
            className="ml-1 !h-[1rem]"
            suffixIcon={
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/arrow-down.svg"}
                remWidth={1}
                remHeight={1}
                alt="Font Family"
              />
            }
          />
        </div>
        <div className="tip-fnt-size flex items-center">
          <button>
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/line-height.svg"}
              remWidth={1.8}
              remHeight={1.8}
              alt="Dropdown"
            />
          </button>
          <Select
            className="ml-1 !h-[1rem]"
            suffixIcon={
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/arrow-down.svg"}
                remWidth={1}
                remHeight={1}
                alt="Dropdown"
              />
            }
          />
        </div>
        <RemSizeImage
          imagePath={"/assets/icons/quillicons/seprator-icon.svg"}
          remWidth={0.15}
          remHeight={0.1}
          alt="Separator"
        />
        <button
          className={editor?.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/underline.svg"}
            remWidth={1.1}
            remHeight={1.1}
            alt="Underline"
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/italic-icon.svg"}
            remWidth={1.1}
            remHeight={1.1}
            alt="Italic"
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
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
        <div className="tip-fnt-size flex items-center">
          <Select
            className="ml-1 !h-[1rem]"
            suffixIcon={
              <RemSizeImage
                imagePath={"/assets/icons/quillicons/arrow-down.svg"}
                remWidth={1}
                remHeight={1}
                alt="Dropdown"
              />
            }
          />
        </div>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/bullets-icon.svg"}
            remWidth={1.1}
            remHeight={1.1}
            alt="Bullets"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/bullets-icon.svg"}
            remWidth={1.1}
            remHeight={1.1}
            alt="Numbering"
          />
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
