"use client";
import React, { useEffect } from "react";
import GptSearch from "./GptSearch";
import LoganInstructions from "./LoganInstructions";
import { useDispatch, useSelector } from "react-redux";
import LoganUserChat from "./LoganUserChat";
import { getUSerChat } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentAction } from "@/redux/documentSlice";

function LoganChatBox() {
  const appDispatch = useDispatch();
  const { chatMessages, currentDocument } = useSelector(
    (state) => state.documentReducer,
  );

  useEffect(() => {
    currentDocument?.id && fetchUserChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocument]);
  // console.log("current document", currentDocument?.id);
  return (
    <div
      className="flex flex-1 flex-col overflow-hidden bg-white"
      aria-label="Logan ChatGpt"
    >
      <h2 className="flex h-[2.997rem] items-center rounded-tr-lg border-b-[0.063rem] border-secondary-blue px-[0.8rem] text-sm font-semibold text-primary-gray">
        AI Chat
      </h2>
      <div className="flex-1 overflow-hidden  bg-two pr-[0.14rem] text-[0.7rem]">
        <div
          className={
            "h-full overflow-y-scroll px-[0.8rem] " +
            (chatMessages?.length > 0 ? "pl-0" : "pl-2 pt-2")
          }
        >
          {chatMessages?.length > 0 ? <LoganUserChat /> : <LoganInstructions />}
        </div>
      </div>
      <GptSearch />
    </div>
  );

  async function fetchUserChat() {
    let chatRes = await getUSerChat(currentDocument.id);
    if (chatRes.length > 0) {
      appDispatch(documentAction.setChatMessages(chatRes));
    } else if (chatMessages.length > 0) {
      appDispatch(documentAction.setChatMessages([]));
    }
  }
}

export default LoganChatBox;
