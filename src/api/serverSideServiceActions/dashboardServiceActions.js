import { cache } from "react";
import Api from "../apiMethod";
import { getClientFoldersListUrl, getFolderDetailsUrl } from "../serviceUrl";

export const getClientFolderList = cache(async (auth) => {
  try {
    const res = await Api.get(getClientFoldersListUrl, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getFolderDetails = cache(async ({ id }, auth) => {
  try {
    const res = await Api.get(`${getFolderDetailsUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log("error 123", error);
  }
});

export const getDocumentData = cache(async (url, auth) => {
  try {
    const res = await Api.get(url, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    return res?.data;
  } catch (error) {
    //dispatch action for global error dialog box
    console.log(error);
  }
});
