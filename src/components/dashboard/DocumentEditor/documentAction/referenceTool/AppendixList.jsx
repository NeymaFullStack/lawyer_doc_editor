import RemSizeImage from "@/components/generic/RemSizeImage";
import Tags from "@/components/generic/Tags";
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
    <ul className="overflow-y-scroll h-[92%] flex flex-col gap-4">
      {appendixList.map((appendix, index) => {
        return (
          <li key={index} className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Tags textColor={"text-[#FF7A00]"} bgColor={"bg-[#FFF3E7]"}>
                Annex
              </Tags>
              <span className="flex  gap-[2px]">
                <RemSizeImage
                  imagePath={"/assets/icons/appendix-icon.svg"}
                  remWidth={0.375}
                  remHeight={0.625}
                  alt={"Appendix"}
                />
                <span className="text-[#FF7A00]">{index}</span>
              </span>
              <span className="flex justify-normal items-start">
                <span className=" max-w-[85%]">{appendix.name}</span>
                <span className="py-[0.063rem] px-[0.313rem] rounded-md bg-six">
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
                  })
                );
              }}
              className=" p-1 font-semibold text-primary-blue bg-six min-w-[3.313rem]   hover:bg-blue-gradient hover:text-white items-center justify-center rounded-md"
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
