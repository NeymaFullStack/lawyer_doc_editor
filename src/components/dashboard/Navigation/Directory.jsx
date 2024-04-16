"use client";
import Sort from "@/components/generic/Sort";
import { sortStringTableList } from "@/utils/generic";
import React, { useEffect, useState } from "react";
import DocFolder from "./DocFolder";
import { onClickFolder } from "@/utils/dashboard/navigation-utils";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import DocFile from "./DocFile";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { documentAction } from "@/redux/documentSlice";
import {
  clientFoldersListTableColumns,
  foldersListTableColumns,
} from "@/constants/tableColumns/dashboardTableColumns";
import LoganTable from "@/components/generic/LoganTable";

function Directory({
  foldersList = [],
  documentsList = [],
  clientList = false,
  slug = [],
}) {
  const appDispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { folderListView } = useSelector(
    (state) => state.folderNavigationReducer,
  );

  const [listData, setListData] = useState([...foldersList]);

  useEffect(() => {
    appDispatch(documentAction.setCurrentVersionDocument(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {clientList ? (
            <h2 className="font-semibold text-black ">Client Folders</h2>
          ) : (
            <>
              {!folderListView && (
                <h2 className="font-semibold text-black ">Folders</h2>
              )}
            </>
          )}
          {!folderListView && (
            <Sort
              onClickSort={(sortOrder) => {
                setListData(sortStringTableList(listData, sortOrder, "title"));
              }}
              title={"Name"}
            />
          )}
        </div>
        {!folderListView && (
          <div className="grid grid-cols-6 gap-x-6 gap-y-5">
            {listData?.map((folder, index) => {
              return (
                <DocFolder
                  nonClient={!clientList}
                  onClickFolder={(folder) =>
                    onClickFolder(folder, pathname, router)
                  }
                  key={folder?.id}
                  folder={folder}
                />
              );
            })}
          </div>
        )}
      </div>

      {!folderListView && !clientList && (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-black ">Documents</h2>
            <Sort
              onClickSort={(sortOrder) => {
                setListData(sortStringTableList(listData, sortOrder, "title"));
              }}
              title={"Name"}
            />
          </div>
          <div className="grid grid-cols-5 gap-x-6 gap-y-7">
            {documentsList?.length > 0 &&
              documentsList.map((file, index) => {
                return (
                  <DocFile
                    onClickDoc={onClickDoc}
                    doc={file}
                    nonClient
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      )}
      {folderListView && listData.length > 0 && (
        <LoganTable
          onClickRow={(folder) => onClickFolder(folder, pathname, router)}
          tableColumns={
            clientList
              ? clientFoldersListTableColumns(setListData, listData)
              : foldersListTableColumns(setListData, listData)
          }
          rowKey="id"
          className=" -mt-6"
          listData={listData}
        />
      )}
    </div>
  );
  function onClickDoc(doc) {
    appDispatch(folderNavigationAction.setBreadCrumbs(slug));
    router.push(`/dashboard/doc-edit/${doc.id}`);
  }
}

export default Directory;
