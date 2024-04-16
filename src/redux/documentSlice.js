import { documentActions, documentStatus } from "@/constants/enums";
import { createSlice } from "@reduxjs/toolkit";

export const documentSlice = createSlice({
  name: "document",
  initialState: {
    gptQuery: { type: "usedTyped", text: "generate something" },
    editorUpdate: null,
    chatMessages: [
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "Ankit",
      //   text: "chnage it to Clark",
      // },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "bruce wayne",
      //   text: "chnage it to Clark",
      // },
      // { type: "userTyped", text: "generate legal doc" },
      // { type: "loganGpt", text: "generate legal doc" },
      // {
      //   type: "highlighted",
      //   textHiglighted: "Ankit",
      //   text: "chnage it to Clark",
      // },
    ],
    documentLoading: false,
    currentDocument: null,
    activeDocumentAction: documentActions.Draft,
    documentState: documentStatus.Draft,
    currentVersionDocument: null,
    activeVersionDocument: null,
    hoverVersionDocument: null,
    exportDoc: false,
    copiedContent: null,
  },
  reducers: {
    setActiveDocumentAction: (state, action) => {
      return { ...state, activeDocumentAction: action.payload };
    },
    setActiveDocumentState: (state, action) => {
      return { ...state, documentState: action.payload };
    },
    setActiveVersionDocument: (state, action) => {
      return { ...state, activeVersionDocument: action.payload };
    },
    setCurrentDocument: (state, action) => {
      return { ...state, currentDocument: action.payload };
    },
    setCurrentVersionDocument: (state, action) => {
      return { ...state, currentVersionDocument: action.payload };
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
  },
});

export const documentAction = documentSlice.actions;
