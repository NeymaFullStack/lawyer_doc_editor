import Api from "../apiMethod";
import {
  createDocumentUrl,
  createFolderUrl,
  getClientFoldersListUrl,
  getDocumentTemplateUrl,
  getDocumentVariablesUrl,
} from "../serviceUrl";

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

export const getDocumentContentByVersionId = async (url, queryParams = {}) => {
  try {
    const res = await Api.get(url[0]);
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createFolder = async (queryParams) => {
  try {
    const res = await Api.post(createFolderUrl, queryParams);
    return res;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const createDocument = async (queryParams = {}) => {
  try {
    const res = await Api.post(createDocumentUrl, queryParams);
    return res.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const uploadDocument = async (url, queryParams = {}) => {
  try {
    const res = await Api.post(url, queryParams, {
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

export const chatWithGpt = async (url, queryParams) => {
  try {
    const res = await Api.post(url, queryParams);
    return res;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
};

export const getDocumentTemplate = async (queryParams) => {
  try {
    const res = await Api.post(getDocumentTemplateUrl, queryParams);
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
