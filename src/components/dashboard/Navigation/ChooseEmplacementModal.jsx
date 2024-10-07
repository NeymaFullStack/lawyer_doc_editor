"use client";
import LoganModal from "@/components/generic/LoganModal";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Button, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import EmplacementFoldersList from "./EmplacementFoldersList";
import { sliceMapUpToaKey } from "@/utils/dashboard/navigation-utils";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { modalType } from "./FolderDocCreation";
import { useDispatch } from "react-redux";
import { Snowburst_One } from "next/font/google";

function ChooseEmplacementModal({
  open,
  onClose,
  saveDocFolderFieldValues,
  formValues,
  type,
  moveMetaData,
  onConfirm,
}) {
  const appDispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScrollToEnd = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    };

    const observer = new ResizeObserver(handleScrollToEnd);

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    // Scroll to the end on initial render
    handleScrollToEnd();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <LoganModal
      onClickCancel={() => onClose()}
      modalOpen={open}
      width={"46rem"}
      closable={false}
      customFooter={
        <div className="absolute -bottom-[3.5rem] right-0 flex items-center justify-end gap-3">
          <Button
            onClick={() => onClose()}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/left-arrow-grey.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            className={`btn btn--normal`}
          >
            Cancel
          </Button>
          <Button
            disabled={!formValues.emplacement.selectedFolder}
            loading={loading}
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/arrow-right-white.svg"}
                remWidth={1}
                remHeight={1}
                alt={"back"}
              />
            }
            onClick={() => {
              if (type === "MOVETO") {
                setLoading(true);
                onConfirm().finally(() => setLoading(false));
              } else {
                appDispatch(
                  folderNavigationAction.setOpenModalType(
                    modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION,
                  ),
                );
              }
            }}
            className={`btn btn--primary flex-row-reverse`}
          >
            {type === "MOVETO"
              ? `Move ${moveMetaData.noOfFiles} Files`
              : "Create Document"}
          </Button>
        </div>
      }
    >
      <h2 className="text-2xl font-bold text-black">
        Choose An <span className="text-primary-blue">Emplacement</span>
      </h2>
      <div className="mt-4 flex h-[30rem] w-full gap-2  rounded-lg bg-six p-5">
        <div className="flex h-full max-h-full w-[10rem] flex-col gap-2">
          <h4 className=" ml-2 font-semibold text-black-txt">clients</h4>
          <div className="flex max-h-full flex-1 overflow-hidden rounded-lg bg-white py-3 pl-2 pr-3">
            <EmplacementFoldersList
              client
              onClickFolder={onClickFolder}
              selectedFolder={formValues.emplacement.selectedFolder}
            />
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col gap-2 overflow-x-hidden px-[0.001px]">
          <h4 className=" ml-2 font-semibold text-black-txt">Folders</h4>
          <div
            ref={scrollContainerRef}
            className="mx-2 flex  w-full flex-1 overflow-x-scroll rounded-lg bg-white py-3 pl-2 pr-3"
          >
            <ul ref={contentRef} className="flex">
              {[...formValues.emplacement.path.keys()].map((item, index) => {
                return (
                  <li
                    key={index}
                    className="min-w-[10rem] max-w-[10rem] border-r-2 border-[#F0F5FC] px-2"
                  >
                    <EmplacementFoldersList
                      selectedFolder={formValues.emplacement.selectedFolder}
                      selectedMovableFolderDocIds={
                        moveMetaData?.multipleSelectedItems.selectedFolders
                          ? [
                              ...moveMetaData?.multipleSelectedItems.selectedFolders.map(
                                (item) => item.id,
                              ),
                            ]
                          : []
                      }
                      onClickFolder={onClickFolder}
                      parentFolderId={item}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </LoganModal>
  );

  function onClickFolder(folder, parentFolderId, isClient) {
    if (isClient) {
      let emplacement = { ...formValues?.emplacement };
      emplacement.selectedFolder = folder;
      emplacement.path = new Map([[folder.id, null]]);

      saveDocFolderFieldValues({ emplacement });
    } else {
      let { emplacement } = formValues;

      emplacement.selectedFolder = folder;

      let pathMap = emplacement.path;
      pathMap = sliceMapUpToaKey(pathMap, parentFolderId);
      pathMap.set(parentFolderId, { id: folder.id, label: folder.title });
      pathMap.set(folder.id, null);
      emplacement.path = pathMap;
      saveDocFolderFieldValues({ emplacement });
    }
  }
}

export default ChooseEmplacementModal;
