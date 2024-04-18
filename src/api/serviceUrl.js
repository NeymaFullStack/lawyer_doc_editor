export const auth =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraHVzaGFsc2luZ2gxMisxQGdtYWlsLmNvbSIsImlkIjoxLCJleHAiOjE3MTMzODA2NTN9.KZ3d1AyeBLAmKD2yI2W8M83vnVa5jkBHKHqVTDgxFmE";

// dashboard

export const createConversationUrl = "/chat/conversation";
export const getClientFoldersListUrl = "/folder/client/all";
export const getFolderDetailsUrl = "/folder";
export const getDocumentContentByVersionIdUrl = "/documents/";
export const createFolderUrl = "/folder";
export const createDocumentUrl = "/documents";
export const getDocumentDataUrl = "/documents";
export const gptChatUrl = (versionId) => {
  return `/chat/conversation/${versionId}/messages/prompt`;
};
export const getDocumentTemplateUrl = "/documents/preview";
export const getDocumentVariablesUrl = "/documents/variables";
