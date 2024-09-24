import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./appSlice";
import thunk from "redux-thunk";
import { quillSlice } from "./quillSlice";
import { documentSlice } from "./documentSlice";
import { folderNavigationSlice } from "./folderNavigationSlice";
import { documentVersioningSlice } from "./editor/documentVersioningSlice";
import { documentVariableSlice } from "./editor/documentVariableSlice";
import { documentIndexingSlice } from "./editor/documentIndexingSlice";
import { commentsSlice } from "./editor/commentsSlice";

export const store = configureStore({
  reducer: {
    appReducer: appSlice.reducer,
    quillReducer: quillSlice.reducer,
    documentReducer: documentSlice.reducer,
    folderNavigationReducer: folderNavigationSlice.reducer,
    documentVersioningReducer: documentVersioningSlice.reducer,
    documentVariableReducer: documentVariableSlice.reducer,
    documentIndexingReducer: documentIndexingSlice.reducer,
    commentsReducer: commentsSlice.reducer,
  },
  middleware: [thunk],
});

// export type RootState = ReturnType<typeof store.getState>;
