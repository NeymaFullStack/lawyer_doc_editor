import { createSlice } from "@reduxjs/toolkit";

export const folderNavigationSlice = createSlice({
  name: "folderNavigation",
  initialState: {
    folderListView: false,
    breadCrumbs: [],
    openModalType: "",
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
  },
});

export const folderNavigationAction = folderNavigationSlice.actions;
