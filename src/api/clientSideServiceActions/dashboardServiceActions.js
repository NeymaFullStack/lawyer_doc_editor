import { cache } from "react";
import Api from "../apiMethod";
import {
  createClientUrl,
  createDocumentUrl,
  createFolderUrl,
  createImportedDocumentUrl,
  createNewDocumentVersionUrl,
  deleteFolderDocUrl,
  duplicateDocUrl,
  exportDocumentPdfUrl,
  getAllNotificationsUrl,
  getAppendixContnetUrl,
  getBreadCrumbsUrl,
  getClientFoldersListUrl,
  getClientOptionalDetailsUrl,
  getDocumentTemplateUrl,
  getDocumentVariablesUrl,
  getDocumentVersionListsUrl,
  getFolderDetailsUrl,
  getNavigationSuggestionsUrl,
  getRecentDocumentsUrl,
  getUSerChatUrl,
  gptChatUrl,
  importDocUrl,
  markAllNotificationSeenUrl,
  moverFolderDocUrl,
  renameDocumentUrl,
  renameFolderUrl,
  restoreVersionUrl,
  undoFolderDocDeletionUrl,
  updateClientOptionalDetailsUrl,
  updateDocumentVersionContentUrl,
  userLoginUrl,
} from "../serviceUrl";

export const getAllNotifications = cache(async () => {
  try {
    const res = await Api.get(getAllNotificationsUrl);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const markAllNotificationSeen = cache(async () => {
  try {
    Api.put(markAllNotificationSeenUrl);
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getNavigationSuggestions = async (controller, queryParams) => {
  try {
    const res = await Api.get(getNavigationSuggestionsUrl, {
      params: queryParams,
      signal: controller.signal,
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
};

export const getClientFolderList = cache(async () => {
  try {
    const res = await Api.get(getClientFoldersListUrl);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getBreadCrumbs = cache(async (projectId) => {
  try {
    const res = await Api.get(`${getBreadCrumbsUrl}/${projectId}`);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getRecentDocumentList = cache(async (queryParams) => {
  try {
    const res = await Api.get(getRecentDocumentsUrl, { params: queryParams });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getFolderDetails = cache(async ({ id }) => {
  try {
    const res = await Api.get(`${getFolderDetailsUrl}/${id}`);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const CreateConversation = (url) => async () => {
  try {
    const res = await Api.post(url);
    return res;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getDocumentData = cache(async (url) => {
  try {
    const res = await Api.get(url);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
});

export const getDocumentContentByVersionId = async (url) => {
  try {
    const res = await Api.get(url);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getClientOptionalDetails = async (clietFolderId) => {
  try {
    const res = await Api.get(
      `${getClientOptionalDetailsUrl}/${clietFolderId}`,
    );
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const updateClientOptionalDetails = async (
  clietFolderId,
  queryParams,
) => {
  try {
    const res = await Api.put(
      updateClientOptionalDetailsUrl(clietFolderId),
      queryParams,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      },
    );
    return res;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createClient = async (queryParams) => {
  try {
    const res = await Api.post(createClientUrl, queryParams, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    return res?.data?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createFolder = async (queryParams) => {
  try {
    const res = await Api.post(createFolderUrl, queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

//Navigation context menu actions
export const renameFolder = async (folderId, queryParams) => {
  try {
    const res = await Api.put(renameFolderUrl(folderId), queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const renameDocument = async (documentid, queryParams) => {
  try {
    const res = await Api.put(renameDocumentUrl(documentid), queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const deleteFolderDoc = async (queryParams) => {
  try {
    const res = await Api.put(deleteFolderDocUrl, queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const moveFolderDoc = async (queryParams) => {
  try {
    const res = await Api.put(moverFolderDocUrl, queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const undoFolderDocDeletion = async () => {
  try {
    const res = await Api.put(undoFolderDocDeletionUrl);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const duplicateDocument = async (queryParams) => {
  try {
    const res = await Api.post(duplicateDocUrl, queryParams);
    return res.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createDocument = async (isImport, queryParams = {}) => {
  try {
    const res = await Api.post(
      isImport ? createImportedDocumentUrl : createDocumentUrl,
      queryParams,
    );
    return res.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getAppendixContent = async (queryParams = {}) => {
  try {
    const res = await Api.post(getAppendixContnetUrl, queryParams);
    return res.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const importDoc = async (queryParams = {}) => {
  try {
    const res = await Api.post(importDocUrl, queryParams, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    return res?.data?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const chatWithGpt = async (queryParams) => {
  try {
    const res = await Api.post(gptChatUrl, queryParams);
    return res.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getDocumentTemplate = async (controller, queryParams) => {
  try {
    const res = await Api.post(getDocumentTemplateUrl, queryParams, {
      signal: controller.signal,
    });
    return res?.data?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getDocumentVariables = async ({
  documentId,
  documentVersionId,
}) => {
  try {
    const res = await Api.get(
      `${getDocumentVariablesUrl}/${documentId}/${documentVersionId}`,
    );
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const updateDocumentVariables = async (
  { documentId, documentVersionId },
  queryParams,
) => {
  try {
    const res = await Api.put(
      `${getDocumentVariablesUrl}/${documentId}/${documentVersionId}`,
      queryParams,
    );
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getDocumentVersionList = async ({ documentId, queryParams }) => {
  try {
    const res = await Api.get(getDocumentVersionListsUrl(documentId), {
      params: queryParams,
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createNewDocumentVersion = async (queryParams = {}) => {
  try {
    const res = await Api.post(createNewDocumentVersionUrl, queryParams);
    return res?.data?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const updateDocumentVersionContent = async (queryParams = {}) => {
  try {
    const res = await Api.put(updateDocumentVersionContentUrl, queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getUSerChat = async (documentId) => {
  try {
    const res = await Api.get(`${getUSerChatUrl}/${documentId}`);
    return res?.data?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const userLogin = async (queryParams = {}) => {
  try {
    const res = await Api.post(userLoginUrl, queryParams, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const restoreDocumentVersion = async (queryParams = {}) => {
  try {
    const res = await Api.post(restoreVersionUrl, queryParams);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const exportDocumentPdf = async (documentId, documentVersionId) => {
  try {
    const res = await Api.get(
      exportDocumentPdfUrl(documentId, documentVersionId),
    );
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};
