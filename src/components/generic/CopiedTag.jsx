"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { copiedContentType } from "@/constants/enums";
import { cn } from "@/utils/shadcn-utils";
import RemSizeImage from "./RemSizeImage";
import { documentAction } from "@/redux/documentSlice";
import { useDispatch } from "react-redux";

function CopiedTag() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  const appDispatch = useDispatch();

  // Event handler to update cursor position
  const handleMouseMove = (event) => {
    setCursorPosition({ x: event?.clientX, y: event?.clientY });
  };
  useEffect(() => {
    if (window !== undefined && copiedContent) {
      // copiedContent?.id && window.
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", () => {
        appDispatch(documentAction.setCopiedContent(null));
      });
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", () => {
        appDispatch(documentAction.setCopiedContent(null));
      });
    };
  }, [copiedContent]);
  // console.log("copied", copiedContent);

  function getTagIcon() {
    if (copiedContent.type === copiedContentType.Appendix) {
      return "appendix";
    } else if (copiedContent.type === copiedContentType.Article) {
      return "article-icon";
    }
    return "";
  }

  console.log("copedContent", copiedContent);
  return (
    copiedContent !== null &&
    copiedContent?.title &&
    copiedContent?.type && (
      <div
        style={{
          left: cursorPosition.x + 5 + "px",
          top: cursorPosition.y + "px",
        }}
        className={cn(
          `z-999 fixed min-w-fit whitespace-nowrap rounded-md border-[2px] border-dotted border-primary-blue p-1 px-2 text-primary-blue`,
          copiedContent.type === copiedContentType.Appendix &&
            "border-appendix-1 text-appendix-1",
          copiedContent.type === copiedContentType.Variable &&
            "border-var text-var",
        )}
      >
        <div
          className={cn(
            " w-full text-sm font-semibold",
            getTagIcon() && "flex items-center gap-2",
          )}
        >
          <div className="flex w-full items-center">
            {getTagIcon() && (
              <RemSizeImage
                className={"mr-1"}
                imagePath={`/assets/icons/docaction/${getTagIcon()}.svg`}
                remWidth={0.5}
                remHeight={0.5}
                alt={"article"}
              />
            )}
            <span></span>
            {copiedContent.type === copiedContentType.Appendix &&
              `Appendix ${copiedContent?.index} -`}
            {copiedContent.type === copiedContentType.Article &&
              `Article ${copiedContent?.index} -`}
          </div>
          <span className="w-full">{copiedContent?.title}</span>
        </div>
      </div>
    )
  );
}

export default CopiedTag;
