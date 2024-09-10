import RemSizeImage from "@/components/generic/RemSizeImage";
import React from "react";

import { useSelector } from "react-redux";
import CollapsibleList from "@/components/generic/CollapsibleList";
import { manipulateItems } from "@/utils/dashboard/editor-utils";
import { useDispatch } from "react-redux";

function LoganReferenceTool() {
  const appDispatch = useDispatch();

  const { articleList, collapsibleListOpenState } = useSelector(
    (state) => state.documentIndexingReducer,
  );

  const manageArticles = (actionType, id, level, articleInputValue = "") => {
    manipulateItems(
      appDispatch,
      articleList,
      actionType,
      id,
      level,
      articleInputValue,
    );
  };
  return (
    <div
      className="flex h-full flex-col"
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[2.997rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">Index</h2>
      </div>
      <div className="flex w-full items-center gap-3 border-b-[0.063rem] border-secondary-blue bg-gradient-search px-5 py-3">
        <RemSizeImage
          imagePath={"/assets/icons/search-icon.svg"}
          remWidth={1.188}
          remHeight={1.188}
          alt={"Search"}
        />
        <input
          autoComplete="off"
          className="w-[80%] bg-gradient-search  text-xs  outline-none"
          placeholder={"Search for a specific appendix or article"}
        ></input>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-scroll p-3 text-xs ">
        <CollapsibleList
          items={articleList.slice(0, 1)}
          isDragAndDrop={true}
          articleAction={manageArticles}
        />
        <CollapsibleList
          items={articleList.slice(1)}
          isDragAndDrop={true}
          articleAction={manageArticles}
        />
      </div>
    </div>
  );
}

export default LoganReferenceTool;
