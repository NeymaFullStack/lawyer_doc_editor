export const auth =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaGVlcmFqQHNhYXN1cC5jb20iLCJpZCI6MiwiZXhwIjoxNzE2OTk4MzU2fQ.OuwqvgrJGEufe7UsSN61yIfUYhAEhmse0rJBLNdylWY";

//auth
export const userLoginUrl = "/auth/login";

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
