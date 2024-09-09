import { createSlice } from "@reduxjs/toolkit";

// Enable Map/Set support for Immer
// enableMapSet();

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCommentList } from "@/api/comments";

export const fetchAllComments = createAsyncThunk(
  "comments/fetchAllComments",
  async (docId, { dispatch }) => {
    try {
      const response = await getCommentList(docId);
      dispatch(commentsSlice.actions.setComments(response));
      return response;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
);
export const commentsSlice = createSlice({
  name: "documentIndexing",
  initialState: {
    isAddCommentModalOpen: false,
    selectedTextPosition: null,
    isTextSelected: false,
    comments: [],
  },
  reducers: {
    setIsAddCommentModalOpen: (state, action) => {
      state.isAddCommentModalOpen = action.payload;
    },
    setSelectedTextPosition: (state, action) => {
      state.selectedTextPosition = {
        top: action.payload.top,
        left: action.payload.left,
      };
      state.isTextSelected = action.payload.isTextSelected;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllComments.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllComments.fulfilled, (state, action) => {
          state.loading = false;
          state.comments = action.payload.sort((a, b) =>
            b.comment_id.localeCompare(a.comment_id),
          );
        })
        .addCase(fetchAllComments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  },
});

export const commentsAction = commentsSlice.actions;
