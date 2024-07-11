export const documentActions = {
  Draft: "draft",
  VariableTool: "variable",
  PageEdit: "pageEdit",
  VersionHistory: "versionHistory",
  Preview: "preview",
  Reference: "reference",
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
  SubArticle: "subArticle",
  Variable: "variable",
  Definition: "definition",
};
