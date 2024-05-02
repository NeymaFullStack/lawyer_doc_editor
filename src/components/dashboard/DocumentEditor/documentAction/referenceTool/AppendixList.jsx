import RemSizeImage from "@/components/generic/RemSizeImage";
import Tag from "@/components/generic/Tag";
import { copiedContentType } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

function AppendixList() {
  const appDispatch = useDispatch();

  const [appendixList, setAppendixList] = useState([
    {
      count: 1,
      name: "Board Meeting Minutes Approving Changes sdhfidsifhiosahfishfiohsiofhiodshiof",
    },
    { count: 2, name: "Board Meeting Minutes Approving Changes" },
    { count: 3, name: "Board Meeting Minutes Approving Changes" },
    { count: 4, name: "Board Meeting Minutes Approving Changes" },
  ]);
  return (
    <ul className="flex h-[92%] flex-col gap-4 overflow-y-scroll">
      {appendixList.map((appendix, index) => {
        return (
          <li key={index} className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Tag textColor={"text-[#FF7A00]"} bgColor={"bg-[#FFF3E7]"}>
                Annex
              </Tag>
              <span className="flex  gap-[2px]">
                <RemSizeImage
                  imagePath={"/assets/icons/appendix-icon.svg"}
                  remWidth={0.375}
                  remHeight={0.625}
                  alt={"Appendix"}
                />
                <span className="text-[#FF7A00]">{index}</span>
              </span>
              <span className="flex items-start justify-normal">
                <span className=" max-w-[85%]">{appendix.name}</span>
                <span className="rounded-md bg-six px-[0.313rem] py-[0.063rem]">
                  {appendix.count}
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                appDispatch(
                  documentAction.setCopiedContent({
                    content: appendix,
                    type: copiedContentType.Appendix,
                  }),
                );
              }}
              className=" min-w-[3.313rem] items-center justify-center rounded-md bg-six   p-1 font-semibold text-primary-blue hover:bg-blue-gradient hover:text-white"
            >
              Copy
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default AppendixList;
