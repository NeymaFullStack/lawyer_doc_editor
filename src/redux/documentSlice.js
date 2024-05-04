import { documentActions, documentStatus } from "@/constants/enums";
import { createSlice } from "@reduxjs/toolkit";

const documentInitalState = {
  gptQuery: { type: "usedTyped", text: "generate something" },
  editorUpdate: null,
  chatMessages: [],
  documentLoading: false,
  currentDocument: null,
  activeDocumentAction: documentActions.Draft,
  exportDoc: false,
  copiedContent: null,
};

export const documentSlice = createSlice({
  name: "document",
  initialState: { ...documentInitalState },
  reducers: {
    setActiveDocumentAction: (state, action) => {
      return {
        ...state,
        activeDocumentAction: action.payload,
        copiedContent: null,
      };
    },
    setCurrentDocument: (state, action) => {
      return { ...state, currentDocument: action.payload };
    },

    setExportDoc: (state, action) => {
      return { ...state, exportDoc: !state.exportDoc };
    },
    setCopiedContent: (state, action) => {
      return { ...state, copiedContent: action.payload };
    },
    setGptQuery: (state, action) => {
      return { ...state, gptQuery: action.payload };
    },

    updateChatMessages: (state, action) => {
      return {
        ...state,
        chatMessages: [...state.chatMessages, ...action.payload],
      };
    },
    initiateEditorUpdate: (state, action) => {
      return { ...state, editorUpdate: action.payload };
    },
    setDocumentLoading: (state, action) => {
      return { ...state, documentLoading: action.payload };
    },
    resetDocumentSlice: (state, action) => {
      return { ...documentInitalState };
    },
  },
});

export const documentAction = documentSlice.actions;
