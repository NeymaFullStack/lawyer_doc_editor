import { createSlice } from "@reduxjs/toolkit";

export const documentVariableSlice = createSlice({
  name: "documentVariable",
  initialState: {
    editVaraibleId: null,
  },
  reducers: {
    setEditVaraibleId: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const documentVariableAction = documentVariableSlice.actions;
