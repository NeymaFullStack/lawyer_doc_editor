import PositionToolTip from "@/components/generic/PositionToolTip";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Tag from "@/components/generic/Tag";
import { articleInsertionType } from "@/constants/enums";
import React, { useState } from "react";

const ArticleMenu = ({
  items = [],
  isOpen,
  onClose,
  position,
  view,
  editorRef,
}) => {
  const [selectedArticleToInsert, setSelectedArticleToInsert] = useState(null);
  const [articleHeading, setArticleHeading] = useState("");

  const handleMenuItemClick = (item) => {
    setSelectedArticleToInsert(item);
  };

  return (
    <PositionToolTip
      onClose={closeArticleInsertion}
      position={position}
      isOpen={isOpen}
      containerRef={editorRef}
    >
      <div className={`${selectedArticleToInsert == null && "hidden"}`}>
        <h2 className="text-sm">Add New Article</h2>
        <div className="flex items-center gap-2 py-2">
          <div className="text-appendex flex items-center gap-2 ">
            <Tag textColor="text-appendex" bgColor="bg-appendex">
              {articleInsertionType[selectedArticleToInsert?.type]}
            </Tag>
            <div className="flex items-center gap-1">
              <RemSizeImage
                imagePath="/assets/icons/docaction/appendix.svg"
                remHeight={0.5}
                remWidth={0.5}
                alt="appendex"
              />
              <span className=" text-sm font-semibold text-primary-gray">
                {selectedArticleToInsert?.index}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={
                " flex h-[2rem] flex-1 items-center gap-2 rounded-lg border-primary-blue bg-six px-3  focus:border-[1px]"
              }
            >
              <input
                autoComplete="off"
                autoFocus
                value={articleHeading}
                type="text"
                className={
                  " h-[100%] w-60 bg-six  text-xs text-black-txt outline-none"
                }
                onChange={(e) => {
                  setArticleHeading(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    selectedArticleToInsert.onClick(articleHeading, view);
                    closeArticleInsertion();
                  }
                }}
              />
              <div className="flex h-full w-[1rem] items-center gap-3">
                <button
                  onClick={() => {
                    selectedArticleToInsert.onClick(articleHeading, view);
                    closeArticleInsertion();
                  }}
                >
                  {articleHeading.length > 0 && (
                    <RemSizeImage
                      imagePath={"/assets/icons/right-tick.svg"}
                      remWidth={1.173}
                      remHeight={1.082}
                      alt={"Insert"}
                    />
                  )}
                </button>
              </div>
            </div>
            <div onClick={closeArticleInsertion} className=" cursor-pointer">
              <RemSizeImage
                imagePath="/assets/icons/cross-icon.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="close"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`${selectedArticleToInsert !== null && "hidden"} w-48`}>
        <h2 className="text-md">INSERT</h2>
        <ul className="mt-2 flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleMenuItemClick(item)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-appendex flex items-center gap-2 ">
                  <Tag textColor="text-appendex" bgColor="bg-appendex">
                    {articleInsertionType[item.type]}
                  </Tag>
                  <div className="flex items-center gap-1">
                    <RemSizeImage
                      imagePath="/assets/icons/docaction/appendix.svg"
                      remHeight={0.5}
                      remWidth={0.5}
                      alt="appendex"
                    />
                    <span className=" text-sm font-semibold text-black">
                      {item.index}
                    </span>
                  </div>
                </div>
                <RemSizeImage
                  imagePath="/assets/icons/arrow-down-gray.svg"
                  remHeight={0.875}
                  remWidth={0.875}
                  alt="next"
                  className="-rotate-90"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PositionToolTip>
  );

  function closeArticleInsertion() {
    onClose();
    setArticleHeading("");
    setSelectedArticleToInsert(null);
  }
};

export default ArticleMenu;
