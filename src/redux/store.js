import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./appSlice";
import thunk from "redux-thunk";
import { quillSlice } from "./quillSlice";
import { documentSlice } from "./documentSlice";
import { folderNavigationSlice } from "./folderNavigationSlice";
import { documentVersioningSlice } from "./editor/documentVersioningSlice";
import { documentVariableSlice } from "./editor/documentVariableSlice";
import { documentArticleSlice } from "./editor/documentArticleSlice";

export const store = configureStore({
  reducer: {
    appReducer: appSlice.reducer,
    quillReducer: quillSlice.reducer,
    documentReducer: documentSlice.reducer,
    folderNavigationReducer: folderNavigationSlice.reducer,
    documentVersioningReducer: documentVersioningSlice.reducer,
    documentVariableReducer: documentVariableSlice.reducer,
    documentArticleReducer: documentArticleSlice.reducer,
  },
  middleware: [thunk],
});
