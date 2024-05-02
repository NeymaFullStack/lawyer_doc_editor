import { documentActions, documentStatus } from "@/constants/enums";
import { createSlice } from "@reduxjs/toolkit";

export const documentSlice = createSlice({
  name: "document",
  initialState: {
    gptQuery: { type: "usedTyped", text: "generate something" },
    editorUpdate: null,
    chatMessages: [],
    documentLoading: false,
    currentDocument: null,
    activeDocumentAction: documentActions.Draft,
    // documentState: documentStatus.Draft,
    currentDocumentVersion: null,
    activeDocumentVersion: null,
    selectedDocumentVersion: null,
    exportDoc: false,
    copiedContent: null,
  },
  reducers: {
    setActiveDocumentAction: (state, action) => {
      return {
        ...state,
        activeDocumentAction: action.payload,
        copiedContent: null,
      };
    },
    setActiveDocumentState: (state, action) => {
      return { ...state, documentState: action.payload };
    },
    setDocumentVersion: (state, action) => {
      return { ...state, ...action.payload };
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
        chatMessages: [...state.chatMessages, action.payload],
      };
    },
    initiateEditorUpdate: (state, action) => {
      return { ...state, editorUpdate: action.payload };
    },
    setDocumentLoading: (state, action) => {
      return { ...state, documentLoading: action.payload };
    },
    setDocumentStateByKeys(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const documentAction = documentSlice.actions;
