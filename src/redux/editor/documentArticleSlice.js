import { createSlice } from "@reduxjs/toolkit";

export const documentArticleSlice = createSlice({
  name: "documentArticle",
  initialState: {
    articleList: [],
  },
  reducers: {
    setArticlesList: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const documentArticleAction = documentArticleSlice.actions;
