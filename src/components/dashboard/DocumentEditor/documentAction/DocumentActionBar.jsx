"use client";

import { documentAction } from "@/redux/documentSlice";
import { nanoid } from "nanoid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentActionsList } from "@/constants/list";
import RemSizeImage from "@/components/generic/RemSizeImage";

function DocumentActionBar() {
  const appDispatch = useDispatch();

  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction,
  );

  return (
    <ul className="mt-12 flex w-full flex-col items-center gap-2 px-3">
      {documentActionsList(activeDocumentAction).map((item, index) => {
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
