"use client";
import React, { useEffect, useRef } from "react";
import GptSearch from "./GptSearch";
import LoganInstructions from "./LoganInstructions";
import { useSelector } from "react-redux";
import LoganUserChat from "./LoganUserChat";

function LoganChatBox() {
  const chatMessages = useSelector(
    (state) => state.documentReducer.chatMessages
  );

  return (
    <div
      className="flex flex-col flex-1 bg-white overflow-hidden"
      aria-label="Logan ChatGpt"
    >
      <h2 className="text-primary-gray font-semibold text-sm border-b-[0.063rem] border-secondary-blue h-[3.3rem] flex items-center px-[0.8rem]">
        Chat with Logan
      </h2>
      <div className="flex-1 pr-[0.14rem] bg-two rounded-xl text-[0.7rem] overflow-hidden">
        <div
          className={
            "h-full px-[0.8rem] overflow-y-scroll " +
            (chatMessages.length > 0 ? "pl-0" : "pl-2 pt-2")
          }
        >
          {chatMessages.length > 0 ? <LoganUserChat /> : <LoganInstructions />}
        </div>
      </div>
      <GptSearch />
    </div>
  );
}

export default LoganChatBox;
