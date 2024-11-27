import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { colors } from "./config-toobar";

type ColorPickerProps = {
  button: React.ReactNode;
  onChange: (color: string) => void;
};

export const EditorColorPicker: React.FC<ColorPickerProps> = ({
  button,
  onChange,
}) => {
  const handleColorClick = (color: string) => {
    onChange(color);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-0 h-7 bg-transparent">{button}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3 grid gap-2 text-logan-black-foreground font-semibold rounded-2xl">
        <div className="grid grid-cols-10 gap-2 ">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full cursor-pointer border-solid border border-logan-black-foreground shadow-lg transition-transform transform hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
