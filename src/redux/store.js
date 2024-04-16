import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./appSlice";
import { chatSlice } from "./chatSlice";
import thunk from "redux-thunk";
import { quillSlice } from "./quillSlice";
import { documentSlice } from "./documentSlice";
import { folderNavigationSlice } from "./folderNavigationSlice";

export const store = configureStore({
  reducer: {
    appReducer: appSlice.reducer,
    quillReducer: quillSlice.reducer,
    documentReducer: documentSlice.reducer,
    folderNavigationReducer: folderNavigationSlice.reducer,
  },
  middleware: [thunk],
});
