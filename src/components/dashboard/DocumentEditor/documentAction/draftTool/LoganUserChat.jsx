import { socket } from "@/api/socket";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useRef } from "react";

function LoganUserChat() {
  const { chatMessages, documentLoading, gptQuery } = useSelector(
    (state) => state.documentReducer
  );
  const [isConnected, setIsConnected] = useState(socket.connected);

  const lastMessageRef = useRef();
  useEffect(() => {
    let timeoutId;
    if (lastMessageRef.current) {
      timeoutId = setTimeout(() => {
        /// if this cause any issue in future then inside loganUserChat in createChatMessage Function convert RemImages to notmal image tag
        lastMessageRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // Adjust the delay as needed
    }

    return () => clearTimeout(timeoutId);
  }, [chatMessages]);

  useEffect(() => {
    // gptQuery?.length > 0 &&
    //   setMessages(() => [...prev, { text: gptQuery, type: "sender" }]);
  }, [gptQuery]);

  // useEffect(() => {
  //   socket.connect();
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("message", onChatStream);
  //   socket.on("stream", onChatStream);
  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("stream", onChatStream);
  //     socket.off("message", onChatStream);
  //   };
  // }, [socket]);

  return (
    <ul className="border-r-[0.063rem] min-h-full flex flex-col justify-end">
      {chatMessages.map((message, index) => {
        return (
          <li
            ref={index === chatMessages.length - 1 ? lastMessageRef : null}
            key={index}
          >
            {createChatMessage(message)}
          </li>
        );
      })}
      {documentLoading && (
        <li ref={lastMessageRef}>
          <div className="bg-six px-8 py-4 flex gap-5 items-center">
            <RemSizeImage
              imagePath={"/assets/icons/chat-star.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"Logan Gpt"}
            />
            {/* <Image
              src={"/assets/icons/chat-star.svg"}
              height={28.01}
              width={28.01}
              alt="Logan Gpt"
            /> */}
            <RemSizeImage
              imagePath={"/assets/images/processing-msg.svg"}
              remWidth={5.375}
              remHeight={1.563}
              alt={"Processing"}
            />
          </div>
        </li>
      )}
    </ul>
  );

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function onChatStream(data) {
    setMessages(() => [...prev, { text: data, type: "receiver" }]);
  }

  function createChatMessage(message) {
    switch (message?.type) {
      case "userTyped":
        return (
          <div className="bg-two px-8 py-4 flex gap-5 items-center">
            <RemSizeImage
              imagePath={"/assets/icons/msg-user.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"User"}
            />

            <p>{message.text}</p>
          </div>
        );
      case "loganGpt":
        return (
          <div className="bg-six px-8 py-4 flex gap-5 items-start">
            <RemSizeImage
              imagePath={"/assets/icons/chat-star.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"Logan Gpt"}
            />
            <p>{message.text}</p>
          </div>
        );
      case "highlighted":
        return (
          <div className="bg-two px-8 py-4 flex gap-5 items-start">
            <RemSizeImage
              imagePath={"/assets/icons/msg-user.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"User"}
            />

            <div>
              <p className="flex items-center gap-1 bg-highlight px-2 rounded-2xl">
                <RemSizeImage
                  imagePath={"/assets/icons/msg-highlighter.svg"}
                  remWidth={0.611}
                  remHeight={0.633}
                  alt={"User"}
                />

                <span>{message.textHiglighted}</span>
              </p>
              <p className="pt-2 ml-4 pl-2 border-l-[0.063rem]">
                {message.text}
              </p>
            </div>
          </div>
        );
    }
  }
}

export default React.memo(LoganUserChat);
