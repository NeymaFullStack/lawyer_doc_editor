"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { documentAction } from "@/redux/documentSlice";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import RemSizeImage from "@/components/generic/RemSizeImage";

function Highlighter() {
  const appDispatch = useDispatch();
  const { highlighter } = useSelector((state) => state.documentReducer.toolbar);

  return (
    <Button
      size={"icon"}
      variant={"link"}
      onClick={() => {
        appDispatch(documentAction.toogleEditorToolbarState("highlighter"));
      }}
    >
      <RemSizeImage
        imagePath={
          highlighter
            ? "/assets/icons/quillicons/highlighter-active.svg"
            : "/assets/icons/quillicons/highlighter.svg"
        }
        remWidth={1.8}
        remHeight={1.8}
        alt="Highlighter"
      />
    </Button>
  );
}

export default Highlighter;
