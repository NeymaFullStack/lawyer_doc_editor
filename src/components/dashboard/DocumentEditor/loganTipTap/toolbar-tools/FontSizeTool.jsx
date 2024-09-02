import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
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
      ? setSelectedSize(editor.getAttributes("textStyle")?.fontSize)
      : setSelectedSize("10");
  }, [editor?.state?.selection]);

  const fontSizes = Array.from({ length: 18 }, (_, i) =>
    (10 + i * 2).toString(),
  );

  const handleSelect = (value) => {
    if (editor) {
      editor?.chain().focus().setFontSize(value).run();
      setSelectedSize(value);
    }
  };

  return (
    <Select onValueChange={handleSelect} value={selectedSize}>
      <SelectTrigger
        onClick={(e) => {
          e.stopPropagation();
          debugger;
        }}
        className=" ml-1 !h-[1.5rem] w-[3.5rem] rounded-md p-2 focus:ring-0"
        dropDownicon={
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/arrow-down.svg"}
            remWidth={1}
            remHeight={1}
            alt="Dropdown"
            className={"-mr-[5px]"}
          />
        }
      >
        <SelectValue placeholder="10pt" />
      </SelectTrigger>
      <SelectContent className="max-h-60 w-fit min-w-fit">
        {fontSizes.map((size) => (
          <SelectItem
            className="w-[3rem] cursor-pointer"
            key={size}
            value={size}
          >
            {size}pt
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  function getCurrentFontSize(currentSelectedFontSize) {
    for (const size of FONT_SIZES) {
      if (currentSelectedFontSize == size) {
        return size;
      }
    }
  }
};

export default FontSizeTool;
