import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RemSizeImage from "@/components/generic/RemSizeImage";

const FONT_SIZES = [
  "10pt",
  "12pt",
  "14pt",
  "16pt",
  "18pt",
  "20pt",
  "22pt",
  "24pt",
  "26pt",
  "28pt",
  "30pt",
  "32pt",
  "34pt",
  "36pt",
  "38pt",
  "40pt",
  "42pt",
  "44pt",
];

const FontSizeTool = ({ editor }) => {
  const [selectedSize, setSelectedSize] = useState("10");
  useEffect(() => {
    editor.getAttributes("textStyle")?.fontSize
      ? setSelectedSize(
          editor.getAttributes("textStyle")?.fontSize.replace("pt", ""),
        )
      : setSelectedSize("10");
  }, [editor?.state?.selection]);

  const fontSizes = Array.from({ length: 18 }, (_, i) =>
    (10 + i * 2).toString(),
  );

  const handleSelect = (value) => {
    editor?.chain().focus().setFontSize(value).run();
    setSelectedSize(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* The trigger button shows the currently selected alignment */}
        <Button
          variant="outline"
          className="ml-1  !h-[1.5rem] w-[4rem]  rounded-md p-2 hover:bg-white focus:ring-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span>{selectedSize}pt</span>
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/arrow-down.svg"}
            remWidth={1}
            remHeight={1}
            alt="Dropdown"
            className={"ml-auto"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="no-scrollbar  max-h-60  w-fit overflow-y-scroll p-2">
        {/* List of alignment options as buttons */}
        <div className="flex flex-col space-y-1">
          {fontSizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "secondary" : "ghost"}
              className="!h-[1.5rem] w-[3rem]  py-1 text-left"
              onClick={(e) => {
                handleSelect(size);
                e.stopPropagation();
              }}
            >
              {size}pt
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FontSizeTool;
