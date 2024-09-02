import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import RemSizeImage from "@/components/generic/RemSizeImage";

const ALIGNMENT_TYPE = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Right",
    value: "right",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Justify",
    value: "justify",
  },
];

const Alignment = ({ editor }) => {
  const [selectedAlignment, setSelectedAlignment] = useState("left");

  useEffect(() => {
    setSelectedAlignment(getCurrentSelectedAlign());
  }, [editor?.state?.selection]);

  const handleSelect = (value) => {
    console.log("value", value);
    if (editor) {
      editor.chain().focus().setTextAlign(value).run();
      setSelectedAlignment(value);
    }
  };

  console.log("ediotr", selectedAlignment);

  return (
    <Select onValueChange={handleSelect} value={selectedAlignment}>
      <SelectTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" ml-1 !h-[1.5rem]  w-[3.5rem] rounded-md p-2 focus:ring-0"
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
      <SelectContent className="max-h-60 w-fit min-w-fit">
        {ALIGNMENT_TYPE.map((alignment) => (
          <SelectItem
            className="w-[3rem] cursor-pointer"
            key={alignment?.value}
            value={alignment?.value}
          >
            {alignment?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  function getCurrentSelectedAlign() {
    for (const textAlign of ALIGNMENT_TYPE) {
      if (editor.isActive({ textAlign: textAlign.value })) {
        return textAlign.value;
      }
    }
    return "left";
  }
};

export default Alignment;
