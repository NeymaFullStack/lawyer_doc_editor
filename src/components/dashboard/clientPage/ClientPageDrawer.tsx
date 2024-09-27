import React, { useEffect, useRef, useState } from "react";
import LoganDrawer, { LoganDrawerProps } from "../../generic/LoganDrawer";
import RemSizeImage from "../../generic/RemSizeImage";
import { Button } from "../../shadcn-components/ui/button";
import { DrawerTitle } from "../../shadcn-components/ui/drawer";
import CompanyInformationForm, { ClientFormData } from "./ClientPageBody";
import { useRouter } from "next/navigation";
import {
  getClientOptionalDetails,
  updateClientOptionalDetails,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import Loader from "@/components/generic/Loader";

export interface clientPagerProps extends LoganDrawerProps {
  clientRoute: string;
  clientFolderId: string;
}

export default function ClientPageDrawer({
  isOpen,
  onClose,
  showFooter,
  setIsOpen,
  clientRoute,
  clientFolderId,
}: clientPagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [clientDetails, setClientDetails] = useState<any>();
  const router = useRouter();
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    clientFolderId && getClientData();
  }, [clientFolderId]);
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
              {clientDetails?.title || ""}
            </DrawerTitle>
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={isEditing}
              variant={`${isEditing ? "secondary" : "primary-blue"}`}
              onClick={() => {
                !isEditing && router.push(`${clientRoute}`);
                onClose();
              }}
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
              disabled={isLoading}
              onClick={() => {
                if (
                  isEditing &&
                  formRef.current &&
                  "onUpdateChanges" in formRef.current
                ) {
                  (
                    formRef.current as { onUpdateChanges: () => void }
                  ).onUpdateChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              variant={`${isEditing ? "primary-blue" : "primary-blue-outline"}`}
            >
              {isLoading && (
                <Loader
                  width={"h-[1.2rem]"}
                  height={"w-[1.2rem]"}
                  className={"mr-2"}
                />
              )}
              {!isEditing && !isLoading && (
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
          allowCopy={true}
          formDetails={{
            ...(() => {
              let { title = "", ...restDetails } = clientDetails || {};
              return restDetails;
            })(),
          }}
          ref={formRef}
        />
      }
    />
  );

  async function getClientData() {
    //call api to get client data
    const res = await getClientOptionalDetails(clientFolderId);
    let formData = res?.data;
    if (!formData) {
      return;
    }
    delete formData?.project_id;
    delete formData?.project_path;
    setClientDetails(formData);
  }

  async function onSaveChanges(formParams: any) {
    setIsLoading(true);
    const formData = new FormData();
    for (const key in formParams) {
      formData.append(key, formParams[key]);
    }
    const res = await updateClientOptionalDetails(clientFolderId, formData);
    if (res?.status === 200) {
      await getClientData();
      setIsEditing(false);
    }
    setIsLoading(false);
    //call api to save client data and also save the new data pass it to form
  }
}
