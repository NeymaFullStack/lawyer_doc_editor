import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RemSizeImage from "@/components/generic/RemSizeImage";

const FONT_FAMILY_OPTIONS = [
  { label: "Inter", value: "inter" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Times New Roman", value: "Times" },
  { label: "Garamond", value: "Garamond" },
  { label: "Georgia", value: "Georgia" },
  { label: "Courier", value: "Courier" },
  { label: "Courier New", value: "Courier New" },
];

const FontFamily = ({ editor }) => {
  const [selectedFontFamily, setSelectedFontFamily] = useState("inter");

  useEffect(() => {
    editor.getAttributes("textStyle")?.fontFamily
      ? setSelectedFontFamily(editor.getAttributes("textStyle")?.fontFamily)
      : setSelectedFontFamily("inter");
  }, [editor?.state?.selection]);

  const handleSelect = (value) => {
    editor.chain().focus().setFontFamily(value).run();
    setSelectedFontFamily(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* The trigger button shows the currently selected alignment */}
        <Button
          variant="outline"
          className="ml-1  !h-[1.5rem] w-[5.5rem]  rounded-md p-2 hover:bg-white focus:ring-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="w-[80%] truncate text-left">
            {selectedFontFamily.charAt(0).toUpperCase() +
              selectedFontFamily.slice(1)}
          </span>

          <RemSizeImage
            imagePath={"/assets/icons/quillicons/arrow-down.svg"}
            remWidth={1}
            remHeight={1}
            alt="Dropdown"
            className={"ml-auto max-w-full flex-1"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="no-scrollbar ml-[3.8rem] max-h-60 w-fit min-w-fit overflow-y-scroll p-2">
        {/* List of alignment options as buttons */}
        <div className="flex flex-col space-y-1">
          {FONT_FAMILY_OPTIONS.map((fontFamily) => (
            <Button
              key={fontFamily?.value}
              variant={
                selectedFontFamily === fontFamily.value ? "secondary" : "ghost"
              }
              className="![&>span]:w-[3.5rem] ![&>span]:truncate  !h-[1.5rem] py-1 text-left"
              onClick={(e) => {
                handleSelect(fontFamily.value);
                e.stopPropagation();
              }}
            >
              {fontFamily?.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontFamily;
