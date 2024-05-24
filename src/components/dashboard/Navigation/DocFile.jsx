import RemSizeImage from "@/components/generic/RemSizeImage";
import React from "react";
import parse from "html-react-parser";

function DocFile({ onClickDoc, doc, nonClient = false }) {
  return (
    <div
      onClick={() => {
        onClickDoc(doc);
      }}
      className={`flex w-[13rem] flex-col gap-2 ${
        nonClient ? "bg-blanc" : "bg-six"
      } cursor-pointer rounded-lg px-4 py-3`}
    >
      <div className=" flex items-center gap-1 !text-[0.428rem] text-xs !leading-[0.518rem] text-primary-blue">
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
        {doc.document_name}
      </h3>
      <div className="h-[5.1rem] overflow-y-hidden bg-white p-4 pb-1">
        <div className="h-[98%] overflow-y-hidden">
          {parse(
            `<h1>My PurposeMitigating thsi that blah blah</h1><p style="font-size:10px;">jsbjfbdsf sdf hds fhs fh sdf f s fj fjs f h fh</p>`,
          )}
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between text-[0.48rem]">
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
