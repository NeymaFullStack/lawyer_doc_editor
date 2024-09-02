"use client";

import { documentAction } from "@/redux/documentSlice";
import { nanoid } from "nanoid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { documentActionsList } from "@/constants/list";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button } from "@/components/shadcn-components/ui/button";

function DocumentActionBar() {
  const appDispatch = useDispatch();

  const { activeDocumentAction, isEditorToolHidden } = useSelector(
    (state) => state.documentReducer,
  );

  return (
    <ul className="flex w-full flex-col items-center gap-2 px-3">
      <li key={"toggle-tool"}>
        <Button
          size={"icon"}
          variant={"link"}
          onClick={() => {
            appDispatch(documentAction.toggleToolOpen());
          }}
        >
          <RemSizeImage
            imagePath={
              isEditorToolHidden
                ? "/assets/icons/drawer-close.svg"
                : "/assets/icons/drawer-close.svg"
            }
            remWidth={2.063}
            remHeight={2.063}
            alt={"toggle-tool"}
            className={isEditorToolHidden && "rotate-180"}
          />
          {/* <Image src={item.icon} width={} height={30} alt={item.value} /> */}
        </Button>
      </li>
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
