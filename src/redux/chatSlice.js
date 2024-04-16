import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    userQuery: { type: "usedTyped", text: "generate something" },
    chatMessages: [
      { type: "userTyped", text: "generate legal doc" },
      { type: "loganGpt", text: "generate legal doc" },
      {
        type: "highlighted",
        textHiglighted: "bruce wayne",
        text: "chnage it to Clark",
      },
      { type: "userTyped", text: "generate legal doc" },
      { type: "loganGpt", text: "generate legal doc" },
      {
        type: "highlighted",
        textHiglighted: "bruce wayne",
        text: "chnage it to Clark",
      },
      { type: "userTyped", text: "generate legal doc" },
      { type: "loganGpt", text: "generate legal doc" },
      {
        type: "highlighted",
        textHiglighted: "bruce wayne",
        text: "chnage it to Clark",
      },
      {
        type: "highlighted",
        textHiglighted: "bruce wayne",
        text: "chnage it to Clark",
      },
      { type: "userTyped", text: "generate legal doc" },
      { type: "loganGpt", text: "generate legal doc" },
      {
        type: "highlighted",
        textHiglighted: "bruce wayne",
        text: "chnage it to Clark",
      },
      { type: "userTyped", text: "generate legal doc" },
      { type: "loganGpt", text: "generate legal doc" },
      {
        type: "highlighted",
        textHiglighted: "Ankit",
        text: "chnage it to Clark",
      },
    ],
    documentLoading: false,
  },
  reducers: {
    setGptQuery: (state, action) => {
      return { ...state, gptQuery: action.payload };
    },
    updateChatMessages: (state, action) => {
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    },
  },
});

export const chatAction = chatSlice.actions;
