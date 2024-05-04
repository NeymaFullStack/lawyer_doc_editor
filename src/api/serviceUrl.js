export const auth =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraHVzaGFsc2luZ2gxMisxQGdtYWlsLmNvbSIsImlkIjoxLCJleHAiOjE3MTQ4MjI4ODV9.LjYmljcHAq3EVja_eop23RhLkBMN5gy4FkLd2ak6Yuw";

// dashboard

export const createConversationUrl = "/chat/conversation";
export const getClientFoldersListUrl = "/folder/client/all";
export const getFolderDetailsUrl = "/folder";
export const getDocumentContentByVersionIdUrl = "/documents/";
export const createFolderUrl = "/folder";
export const createDocumentUrl = "/documents";
export const getDocumentDataUrl = "/documents";
export const gptChatUrl = `/chat/conversation`;
export const getDocumentTemplateUrl = "/documents/preview";
export const getDocumentVariablesUrl = "/documents/variables";
export const getDocumentVersionListsUrl = (documentId) =>
  `/documents/${documentId}/version/list`;
export const createNewDocumentVersionUrl = "/documents/version/create";
export const updateDocumentVersionContentUrl = "/documents/content/save";
export const getUSerChatUrl = "/chat/document";
