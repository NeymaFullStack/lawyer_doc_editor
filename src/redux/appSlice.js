import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: { activeMenuItem: "dashboard" },
  reducers: {
    setCurrentActiveMenu: (state, action) => {
      return { ...state, activeMenuItem: action.payload };
    },
  },
});

export const appAction = appSlice.actions;
