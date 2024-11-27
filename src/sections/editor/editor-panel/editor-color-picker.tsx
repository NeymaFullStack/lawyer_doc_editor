import * as React from "react";
import { colors } from "./config-toobar";

type ColorPickerProps = {
  onChange: (color: string) => void;
};

export const EditorColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const handleColorClick = (color: string) => {
    onChange(color);
  };

  return (
    <div className="grid grid-cols-10 gap-2 ">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-5 h-5 rounded-full cursor-pointer border-solid border border-logan-black-foreground shadow-lg transition-transform transform hover:scale-110"
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(color)}
        />
      ))}
    </div>
  );
};
