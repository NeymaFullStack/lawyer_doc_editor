import { createSlice } from "@reduxjs/toolkit";

export const documentVariableSlice = createSlice({
  name: "documentVariable",
  initialState: {
    currentEditVariable: null,
  },
  reducers: {
    setCurrentEditVaraible: (state, action) => {
      return { ...state, currentEditVariable: action.payload };
    },
  },
});

export const documentVariableAction = documentVariableSlice.actions;
