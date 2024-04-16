"use client";
import RemSizeImage from "@/components/generic/RemSizeImage";
import Tags from "@/components/generic/Tags";
import { copiedContentType } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let toolTipStyle = {};
function ContentSearchToolTip() {
  const appDispatch = useDispatch();

  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent
  );
  useEffect(() => {
    if (copiedContent?.type === copiedContentType.Appendix) {
      toolTipStyle = { bg: "bg-[#FFF3E7]", text: "text-[#FF7A00]" };
    } else {
      toolTipStyle = { bg: "bg-[#FFF5FD]", text: "text-[#FF26C2]" };
    }
  }, []);

  return (
    <div className=" shadow-out-lg p-3 bg-white rounded-lg text-[0.813rem] ">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-between min-w-[10rem] max-w-[15rem]">
          <div>
            {(copiedContent?.type === copiedContentType.Appendix ||
              copiedContent?.type === copiedContentType.Article) && (
              <div className="flex items-center gap-2">
                <Tags textColor={toolTipStyle?.text} bgColor={toolTipStyle.bg}>
                  Appendix
                </Tags>
                <span className="flex  gap-[2px]">
                  <RemSizeImage
                    imagePath={"/assets/icons/appendix-icon.svg"}
                    remWidth={0.375}
                    remHeight={0.625}
                    alt={"Appendix"}
                  />
                  <span className={toolTipStyle?.text}>{3}</span>
                </span>
              </div>
            )}
            {copiedContent.type === copiedContentType.Variable && (
              <span className="flex-1 text-primary-blue">
                {"Contract_Value"}
              </span>
            )}
          </div>
          <div className="px-1 flex items-center gap-[0.125rem] pl-3">
            <span>1</span>
            <span>/</span>
            <span>2</span>
          </div>
        </div>
        <div className=" bg-secondary-blue h-[1.219rem]  w-[0.063rem]"></div>
        <div className="flex items-center gap-1">
          <button className="rotate-180">
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/arrow-down.svg"}
              remWidth={1.375}
              remHeight={1.125}
              alt={"Previous"}
            />
            {/* <Image
              src={"/assets/icons/quillicons/arrow-down.svg"}
              width={22}
              height={18}
              alt="Previous"
            /> */}
          </button>
          <button>
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/arrow-down.svg"}
              remWidth={1.375}
              remHeight={1.125}
              alt={"Next"}
            />
            {/* <Image
              src={"/assets/icons/quillicons/arrow-down.svg"}
              width={22}
              height={18}
              alt="Next"
            /> */}
          </button>
          <button
            className="px-1"
            onClick={() => {
              appDispatch(documentAction.setCopiedContent(null));
            }}
          >
            <RemSizeImage
              imagePath={"/assets/icons/cross-icon.svg"}
              remWidth={0.898}
              remHeight={1.125}
              alt={"Close"}
            />
            {/* <Image
              src={"/assets/icons/cross-icon.svg"}
              width={0.898}
              height={1.125}
              alt="Close"
            /> */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentSearchToolTip;
