import { Button } from "@/components/shadcn-components/ui/button";
import RemSizeImage from "../RemSizeImage";
import { cn } from "@/utils/shadcn-utils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { copiedContentType, tagInsertionType } from "@/constants/enums";

function CopyButton({ onClick, className, ...props }) {
  const [isBeingHovered, setIsBeingHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );

  // Event handler to update cursor position
  const handleMouseMove = (event) => {
    setCursorPosition({ x: event?.clientX, y: event?.clientY });
  };
  useEffect(() => {
    if (window !== undefined && copiedContent) {
      // copiedContent?.id && window.
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [copiedContent]);
  // console.log("copied", copiedContent);

  return (
    <>
      {copiedContent !== null &&
        copiedContent?.title &&
        copiedContent?.type && (
          <div
            style={{
              left: cursorPosition.x + 5 + "px",
              top: cursorPosition.y + "px",
            }}
            className={`fixed flex items-center gap-2 rounded-md border-[2px] border-dotted ${copiedContent.type === copiedContentType.Appendix ? "border-appendix-1 text-appendix-1" : " border-primary-blue text-primary-blue"}  p-1 `}
          >
            <div className="ml-1 flex items-center gap-2 text-sm font-semibold ">
              <div className="flex items-center">
                <RemSizeImage
                  className={"mr-1"}
                  imagePath={`/assets/icons/docaction/${copiedContent.type === copiedContentType.Appendix ? "appendix" : "article-icon"}.svg`}
                  remWidth={0.5}
                  remHeight={0.5}
                  alt={"article"}
                />
                {copiedContent.type === copiedContentType.Appendix &&
                  `Appendix ${copiedContent?.index} -`}
                {copiedContent.type === copiedContentType.Appendix &&
                  `Article ${copiedContent?.index} -`}
              </div>
              <span>{copiedContent?.title}</span>
            </div>
          </div>
        )}
      <Button
        onClick={(e) => {
          onClick(e);
          setIsCopied(true);
        }}
        onMouseEnter={() => setIsBeingHovered(true)}
        onMouseLeave={() => {
          setIsBeingHovered(false);
        }}
        size={"xs"}
        className={cn("duration-75", className)}
        variant={`${isCopied ? "primary-blue-1-dotted" : isBeingHovered ? "primary-blue" : "primary-blue-1"}`}
      >
        {isCopied && (
          <RemSizeImage
            imagePath={"/assets/icons/copied-icon.svg"}
            remWidth={1}
            remHeight={1}
            alt={"copied"}
            className="mr-2"
          />
        )}
        copy
      </Button>
    </>
  );
}

export default CopyButton;
