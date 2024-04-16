"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
