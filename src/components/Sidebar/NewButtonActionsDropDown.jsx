"use client";
import { sideBarDropDownMenu } from "@/constants/list";
import { Divider } from "antd";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import RemSizeImage from "../generic/RemSizeImage";
import { useDispatch } from "react-redux";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";

function NewButtonActionsDropDown({ onClose }) {
  const appDispatch = useDispatch();

  return (
    <ul className="rounded-xl bg-white p-2 pr-4 text-xs shadow-out-lg">
      {sideBarDropDownMenu?.map((item, index) => {
        let element;
        if (item?.type === "divider") {
          element = <Divider className="m-0 my-1" />;
        } else {
          element = (
            <div
              onClick={() => {
                newButtonAction(item);
                onClose();
              }}
              className="flex  cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-five hover:text-primary-blue"
            >
              <RemSizeImage
                imagePath={item?.icon}
                remWidth={1.125}
                remHeight={1.125}
                alt={item?.label}
              />
              <span className="font-semibold">{item?.label}</span>
            </div>
          );
        }
        return <li key={nanoid()}>{element}</li>;
      })}
    </ul>
  );

  function newButtonAction({ key }) {
    appDispatch(folderNavigationAction.setOpenModalType(key));
  }
}

export default NewButtonActionsDropDown;
