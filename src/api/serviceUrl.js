export const auth =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaGVlcmFqQHNhYXN1cC5haSIsImlkIjoiMzM5NjU3Y2ItYWY4Zi00MDRhLTk3Y2EtZTJmYTFhMjIwODYzIiwiZXhwIjoxNzE1NzA4NTMzfQ.uuVC4ASXS8_L_Cb8Dh6c3W6g3SZrf2C3Fwg0OsXDltwa";

//auth
export const userLoginUrl = "/auth/login";

//app
export const getAllNotificationsUrl = "/notification/all";
export const markAllNotificationSeenUrl = "/notification/all/read";
export const getNewNotificationsUrl = "/notification/listen";

//user
export const getCreateUpdateUserDetailsUrl = "/user";
export const resetPasswordUrl = "/user/password";
export const UpdateNotificationPreferencesUrl = "/notification/preferences";
export const getUserNotificationPreferencesUrl = "/notification/preferences";

// Navigation Dashboard
export const getRecentDocumentsUrl = "/document/recent/list";
export const getClientFoldersListUrl = "/folder/client/all";
export const getBreadCrumbsUrl = "/folder/root/hierarchy";
export const createFolderUrl = "/folder";
export const getFolderDetailsUrl = "/folder";
export const getNavigationSuggestionsUrl = "/search/entities";
export const createClientUrl = "/clients/create";
export const renameFolderUrl = (folderId) => `/folder/${folderId}/rename`;
export const renameDocumentUrl = (documentId) =>
  `/document/${documentId}/rename`;
export const deleteFolderDocUrl = "/project-document/delete";
export const moverFolderDocUrl = "/project-document/move";
export const duplicateDocUrl = "/project-document/duplicate";
export const downloadDocFolderUrl = "/project-document/download";
export const undoFolderDocDeletionUrl = "/project-document/delete/undo";
export const getClientOptionalDetailsUrl = "/clients/project";
export const updateClientOptionalDetailsUrl = (clientId) =>
  `/clients/project/${clientId}/update`;

//chat
export const createConversationUrl = "/chat/conversation";
export const gptChatUrl = `/chat/conversation`;
export const getUSerChatUrl = "/chat/document";

//document
export const getDocumentContentByVersionIdUrl = "/document/";
export const createDocumentUrl = "/document";
export const createImportedDocumentUrl = "/document/imports";
export const getDocumentDataUrl = "/document";
export const getAppendixContnetUrl = "/document/appendix";
export const getDocumentTemplateUrl = "/document/preview";
export const getDocumentVariablesUrl = "/document/variables";
export const getDocumentVersionListsUrl = (documentId) =>
  `/document/${documentId}/version/list`;
export const createNewDocumentVersionUrl = "/document/version/create";
export const updateDocumentVersionContentUrl = "/document/content/save";
export const restoreVersionUrl = "/document/version/restore";
export const exportDocumentPdfUrl = (documentId, documentVersionId) =>
  `/exports/document/${documentId}/${documentVersionId}/pdf`;
export const importDocUrl = "/imports/document";

// comments
export const postCommentUrl = "/comment/create";
export const replyCommentUrl = "/comment/reply";
export const getCommentListUrl = (documentId) =>
  `/comment/document/${documentId}/all`;
export const getArchiveCommentUrl = (commentId) =>
  `/comment/archive/${commentId}`;
