import { cache } from "react";
import Api from "../apiMethod";
import {
  createDocumentUrl,
  createFolderUrl,
  createImportedDocumentUrl,
  createNewDocumentVersionUrl,
  exportDocumentPdfUrl,
  getAllNotificationsUrl,
  getAppendixContnetUrl,
  getClientFoldersListUrl,
  getDocumentTemplateUrl,
  getDocumentVariablesUrl,
  getDocumentVersionListsUrl,
  getFolderDetailsUrl,
  getRecentDocumentsUrl,
  getUSerChatUrl,
  gptChatUrl,
  importDocUrl,
  markAllNotificationSeenUrl,
  restoreVersionUrl,
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
    const res = await Api.get(markAllNotificationSeenUrl);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getClientFolderList = cache(async () => {
  try {
    const res = await Api.get(getClientFoldersListUrl);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getRecentDocumentList = cache(async () => {
  try {
    const res = await Api.get(getRecentDocumentsUrl);
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

export const CreateConversation =
  (url, queryParams = {}) =>
  async (dispatch) => {
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

export const getDocumentContentByVersionId = async (url, queryParams = {}) => {
  try {
    const res = await Api.get(url);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createFolder = async (queryParams) => {
  try {
    const res = await Api.post(createFolderUrl, queryParams);
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
    return res;
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
