import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import ArticleList from "./ArticleList";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Tag from "@/components/generic/Tag";
import { documentAction } from "@/redux/documentSlice";
import { copiedContentType } from "@/constants/enums";
import { useDispatch, useSelector } from "react-redux";

function CollapsibleArticle({ item, showArticleTag }) {
  const appDispatch = useDispatch();

  const [hoverActive, setHoverActive] = useState(false);
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Event handler to update cursor position
  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };
  //   const [isExpanded, setIsExpanded] = useState(false);

  //   const hasChildren = item.children && item.children.length > 0;

  //   const toggleExpand = () => {
  //     setIsExpanded(!isExpanded);
  //   };
  useEffect(() => {
    if (window !== undefined && copiedContent) {
      // copiedContent?.id && window.
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [copiedContent]);
  console.log("copied", copiedContent);

  return (
    <>
      {copiedContent?.content?.articleName &&
        copiedContent?.content?.articleName == item?.articleName && (
          <div
            style={{
              left: cursorPosition.x + 5 + "px",
              top: cursorPosition.y + "px",
            }}
            className={`fixed flex items-center gap-2 rounded-md border-[2px] border-dotted ${copiedContent.type === copiedContentType.Variable ? "border-var text-var" : " border-primary-blue text-primary-blue"}  p-1 `}
          >
            <RemSizeImage
              imagePath={"/assets/icons/paste-icon.svg"}
              remWidth={1.2}
              remHeight={1.2}
              alt={"Paste"}
            />
            <div className="ml-1 flex items-center gap-2 text-xs font-semibold">
              <div className="flex items-center">
                <RemSizeImage
                  className={"mr-1"}
                  imagePath={"/assets/icons/docaction/article-icon.svg"}
                  remWidth={0.5}
                  remHeight={0.5}
                  alt={"article"}
                />
                Article -
              </div>
              <span>{copiedContent?.content?.articleName}</span>
            </div>
          </div>
        )}
      <Collapse
        bordered={false}
        items={[
          {
            key: item.articleName,
            label: (
              <div
                className="flex items-center justify-between"
                onMouseEnter={() => {
                  setHoverActive(true);
                }}
                onMouseLeave={() => {
                  setHoverActive(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {showArticleTag && <Tag>Article</Tag>}
                  <RemSizeImage
                    imagePath={"/assets/icons/docaction/article-icon.svg"}
                    remWidth={0.5}
                    remHeight={0.5}
                    alt={"article"}
                  />
                  <h3 className=" text-xs font-medium text-black-txt">
                    {item.articleName}
                  </h3>
                  <span
                    className={`rounded-md bg-six px-[0.313rem] py-[0.063rem] ${item?.children?.length > 0 ? "text-primary-blue" : "text-primary-gray"}`}
                  >
                    {item?.children?.length || 0}
                  </span>
                </div>
                {hoverActive && (
                  <button
                    onClick={(e) => {
                      appDispatch(
                        documentAction.setCopiedContent({
                          content: item,
                          type: copiedContentType.Article,
                        }),
                      );
                      e.stopPropagation();
                    }}
                    className={`h-full w-[3.313rem] items-center justify-center rounded-md bg-blue-gradient py-[0.15rem] text-xs text-white`}
                  >
                    Copy
                  </button>
                )}
              </div>
            ),
            children:
              item?.children?.length > 0 ? (
                <ArticleList items={item?.children} />
              ) : (
                ""
              ),
          },
        ]}
        expandIcon={(panelProps) => {
          return (
            <RemSizeImage
              className={panelProps.isActive ? " rotate-90" : ""}
              imagePath={"/assets/icons/docaction/expand-blue.svg"}
              remWidth={0.45}
              remHeight={0.5}
              alt={"Expand"}
            />
          );
        }}
      />
    </>
  );
}

export default CollapsibleArticle;
