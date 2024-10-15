import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    activeMenuItem: "dashboard",
    notificationsList: [],
    userDetails: null,
  },
  reducers: {
    setCurrentActiveMenu: (state, action) => {
      return { ...state, activeMenuItem: action.payload };
    },
    setNotificationsList: (state, action) => {
      return { ...state, notificationsList: action.payload };
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const appAction = appSlice.actions;
