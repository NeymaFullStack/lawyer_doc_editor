import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
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
    console.log("value", value);
    if (editor) {
      editor.chain().focus().setFontFamily(value).run();
      setSelectedFontFamily(value);
    }
  };

  console.log("ediotr", selectedFontFamily);

  return (
    <Select onValueChange={handleSelect} value={selectedFontFamily}>
      <SelectTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" ml-1 !h-[1.5rem] w-[5.5rem] rounded-md p-2 focus:ring-0 [&>span]:truncate"
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
        <SelectValue placeholder="left" />
      </SelectTrigger>
      <SelectContent className="max-h-60 w-fit min-w-[5rem] ">
        {FONT_FAMILY_OPTIONS.map((fontFamily) => (
          <SelectItem
            className="cursor-pointer justify-start"
            key={fontFamily?.value}
            value={fontFamily?.value}
          >
            {fontFamily?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  function getCurrentSelectedFontFamily() {
    for (const fontFamily of FONT_FAMILY_OPTIONS) {
      if (editor.isActive({ fontFamily: fontFamily.value })) {
        return fontFamily.value;
      }
    }
    return "inter";
  }
};

export default FontFamily;
