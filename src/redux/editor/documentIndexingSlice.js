import { createSlice } from "@reduxjs/toolkit";

export const documentIndexingSlice = createSlice({
  name: "documentIndexing",
  initialState: {
    articleList: [],
    newAppendixState: null,
    reorderAppendixState: null,
    collapsibleListOpenState: null,
    deleteAppendixState: null,
  },
  reducers: {
    setArticlesList: (state, action) => {
      return { ...state, articleList: action.payload };
    },
    setNewAppendixState: (state, action) => {
      return {
        ...state,
        newAppendixState: { ...state.newAppendixState, ...action.payload },
      };
    },
    setDeleteAppendixState: (state, action) => {
      return {
        ...state,
        deleteAppendixState: action.payload,
      };
    },
    resetNewAppendixState: (state, action) => {
      return {
        ...state,
        newAppendixState: null,
      };
    },
    setReorderAppendixState: (state, action) => {
      return { ...state, reorderAppendixState: action.payload };
    },
    setCollapsibleListOpenState: (state, action) => {
      return { ...state, collapsibleListOpenState: action.payload };
    },

    setAppendixInsertionContent: (state, action) => {
      return {
        ...state,
        newAppendixState: {
          ...state.newAppendixState,
          content: action.payload,
        },
      };
    },
  },
});

export const documentIndexingAction = documentIndexingSlice.actions;
