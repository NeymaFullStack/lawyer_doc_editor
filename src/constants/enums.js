export const documentActions = {
  Draft: "draft",
  VariableTool: "variable",
  PageEdit: "pageEdit",
  VersionHistory: "versionHistory",
  Preview: "preview",
  Reference: "reference",
  ToolToggle: "tootleToggle",
  Comments: "comments",
};

export const documentStatus = {
  Draft: "draft",
  Finalized: "finalized",
  Current: "current",
};

export const copiedContentType = {
  Variable: "variable",
  Appendix: "appendix",
  Article: "article",
  Company: "company",
  SubArticle: "subArticle",
};

export const gptActionType = {
  Update: "update",
  Explain: "explain",
};

export const versionHistoryFilter = {
  all: "All Versions",
  manualSaved: "Manually Saved Versions",
  autoSaved: "Auto Saved Versions",
};

export const articleInsertionType = {
  article: "Article",
  subArticle: "Sub-Article",
  nestedList: "Sub-Article",
};

export const tagInsertionType = {
  Article: "article",
  Appendix: "appendix",
  SubArticle: "subArticle",
  Variable: "variable",
  Definition: "definition",
};

export const documentType = {
  document: "Document",
  appendix: "Appendix",
};

export const indexingManipulationTypes = {
  ADDITEM: "addItem",
  DELETEINPUT: "deleteInput",
  DELETE: "delete",
  ADDARTICLE: "addArticle",
};

export const navigationItemTypes = {
  CLIENT: "CLIENT",
  FOLDER: "FOLDER",
  DOCUMENT: "DOCUMENT",
};

export const navigationSelectionItemsArea = {
  RECENT_DOCUMENTS: "RECENT_DOCUMENTS",
  FOLDERS: "FOLDERS",
  DOCUMENTS: "DOCUMENTS",
  TABLE: "TABLE",
};
