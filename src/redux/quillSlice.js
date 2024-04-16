import { createSlice } from "@reduxjs/toolkit";

export const quillSlice = createSlice({
  name: "quill",
  initialState: {
    toolbar: {
      editorLock: false,
      gptHighlighterActive: false,
      undo: false,
      redo: false,
    },
    activeQuillId: 0,
    blurredActiveQuillId: 1,
    gptSearchProperties: null,
  },
  reducers: {
    setToolbarActiveFormat: (state, action) => {
      return { ...state, toolbar: { ...state?.toolbar, ...action.payload } };
    },
    setGptSearchProperties: (state, action) => {
      return { ...state, gptSearchProperties: action.payload };
    },
    setActiveQuillId: (state, action) => {
      return {
        ...state,
        activeQuillId: action.payload,
        blurredActiveQuillId:
          action.payload !== 0 ? action.payload : state.blurredActiveQuillId,
      };
    },
  },
});

export const quillAction = quillSlice.actions;
