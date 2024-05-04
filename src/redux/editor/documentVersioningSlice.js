import { createSlice } from "@reduxjs/toolkit";

export const documentVersioningSlice = createSlice({
  name: "documentVersioning",
  initialState: {
    currentDocumentVersion: null,
    activeDocumentVersion: null,
    selectedDocumentVersion: null,
  },
  reducers: {
    setDocumentVersion: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetDocumentVersion: (state, action) => {
      return {
        ...state,
        currentDocumentVersion: null,
        activeDocumentVersion: null,
        selectedDocumentVersion: null,
      };
    },
  },
});

export const documentVersioningAction = documentVersioningSlice.actions;
