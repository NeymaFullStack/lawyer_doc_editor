"use client";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { documentStatus } from "@/constants/enums";
import { draft, finalized } from "@/constants/labels";
import { documentAction } from "@/redux/documentSlice";
import { Button, Dropdown } from "antd";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function DocumentState() {
  const appDispatch = useDispatch();
  // const [openDrawer, setOpenDrawer] = useState(false);
  const documentState = useSelector(
    (state) => state.documentReducer.documentState
  );
  let isStatusDraft = documentState === documentStatus.Draft ? true : false;

  // useEffect(() => {
  //   if (typeof window !== undefined) {
  //     window.addEventListener("click", e => {
  //       e.target !== statusRef.current && openDrawer && setOpenDrawer(false);
  //     });
  //   }
  //   return () => {
  //     window.removeEventListener("click", e => {
  //       e.target !== statusRef.current && openDrawer && setOpenDrawer(false);
  //     });
  //   };
  // }, []);

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [
          {
            label: (
              <div
                className="flex items-center gap-2"
                id={documentStatus.Draft}
              >
                <span className={`rounded-full p-1 bg-[#FFC700]`}></span>
                <span className="text-[#FFC700]">{draft}</span>
              </div>
            ),
            key: documentStatus.Draft,
          },
          {
            label: (
              <div
                className="flex items-center gap-2"
                id={documentStatus.Finalized}
              >
                <span className={`rounded-full p-1 bg-[#10C900]`}></span>
                <span className="text-[#10C900]">{finalized}</span>
              </div>
            ),
            key: documentStatus.Finalized,
          },
        ],
        onClick: changeStatus,
      }}
      placement="bottom"
    >
      <div
        className={`flex items-center justify-center gap-2 py-3 px-3  min-w-[6rem] rounded-lg cursor-pointer ${
          isStatusDraft ? "bg-[#FFF7DB]" : "bg-[#D9FADB]"
        }`}
      >
        <span
          className={`rounded-full p-1 ${
            isStatusDraft ? "bg-[#FFC700]" : "bg-[#10C900]"
          }`}
        ></span>
        <span
          className={`text-xs font-semibold ${
            isStatusDraft ? "text-[#FFC700]" : "text-[#10C900]"
          }`}
        >
          {isStatusDraft ? draft : finalized}
        </span>
        <RemSizeImage
          imagePath={"/assets/icons/arrow-down-gray.svg"}
          remWidth={0.75}
          remHeight={0.75}
          alt={"Arrow"}
        />
        {/* <Image
          src={"/assets/icons/arrow-down-gray.svg"}
          height={12}
          width={12}
          alt="arrow"
        /> */}
      </div>
    </Dropdown>
  );

  function changeStatus({ item, key }) {
    appDispatch(documentAction.setActiveDocumentState(key));
  }
}

export default DocumentState;
