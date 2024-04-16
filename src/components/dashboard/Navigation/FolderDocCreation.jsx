"use client";
import React, { useRef, useState } from "react";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateClientModal from "./CreateClientModal";
import DocCreationTypeModal from "./DocCreationTypeModal";
import CreateDocModal from "./CreateDocModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
import { useSelectedLayoutSegments } from "next/navigation";

export const modalType = {
  NEW_FOLDER: "newFolder",
  New_CLIENT: "newClient",
  DOCUMENT_TEMPLATE_TYPE_SELECTION: "documentTemplateSection",
  DOCUMENT_EMPLACEMENT: "documentEmplacement",
  CREATE_DOCUMENT: "createDocument",
  DOCUMENT_PREVIEW: "documentPreview",
};

function FolderDocCreation() {
  const appDispatch = useDispatch();
  const segments = useSelectedLayoutSegments();
  const { openModalType } = useSelector(
    (state) => state.folderNavigationReducer,
  );
  const [docFolderFieldValues, setDocFolderFieldValues] = useState({});

  return (
    <>
      {openModalType === modalType?.New_CLIENT && (
        <CreateClientModal
          open={openModalType === modalType?.New_CLIENT}
          onClose={closeModal}
          saveDocFolderFieldValues={saveDocFolderFieldValues}
          formValues={docFolderFieldValues}
        />
      )}
      {/* <CreateNewDocModal
        clientFolder={docFolderFieldValues?.current?.clientName}
        open={openModalType === modalType?.CREATE_DOCUMENT}
        onClose={closeModal}
        saveDocFolderFieldValues={saveDocFolderFieldValues}
      /> */}
      {openModalType === modalType?.DOCUMENT_TEMPLATE_TYPE_SELECTION && (
        <DocCreationTypeModal
          onClose={closeModal}
          open={openModalType === modalType?.DOCUMENT_TEMPLATE_TYPE_SELECTION}
          formValues={docFolderFieldValues}
        />
      )}
      {openModalType === modalType?.CREATE_DOCUMENT && (
        <CreateDocModal
          open={openModalType === modalType?.CREATE_DOCUMENT}
          onClose={closeModal}
          saveDocFolderFieldValues={saveDocFolderFieldValues}
          formValues={docFolderFieldValues}
        />
      )}
      {openModalType === modalType?.DOCUMENT_PREVIEW && (
        <DocumentPreviewModal
          open={openModalType === modalType?.DOCUMENT_PREVIEW}
          onClose={closeModal}
          formValues={docFolderFieldValues}
          slugs={segments}
        />
      )}
    </>
  );

  function closeModal(preserveValues = false, additionalValues = {}) {
    !preserveValues && appDispatch(folderNavigationAction.setOpenModalType(""));
    if (preserveValues) {
      console.log("logan", docFolderFieldValues);
      setDocFolderFieldValues({ ...docFolderFieldValues, ...additionalValues });
    } else {
      setDocFolderFieldValues({ ...additionalValues });
    }
  }

  function saveDocFolderFieldValues(values) {
    setDocFolderFieldValues({
      ...docFolderFieldValues,
      ...values,
    });
  }
}

export default FolderDocCreation;
