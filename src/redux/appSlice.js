import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

export const appSlice = createSlice({
  name: "app",
  initialState: { activeMenuItem: "dashboard", notificationsList: [] },
  reducers: {
    setCurrentActiveMenu: (state, action) => {
      return { ...state, activeMenuItem: action.payload };
    },
    setNotificationsList: (state, action) => {
      return { ...state, notificationsList: action.payload };
    },
  },
});

export const appAction = appSlice.actions;
