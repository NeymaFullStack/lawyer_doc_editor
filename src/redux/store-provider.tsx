"use client";
import React from "react";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
