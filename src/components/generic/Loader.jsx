"use client";
import React from "react";
import LoadingIcon from "./LoadingIcon";

function Loader() {
  return (
    <div className="bg-[rgb(90 86 86 / 80%)]  flex h-full w-full items-center justify-center">
      <LoadingIcon />
    </div>
  );
}

export default Loader;
