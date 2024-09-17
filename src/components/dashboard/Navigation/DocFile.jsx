import RemSizeImage from "@/components/generic/RemSizeImage";
import React from "react";
import { dtYYMMDDat12hrFormat } from "@/utils/dateUtils";

import Image from "next/image";
import { cn } from "@/utils/shadcn-utils";

function DocFile({
  onClickDoc,
  doc,
  nonClient = false,
  contextMenuActiveId,
  ...props
}) {
  return (
    <div
      onClick={() => {
        onClickDoc(doc);
      }}
      className={cn(
        "flex w-[13rem] cursor-pointer flex-col gap-2 rounded-lg border-[1px] border-white px-4 py-3 hover:bg-secondary-blue",
        nonClient ? "bg-blanc" : "bg-six",
        contextMenuActiveId === doc?.id &&
          " border-primary-blue bg-secondary-blue text-primary-blue",
      )}
    >
      <div className=" flex items-center gap-1 !text-[0.428rem] text-xs !leading-[0.518rem] text-primary-blue">
        <span className=" min-w-[2rem] max-w-[4rem]  truncate rounded-xl bg-secondary-blue px-1 py-[0.125rem]">
          {doc?.project_path?.length > 0 ? doc?.project_path[0] : ""}
        </span>
        {doc?.project_path?.length > 1 && (
          <>
            <span>/</span>
            {doc?.project_path?.length > 2 && (
              <>
                <span className=" text-sm text-primary-blue">...</span>
                <span>/</span>
              </>
            )}
            <span className="flex  items-center gap-1  rounded-xl bg-secondary-blue px-1 py-[0.125rem]">
              <RemSizeImage
                imagePath={"/assets/icons/folder-blue.svg"}
                remWidth={0.396}
                remHeight={0.396}
                alt={"Folder"}
              />
              <span className="min-w-[2rem] max-w-[4rem] truncate">
                {doc?.project_path?.length > 0
                  ? doc?.project_path[doc?.project_path.length - 1]
                  : ""}
              </span>
            </span>
          </>
        )}
      </div>
      <h3 className=" truncate text-xs font-semibold text-black">
        {doc?.document_name}
      </h3>

      <div className="bg-white px-3">
        <div className="relative h-[4rem] w-full border-secondary-blue">
          {doc?.metadata?.thumbnail_url ? (
            <Image
              src={doc?.metadata?.thumbnail_url}
              alt={"document-thumbnail"}
              priority
              fill
              sizes="5"
              // width={6}
              // height={4.5}
              className="h-auto w-auto rounded" // Add a class if you want rounded corners
              quality={100} // Set the quality of the image
            />
          ) : (
            <Image
              src={"/assets/images/thumbnail_image.jpg"}
              priority
              alt={"Company Logo"}
              fill
              sizes="5"
              className=" h-auto w-auto rounded" // Add a class if you want rounded corners
              quality={100} // Set the quality of the image
            />
          )}
        </div>
      </div>
      {/* {parse(
              `<h1>My PurposeMitigating thsi that blah blah</h1><p style="font-size:10px;">jsbjfbdsf sdf hds fhs fh sdf f s fj fjs f h fh</p>`,
            )} */}

      <div className="mt-1 flex items-center justify-between text-[0.48rem]">
        <span>Last modified on {dtYYMMDDat12hrFormat(doc?.created_at)}</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <RemSizeImage
            imagePath={"/assets/icons/blue-option-hoz.svg"}
            remWidth={0.4}
            remHeight={0.4}
            alt={"option"}
          />
        </span>
      </div>
    </div>
  );
}

export default DocFile;
