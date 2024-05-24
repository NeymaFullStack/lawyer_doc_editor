"use client";
import React, { useEffect, useState } from "react";
import DocFile from "./DocFile";
import { getRecentDocumentList } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";

function RecentDocuments() {
  const [recentDocuments, setRecentDocuments] = useState(null);
  const appDispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    fetchRecentDocuments();
  }, []);
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-semibold text-black ">Recent Documents</h2>
      {recentDocuments && (
        <div className=" w-full rounded-lg bg-white  p-5 pb-4">
          <div className="overflow-x-scroll pb-6">
            <ul className="flex items-center gap-x-6">
              {recentDocuments.slice(0, 1)?.map((doc) => {
                return (
                  <li key={doc.id}>
                    <DocFile doc={doc} onClickDoc={onClickDoc} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  function onClickDoc(doc) {
    // appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
  async function fetchRecentDocuments() {
    const res = await getRecentDocumentList();
    if (res?.length > 0) {
      setRecentDocuments(res);
    }
  }
}

export default RecentDocuments;
