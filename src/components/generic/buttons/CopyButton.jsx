import { Button } from "@/components/shadcn-components/ui/button";
import RemSizeImage from "../RemSizeImage";
import { cn } from "@/utils/shadcn-utils";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CopyButton({ onClick, className, ...props }) {
  const [isBeingHovered, setIsBeingHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  useEffect(() => {
    if (copiedContent === null && isCopied) {
      setIsCopied(false);
    }
  }, [copiedContent]);
  return (
    <>
      {/* {copiedContent !== null &&
        copiedContent?.title &&
        copiedContent?.type && (
          <div
            style={{
              left: cursorPosition.x + 5 + "px",
              top: cursorPosition.y + "px",
            }}
            className={cn(
              `fixed rounded-md border-[2px] border-dotted border-primary-blue p-1 px-2 text-primary-blue`,
              copiedContent.type === copiedContentType.Appendix &&
                "border-appendix-1 text-appendix-1",
              copiedContent.type === copiedContentType.Variable &&
                "border-var text-var",
            )}
          >
            <div
              className={cn(
                " text-sm font-semibold ",
                getTagIcon() && "flex items-center gap-2",
              )}
            >
              <div className="flex items-center">
                {getTagIcon() && (
                  <RemSizeImage
                    className={"mr-1"}
                    imagePath={`/assets/icons/docaction/${getTagIcon()}.svg`}
                    remWidth={0.5}
                    remHeight={0.5}
                    alt={"article"}
                  />
                )}
                {copiedContent.type === copiedContentType.Appendix &&
                  `Appendix ${copiedContent?.index} -`}
                {copiedContent.type === copiedContentType.Appendix &&
                  `Article ${copiedContent?.index} -`}
              </div>
              <span>{copiedContent?.title}</span>
            </div>
          </div>
        )} */}
      <Button
        onClick={(e) => {
          onClick(e);
          setIsCopied(true);
          e.stopPropagation();
        }}
        onMouseEnter={() => setIsBeingHovered(true)}
        onMouseLeave={() => {
          setIsBeingHovered(false);
        }}
        size={"xs"}
        className={cn("z-[999] duration-75", className)}
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
        <span>{isCopied ? "copied" : "copy"}</span>
      </Button>
    </>
  );
}

export default CopyButton;
