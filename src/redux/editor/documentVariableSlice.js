import { createSlice } from "@reduxjs/toolkit";

export const documentVariableSlice = createSlice({
  name: "documentVariable",
  initialState: {
    currentEditVariable: null,
    variableList: [],
  },
  reducers: {
    setCurrentEditVaraible: (state, action) => {
      return { ...state, currentEditVariable: action.payload };
    },
    setVariableList: (state, action) => {
      return { ...state, variableList: action.payload };
    },
  },
});

export const documentVariableAction = documentVariableSlice.actions;
