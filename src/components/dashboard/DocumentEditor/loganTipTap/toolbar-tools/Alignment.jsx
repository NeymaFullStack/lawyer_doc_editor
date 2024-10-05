import React, { useState, useEffect } from "react";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-components/ui/popover";
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

  // Set the initial alignment state based on the editor's current selection.
  useEffect(() => {
    setSelectedAlignment(getCurrentSelectedAlign());
  }, [editor?.state?.selection]);

  // Function to handle alignment selection.
  const handleSelect = (value) => {
    if (editor) {
      // Apply the new alignment and focus on the editor.

      editor.chain().focus().setTextAlign(value).run();
      setSelectedAlignment(value);
    }
  };

  // Get the current selected alignment in the editor.
  function getCurrentSelectedAlign() {
    for (const textAlign of ALIGNMENT_TYPE) {
      if (editor.isActive({ textAlign: textAlign.value })) {
        return textAlign.value;
      }
    }
    return "left";
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* The trigger button shows the currently selected alignment */}
        <Button
          variant="outline"
          className="ml-1  !h-[1.5rem] w-[4.5rem]  rounded-md p-2 hover:bg-white focus:ring-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span>
            {selectedAlignment.charAt(0).toUpperCase() +
              selectedAlignment.slice(1)}
          </span>
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/arrow-down.svg"}
            remWidth={1}
            remHeight={1}
            alt="Dropdown"
            className={"ml-auto"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="ml-1  max-h-60 w-fit min-w-fit overflow-y-scroll p-2">
        {/* List of alignment options as buttons */}
        <div className="flex flex-col gap-1">
          {ALIGNMENT_TYPE.map((alignment) => (
            <Button
              key={alignment?.value}
              variant={
                selectedAlignment === alignment.value ? "secondary" : "ghost"
              }
              className="!h-[1.5rem] w-[3.5rem]  py-1 text-left"
              onClick={(e) => {
                handleSelect(alignment.value);
                e.stopPropagation();
              }}
            >
              {alignment?.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Alignment;
