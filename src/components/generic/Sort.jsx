"use client";
import React, { useState } from "react";
import RemSizeImage from "./RemSizeImage";

function Sort({ onClickSort, title }) {
  const [sortOrder, setSortOrder] = useState("ascend");
  return (
    <button
      className={
        title
          ? "rounded-md p-1 px-2 bg-secondary-blue  flex items-center gap-1 text-xs text-black-txt font-medium"
          : ""
      }
      onClick={() => {
        if (sortOrder === "ascend") {
          setSortOrder("descend");
          onClickSort("descend");
        } else {
          setSortOrder("ascend");
          onClickSort("ascend");
        }
      }}
    >
      <RemSizeImage
        imagePath={"/assets/icons/up-arrow.svg"}
        remWidth={1.125}
        remHeight={1.125}
        alt="sort"
        className={sortOrder === "ascend" ? "rotate-180" : " "}
      />
      {title && <span>{title}</span>}
    </button>
  );
}

export default React.memo(Sort);
