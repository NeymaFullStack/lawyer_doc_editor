import { documentAction } from "@/redux/documentSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Zoom() {
  const appDispatch = useDispatch();

  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    appDispatch(documentAction.setEditorToolbarState({ zoom: zoom }));
  }, [zoom]);

  return (
    <div className="flex !h-[1.5rem] w-[4.2rem] items-center justify-evenly gap-[0.5] rounded-lg bg-white px-1">
      <button
        disabled={zoom <= 50}
        className="cursor-pointer px-1 text-[1rem] font-medium leading-tight"
        onClick={() => {
          zoom > 50 && setZoom((prev) => prev - 10);
        }}
      >
        -
      </button>
      <span className="flex min-w-[1.8rem] max-w-[1.8rem] justify-center text-[0.65rem] leading-tight">
        {zoom}%
      </span>
      <button
        disabled={zoom >= 170}
        className="cursor-pointer px-1  text-[1rem] font-medium leading-tight"
        onClick={() => {
          zoom < 170 && setZoom((prev) => prev + 10);
        }}
      >
        +
      </button>
    </div>
  );
}

export default Zoom;
