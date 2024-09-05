import React, { useState } from "react";
import RemSizeImage from "../RemSizeImage";

function OptionButton() {
  let [isButtonHovered, seIsButtonHovered] = useState(false);
  return (
    <div
      className=" cursor-pointer  "
      // onMouseOver={() => {
      //   seIsButtonHovered((prev) => !prev);
      // }}
      onMouseEnter={() => {
        seIsButtonHovered((prev) => !prev);
      }}
      onMouseLeave={() => {
        seIsButtonHovered((prev) => !prev);
      }}
      // onMouseOut={() => {
      //   seIsButtonHovered((prev) => !prev);
      // }}
    >
      <RemSizeImage
        imagePath={`/assets/icons/${isButtonHovered ? "blue-option-hoz" : "option-icon"}.svg`}
        remWidth={0.4}
        remHeight={0.4}
        alt={"Close"}
      />
    </div>
  );
}

export default OptionButton;
