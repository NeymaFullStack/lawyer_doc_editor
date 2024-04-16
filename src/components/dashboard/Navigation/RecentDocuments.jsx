"use client";
import React from "react";
import DocFile from "./DocFile";

function RecentDocuments() {
  return (
    <div className="flex  w-full flex-col gap-4">
      <h2 className="font-semibold text-black ">Recent Documents</h2>
      <div className="rounded-lg bg-white p-5  pb-4 ">
        <div className="overflow-x-scroll pb-6">
          <div className="flex gap-[1.4rem]">
            <DocFile />
            <DocFile />
            <DocFile />
            <DocFile />
            <DocFile />
            <DocFile />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentDocuments;
