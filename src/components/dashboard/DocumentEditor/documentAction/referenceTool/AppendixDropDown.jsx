import RemSizeImage from "@/components/generic/RemSizeImage";
import Tags from "@/components/generic/Tags";
import React, { useEffect } from "react";
import { useState } from "react";

function AppendixDropDown({ onClose }) {
  const [appendixList, setAppendixList] = useState([
    { id: 1, name: "Document - Updated By Laws", document: true },
    { id: 2, name: "Document - Updated By Laws", document: false },
    { id: 3, name: "Document - Updated By Laws", document: false },
    { id: 4, name: "Document - Updated By Laws", document: false },
    { id: 5, name: "Document - Updated By Laws", document: false },
  ]);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener("click", onClose);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("click", onClose);
      }
    };
  }, []);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="py-2 min-w-[20rem] max-w-[20rem] bg-white shadow-out-lg text-primary-gray rounded-xl text-xs"
    >
      <div className="px-2 pb-2">SELECT</div>
      <ul>
        {appendixList.map((appendix, index) => {
          if (appendix.document) {
            return (
              <li
                key={appendix.id}
                className=" cursor-pointer group flex items-center justify-between px-2 py-2 hover:bg-six"
                onClick={() => {
                  onClose();
                }}
              >
                <Tags textColor={"text-primary-blue"} bgColor={"bg-six"}>
                  {appendix?.name}
                </Tags>
                <div className="hidden group-hover:block">
                  <RemSizeImage
                    imagePath={"/assets/icons/select-icon.svg"}
                    remWidth={1.125}
                    remHeight={1.125}
                    alt={"Select"}
                  />
                </div>
              </li>
            );
          }
          return (
            <li
              key={appendix.id}
              className=" cursor-pointer group flex items-center justify-between px-2 py-2  hover:bg-six"
              onClick={() => {
                onClose();
              }}
            >
              <Tags textColor={"text-[#FF7A00]"} bgColor={"bg-[#FFF3E7]"}>
                {appendix.name}
              </Tags>
              <div className="hidden group-hover:block">
                <RemSizeImage
                  imagePath={"/assets/icons/select-icon.svg"}
                  remWidth={1.125}
                  remHeight={1.125}
                  alt={"Select"}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AppendixDropDown;
