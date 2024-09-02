import { socket } from "@/api/socket";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useRef } from "react";
import parse from "html-react-parser";

function LoganUserChat() {
  const { chatMessages, documentLoading, gptQuery } = useSelector(
    (state) => state.documentReducer,
  );
  const [isConnected, setIsConnected] = useState(socket.connected);

  const lastMessageRef = useRef();
  useEffect(() => {
    let timeoutId;
    if (lastMessageRef.current) {
      timeoutId = setTimeout(() => {
        /// if this cause any issue in future then inside loganUserChat in createChatMessage Function convert RemImages to notmal image tag
        lastMessageRef?.current?.scrollIntoView({
          behavior: "auto",
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
    <ul className="flex min-h-full flex-col justify-end border-r-[0.063rem]">
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
          <div className="flex items-center gap-5 bg-six px-8 py-4">
            <RemSizeImage
              imagePath={"/assets/icons/chat-star.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"Logan Gpt"}
            />
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
      // case "user":
      //   return (
      //     <div className="flex items-center gap-5 bg-two px-8 py-4">
      //       <RemSizeImage
      //         imagePath={"/assets/icons/msg-usexr.svg"}
      //         remWidth={1.751}
      //         remHeight={1.751}
      //         alt={"User"}
      //       />

      //       <p>{message?.text}</p>
      //     </div>
      //   );
      case "USER":
        return (
          <div className="flex items-start gap-5 bg-two px-8 py-4 text-black">
            <RemSizeImage
              imagePath={"/assets/icons/user-img.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"User"}
            />

            {message?.highlighted_text ? (
              <div className="flex flex-col">
                <span className=" flex w-fit items-center gap-2 rounded-2xl  bg-highlight px-2">
                  <RemSizeImage
                    imagePath={"/assets/icons/msg-highlighter.svg"}
                    remWidth={0.611}
                    remHeight={0.633}
                    alt={"User"}
                  />

                  <span className="text-black-txt">
                    {message?.highlighted_text}
                  </span>
                </span>
                <p className="ml-3  mt-1 border-l-[0.063rem] pl-3  text-justify text-black-txt">
                  {message?.message}
                </p>
              </div>
            ) : (
              <p className="text-justify text-black-txt">{message?.message}</p>
            )}
          </div>
        );
      case "LOGAN_AI":
        return (
          <div className="flex items-start gap-5 bg-six px-8 py-4 ">
            <RemSizeImage
              imagePath={"/assets/icons/chat-star.svg"}
              remWidth={1.751}
              remHeight={1.751}
              alt={"Logan Gpt"}
            />
            <div className="lt-ai-chat text-justify !text-black-txt">
              {parse(message?.message)}
            </div>
          </div>
        );
    }
  }
}

export default React.memo(LoganUserChat);
