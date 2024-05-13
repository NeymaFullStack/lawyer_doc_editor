import { createSlice } from "@reduxjs/toolkit";

export const folderNavigationSlice = createSlice({
  name: "folderNavigation",
  initialState: {
    folderListView: false,
    breadCrumbs: [],
    openModalType: "",
    refreshDirectory: false,
  },
  reducers: {
    toggleFolderView: (state, action) => {
      return { ...state, folderListView: !state.folderListView };
    },
    resetToListView: (state, action) => {
      return { ...state, folderListView: true };
    },
    setBreadCrumbs: (state, action) => {
      return { ...state, breadCrumbs: action.payload };
    },
    setOpenModalType: (state, action) => {
      return { ...state, openModalType: action.payload };
    },
    toggleRefreshDirectory: (state, action) => {
      return { ...state, refreshDirectory: !state.refreshDirectory };
    },
  },
});

export const folderNavigationAction = folderNavigationSlice.actions;
