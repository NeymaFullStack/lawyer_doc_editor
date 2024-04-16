"use client";

import { documentStatus } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import { nanoid } from "nanoid";
import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  documentActionsDraft,
  documentActionsFinalized,
} from "@/constants/list";
import RemSizeImage from "@/components/generic/RemSizeImage";

function DocumentActionBar() {
  const appDispatch = useDispatch();
  const documentState = useSelector(
    (state) => state.documentReducer.documentState
  );
  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction
  );

  return (
    <ul className="flex px-3 mt-12 flex-col gap-2 items-center w-full">
      {(documentState === documentStatus.Draft
        ? documentActionsDraft(activeDocumentAction)
        : documentActionsFinalized(activeDocumentAction)
      ).map((item, index) => {
        return (
          <li key={nanoid()}>
            <button onClick={() => onClickActionTool(item.value)}>
              <RemSizeImage
                imagePath={item.icon}
                remWidth={2.063}
                remHeight={2.063}
                alt={item.value}
              />
              {/* <Image src={item.icon} width={} height={30} alt={item.value} /> */}
            </button>
          </li>
        );
      })}
    </ul>
  );

  function onClickActionTool(tool) {
    appDispatch(documentAction.setActiveDocumentAction(tool));
  }
}

export default DocumentActionBar;
