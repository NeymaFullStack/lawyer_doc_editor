"use client";
import {
  CreateConversation,
  chatWithGpt,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { documentAction } from "@/redux/documentSlice";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

let recognition;
if (typeof window !== "undefined") {
  recognition = new (window.webkitSpeechRecognition ||
    window.SpeechRecognition)();
  recognition.lang = "en-US";
}

function GptSearch({ isTooltip = false, onCloseToolTip }) {
  const appDispatch = useDispatch();
  const [chatQuery, setChatQuery] = useState("");
  const [listening, setListening] = useState(false);
  const { gptSearchProperties } = useSelector((state) => state.quillReducer);
  const { documentLoading, currentDocument } = useSelector(
    (state) => state.documentReducer,
  );
  const { currentDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );

  const handleResult = useCallback((event) => {
    const transcript = event.results[0][0].transcript;
    setChatQuery(transcript);
    // appDispatch(documentAction.setGptQuery(transcript));
  }, []);

  const startListening = useCallback(() => {
    setListening(true);
    recognition.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    setListening(false);
    recognition.stop();
  }, [recognition]);

  useEffect(() => {
    recognition.onend = stopListening;
    recognition.onresult = handleResult;

    return () => {
      recognition.onend = null;
      recognition.onresult = null;
      recognition.stop();
    };
  }, [recognition, startListening, stopListening, handleResult]);

  return (
    <div
      className={
        "bg-two p-2 " +
        (isTooltip ? "w-full rounded-lg shadow-out-lg" : "border-t-[1px]  px-4")
      }
      aria-label="Chat Field"
    >
      <div className="flex gap-2">
        {isTooltip && (
          <button onClick={onCloseToolTip}>
            <RemSizeImage
              imagePath={"/assets/icons/cross-icon.svg"}
              remWidth={1.25}
              remHeight={1.125}
              alt={"Close"}
            />
            {/* <Image
              src={"/assets/icons/cross-icon.svg"}
              width={20}
              height={20}
              alt="Send Button"
            /> */}
          </button>
        )}
        <button onClick={listening ? stopListening : startListening}>
          <RemSizeImage
            imagePath={"/assets/icons/mike-icon.svg"}
            remWidth={isTooltip ? 2 : 2.5}
            remHeight={isTooltip ? 2 : 2.5}
            alt={"Mike"}
          />
        </button>
        <div
          className={
            " flex flex-1 items-center gap-2 rounded-lg bg-six px-3 " +
            (!isTooltip ? "h-[2.5rem]" : "h-[2rem]")
          }
        >
          <input
            disabled={documentLoading}
            autoComplete="off"
            autoFocus
            value={chatQuery}
            type="text"
            className={
              " h-[100%] flex-1 bg-six px-3 pl-1 text-xs outline-none "
            }
            onChange={(e) => {
              setChatQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSendQuery();
              }
            }}
          />
          <div className="flex h-full w-[1rem] items-center gap-3">
            <button onClick={onSendQuery}>
              {chatQuery.length > 0 && (
                <RemSizeImage
                  imagePath={
                    isTooltip
                      ? "/assets/icons/right-tick.svg"
                      : "/assets/icons/send-icon.svg"
                  }
                  remWidth={1.173}
                  remHeight={1.082}
                  alt={"Send Button"}
                />
              )}
            </button>
          </div>
        </div>

        {/* <Image
            onClick={listening ? stopListening : startListening}
            className=" cursor-pointer"
            src={"/assets/icons/mike-icon.svg"}
            width={32}
            height={32}
            alt="Highlighter"
          /> */}
      </div>
    </div>
  );

  async function onSendQuery() {
    // appDispatch(CreateConversation(createConversationUrl));
    appDispatch(
      documentAction.updateChatMessages([
        {
          type: "USER",
          message: chatQuery,
          highlighted_text: gptSearchProperties?.highlighted_text,
        },
      ]),
    );
    debugger;
    if (currentDocumentVersion?.version_id && chatQuery) {
      appDispatch(documentAction.setDocumentLoading(true));
      const { data: gptRes } = await chatWithGpt({
        document_id: currentDocument?.id,
        message: chatQuery,
        highlighted_text: gptSearchProperties?.highlighted_text,
      });
      if (gptRes) {
        debugger;
        setChatQuery("");
        appDispatch(
          documentAction.updateChatMessages([
            {
              type: "LOGAN_AI",
              message: gptRes.message,
            },
          ]),
        );
        appDispatch(documentAction.setDocumentLoading(false));
      }
    }
  }
}

export default GptSearch;
