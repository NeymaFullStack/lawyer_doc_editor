import RemSizeImage from "@/components/generic/RemSizeImage";
import React from "react";
import parse from "html-react-parser";

function DocFile({ onClickDoc, doc, nonClient = false }) {
  return (
    <div
      onClick={() => {
        onClickDoc(doc);
      }}
      className={`flex flex-col gap-2 ${
        nonClient ? "bg-blanc" : "bg-six"
      } rounded-lg py-3 px-4 cursor-pointer`}
    >
      <div className=" flex items-center gap-1 !text-[0.428rem] !leading-[0.518rem] text-primary-blue text-xs">
        <span className="rounded-xl bg-secondary-blue px-1 py-[0.125rem]">
          NexaCo
        </span>
        <span>/</span>
        <span className="flex items-center gap-1 rounded-xl bg-secondary-blue px-1 py-[0.125rem]">
          <RemSizeImage
            imagePath={"/assets/icons/folder-blue.svg"}
            remWidth={0.396}
            remHeight={0.396}
            alt={"Folder"}
          />
          <span>Intellectual Property Portfolio</span>
        </span>
      </div>
      <h3 className=" text-xs font-semibold text-black ">
        Ip Infrigement Analysis
      </h3>
      <div className="p-4 pb-1 bg-white h-[5.1rem] overflow-y-hidden">
        <div className="overflow-y-hidden h-[98%]">
          {parse(
            `<h1>My PurposeMitigating thsi that blah blah</h1><p style="font-size:10px;">jsbjfbdsf sdf hds fhs fh sdf f s fj fjs f h fh</p>`
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-[0.48rem] mt-1">
        <span>Last modified on 10-24-2023 at 9:27 am</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <RemSizeImage
            imagePath={"/assets/icons/blue-option-hoz.svg"}
            remWidth={1}
            remHeight={1}
            alt={"option"}
          />
        </span>
      </div>
    </div>
  );
}

export default DocFile;
