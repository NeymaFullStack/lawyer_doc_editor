import { documentActions, documentStatus } from "@/constants/enums";
import { createSlice } from "@reduxjs/toolkit";
import { object } from "zod";

// export interface CopiedContent {
//   type: string;
//   title: string;
//   index?: number | string;
//   id?: number | string;
// }

// interface documentInitalState {
//   gptQuery: {
//     type: string;
//     text: string;
//   };
//   editorUpdate: null | object;
//   chatMessages: Array<object>;
//   documentLoading: boolean;
//   currentDocument: null | object;
//   activeDocumentAction: string;
//   exportDoc: boolean;
//   copiedContent: CopiedContent | null;
// }

const documentInitalState = {
  gptQuery: { type: "usedTyped", text: "generate something" },
  editorUpdate: null,
  chatMessages: [],
  documentLoading: false,
  currentDocument: null,
  activeDocumentAction: documentActions.Draft,
  exportDoc: false,
  copiedContent: null,
  isEditorToolHidden: true,
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
    setChatMessages: (state, action) => {
      return {
        ...state,
        chatMessages: action.payload,
      };
    },
    initiateEditorUpdate: (state, action) => {
      return { ...state, editorUpdate: action.payload };
    },
    setDocumentLoading: (state, action) => {
      return { ...state, documentLoading: action.payload };
    },
    toggleToolOpen: (state, action) => {
      return { ...state, isEditorToolHidden: !state.isEditorToolHidden };
    },
    resetDocumentSlice: (state, action) => {
      return { ...documentInitalState };
    },
  },
});

export const documentAction = documentSlice.actions;
