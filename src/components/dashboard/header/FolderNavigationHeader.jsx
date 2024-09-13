import LoganDropDown from "@/components/generic/LoganDropDown";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import React from "react";
import { modalType } from "../Navigation/FolderDocCreation";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import LoganAutoSuggestion from "@/components/generic/LoganAutoSuggestion";
import { getNavigationSuggestions } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { navigationSearchItemTypes } from "@/constants/enums";

function FolderNavigationHeader({ folderListView = false }) {
  const appDispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-[50%]">
        <LoganAutoSuggestion
          fetchSuggestions={getNavigationSuggestions}
          onSelectedValueChange={(value, data) => {
            if (data.type === navigationSearchItemTypes.DOCUMENT) {
              router.push(`/dashboard/doc-edit/${data.id}`);
            } else {
              router.push(`/dashboard/${data.id}`);
            }
          }}
          // selectedValue={selectedValue}
          // onSelectedValueChange={setSelectedValue}
          // searchValue={searchValue}
          // onSearchValueChange={setSearchValue}
          // items={[]}
          // isLoading={isLoading}
          emptyMessage="No Data found."
        />
      </div>
      <div className="mr-4 flex items-center gap-3">
        <div className="flex items-center gap-[0.688rem] rounded-[0.43rem] bg-six px-[0.946rem] py-[0.43rem]">
          {folderListView ? (
            <RemSizeImage
              imagePath={"/assets/icons/list-view-active.svg"}
              remWidth={0.812}
              remHeight={0.65}
              alt={"List-View"}
            />
          ) : (
            <RemSizeImage
              imagePath={"/assets/icons/list-view.svg"}
              remWidth={0.812}
              remHeight={0.65}
              alt={"List-View"}
            />
          )}
          <div
            className="cursor-pointer"
            onClick={() =>
              appDispatch(folderNavigationAction.toggleFolderView())
            }
          >
            {folderListView ? (
              <RemSizeImage
                imagePath={"/assets/icons/left-switch.svg"}
                remWidth={2.533}
                remHeight={1.299}
                alt={"List-View"}
              />
            ) : (
              <RemSizeImage
                imagePath={"/assets/icons/right-switch.svg"}
                remWidth={2.533}
                remHeight={1.299}
                alt={"List-View"}
              />
            )}
          </div>
          {folderListView ? (
            <RemSizeImage
              imagePath={"/assets/icons/tile-view.svg"}
              remWidth={0.812}
              remHeight={0.65}
              alt={"List-View"}
            />
          ) : (
            <RemSizeImage
              imagePath={"/assets/icons/tile-view-active.svg"}
              remWidth={0.812}
              remHeight={0.65}
              alt={"List-View"}
            />
          )}
        </div>
        <LoganDropDown
          dropDownMenu={getAddButtonDropdownMenu()}
          baseElement={
            <button>
              <RemSizeImage
                imagePath={"/assets/icons/add-blue.svg"}
                remWidth={2.125}
                remHeight={2.125}
                alt={"New"}
              />
            </button>
          }
        />
      </div>
    </div>
  );

  function getAddButtonDropdownMenu() {
    let menu = [
      {
        label: (
          <div className="flex items-center gap-2 text-xs">
            <RemSizeImage
              imagePath={"/assets/icons/new-folder.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt={"New Folder"}
            />
            <span>New Folder</span>
          </div>
        ),
        key: modalType.NEW_FOLDER,
      },
      {
        label: (
          <div className="flex items-center gap-2 text-xs">
            <RemSizeImage
              imagePath={"/assets/icons/new-doc.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt={"New Doc"}
            />
            <span>New Document</span>
          </div>
        ),
        key: params.folderId
          ? modalType.DOCUMENT_TEMPLATE_TYPE_SELECTION
          : modalType.EMPLACEMENT,
      },
      {
        label: (
          <div className="flex items-center gap-2 text-xs">
            <RemSizeImage
              imagePath={"/assets/icons/import-doc-1.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt={"New Doc"}
            />
            <span>Import A Document</span>
          </div>
        ),
        key: "importDoc",
      },
    ];
    if (!!!params?.folderId) {
      menu.shift();
    }
    return {
      items: menu,
      onClick: addButtonAction,
    };
  }

  function addButtonAction({ item, key }) {
    appDispatch(folderNavigationAction.setOpenModalType(key));
  }
}

export default FolderNavigationHeader;
