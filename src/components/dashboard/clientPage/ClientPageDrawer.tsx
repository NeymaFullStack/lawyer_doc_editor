import React, { useState } from "react";
import LoganDrawer, { LoganDrawerProps } from "../../generic/LoganDrawer";
import RemSizeImage from "../../generic/RemSizeImage";
import { Button } from "../../shadcn-components/ui/button";
import { DrawerTitle } from "../../shadcn-components/ui/drawer";
import { CompanyInformationForm, FormData } from "./ClientPageBody";

function ClientPageDrawer({
  isOpen,
  onClose,
  showFooter,
  setIsOpen,
}: LoganDrawerProps) {
  console.log("open", isOpen);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <LoganDrawer
      isOpen={isOpen}
      onClose={onClose}
      setIsOpen={setIsOpen}
      showFooter={showFooter}
      header={
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <span onClick={onClose} className=" mr-1 cursor-pointer">
              <RemSizeImage
                imagePath={"/assets/icons/drawer-close.svg"}
                remWidth={2}
                remHeight={2}
                alt={"drawer-close"}
              />
            </span>
            <DrawerTitle className="text-xl font-semibold  text-black-txt">
              WK Tech Industries
            </DrawerTitle>
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={isEditing}
              variant={`${isEditing ? "secondary" : "primary-blue"}`}
            >
              <RemSizeImage
                imagePath={`/assets/icons/${isEditing ? "client-folder-white" : "client-folder-blue-1"}.svg`}
                remWidth={1}
                remHeight={1}
                alt={"folder"}
                className={"mr-2 "}
              />
              Open Folder
            </Button>
            <Button
              onClick={() => {
                setIsEditing(true);
              }}
              variant={`${isEditing ? "primary-blue" : "primary-blue-outline"}`}
            >
              {!isEditing && (
                <RemSizeImage
                  imagePath={"/assets/icons/blue-pencil.svg"}
                  remWidth={0.9}
                  remHeight={0.9}
                  alt={"folder"}
                  className={"mr-2"}
                />
              )}
              {isEditing ? "Save Changes" : "Edit"}
            </Button>
          </div>
        </div>
      }
      body={
        <CompanyInformationForm
          isEditing={isEditing}
          onSaveChanges={onSaveChanges}
          closeDrawer={onClose}
        />
      }
    />
  );

  function onSaveChanges(data: FormData) {
    //call api to save client data and also save the new data pass it to form
  }
}

export default ClientPageDrawer;
