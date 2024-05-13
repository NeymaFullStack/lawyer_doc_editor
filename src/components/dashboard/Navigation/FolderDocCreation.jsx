"use client";
import React, { useEffect, useRef, useState } from "react";
import { folderNavigationAction } from "@/redux/folderNavigationSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateClientModal from "./CreateClientModal";
import DocCreationTypeModal from "./DocCreationTypeModal";
import CreateDocModal from "./CreateDocModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
import { useSelectedLayoutSegments } from "next/navigation";
import ProgressModal from "./ProgressModal";
import { getDocumentTemplate } from "@/api/clientSideServiceActions/dashboardServiceActions";
import axios from "axios";
import ChooseEmplacementModal from "./ChooseEmplacementModal";

export const modalType = {
  NEW_FOLDER: "newFolder",
  New_CLIENT: "newClient",
  DOCUMENT_TEMPLATE_TYPE_SELECTION: "documentTemplateSection",
  DOCUMENT_EMPLACEMENT: "documentEmplacement",
  CREATE_DOCUMENT: "createDocument",
  DOCUMENT_PREVIEW: "documentPreview",
  PROGRESS: "progress",
  EMPLACEMENT: "emplacement",
};

function FolderDocCreation() {
  const appDispatch = useDispatch();
  const segments = useSelectedLayoutSegments();
  const { openModalType } = useSelector(
    (state) => state.folderNavigationReducer,
  );
  const controllerRef = useRef(new AbortController());
  const [docFolderFieldValues, setDocFolderFieldValues] = useState({
    emplacement: { selectedFolder: null, path: new Map() },
  });

  useEffect(() => {
    if (
      openModalType === modalType.PROGRESS &&
      docFolderFieldValues?.previewTemplate
    ) {
      appDispatch(
        folderNavigationAction.setOpenModalType(modalType.DOCUMENT_PREVIEW),
      );
    }
  }, [docFolderFieldValues?.previewTemplate]);

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
      {openModalType === modalType?.EMPLACEMENT && (
        <ChooseEmplacementModal
          open={openModalType === modalType?.EMPLACEMENT}
          onClose={closeModal}
          saveDocFolderFieldValues={saveDocFolderFieldValues}
          formValues={docFolderFieldValues}
        />
      )}
      {openModalType === modalType?.PROGRESS && (
        <ProgressModal
          open={openModalType === modalType?.PROGRESS}
          onClose={closeModal}
          cancelAiTemplateGeneration={() => {
            controllerRef.current.abort();
            controllerRef.current = new AbortController();
            // source.cancel("Operation canceled by the user.");
          }}
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
          onApply={generateAiTemplate}
        />
      )}
      {openModalType === modalType?.DOCUMENT_PREVIEW && (
        <DocumentPreviewModal
          open={openModalType === modalType?.DOCUMENT_PREVIEW}
          onClose={closeModal}
          formValues={docFolderFieldValues}
          slugs={segments}
          createClient={docFolderFieldValues?.createClient}
        />
      )}
    </>
  );

  function closeModal(preserveValues = false, additionalValues = {}) {
    !preserveValues && appDispatch(folderNavigationAction.setOpenModalType(""));
    if (preserveValues) {
      setDocFolderFieldValues({ ...docFolderFieldValues, ...additionalValues });
    } else {
      setDocFolderFieldValues({
        emplacement: { selectedFolder: null, path: new Map() },
        ...additionalValues,
      });
    }
  }

  async function generateAiTemplate(formValues) {
    let res = await getDocumentTemplate(controllerRef.current, {
      language: formValues?.language?.label,
      legal_boundary: formValues?.legalPlayground?.label,
      topic: formValues?.documentTopic,
      context: formValues?.description,
    });
    if (res) {
      saveDocFolderFieldValues({ previewTemplate: res });
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
