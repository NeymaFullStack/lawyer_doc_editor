"use client";
import React, { useState } from "react";
import RemSizeImage from "./RemSizeImage";

function Sort({ onClickSort, title }) {
  const [sortOrder, setSortOrder] = useState("ascend");
  return (
    <button
      className={
        title
          ? "flex items-center gap-1 rounded-md  bg-secondary-blue p-1 px-2 text-xs font-medium text-black-txt"
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
        className={sortOrder === "ascend" ? "" : "rotate-180"}
      />
      {title && <span>{title}</span>}
    </button>
  );
}

export default React.memo(Sort);
