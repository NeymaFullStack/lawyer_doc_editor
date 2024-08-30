"use client";
import {
  CreateConversation,
  chatWithGpt,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { documentAction } from "@/redux/documentSlice";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const textareaRef = useRef(null);

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
        "flex gap-2 bg-two p-2 py-2" +
        (isTooltip
          ? "w-full rounded-lg shadow-out-lg"
          : " border-t-[1px]  px-2")
      }
      aria-label="Chat Field"
    >
      {isTooltip && (
        <button onClick={onCloseToolTip}>
          <RemSizeImage
            imagePath={"/assets/icons/cross-icon.svg"}
            remWidth={1.25}
            remHeight={1.125}
            alt={"Close"}
          />
        </button>
      )}
      <button
        onClick={listening ? stopListening : startListening}
        className="mb-auto"
      >
        <RemSizeImage
          imagePath={"/assets/icons/mike-icon.svg"}
          remWidth={isTooltip ? 2 : 2.5}
          remHeight={isTooltip ? 2 : 2.5}
          alt={"Mike"}
        />
      </button>
      <div
        className={"flex flex-1 items-center gap-2 rounded-lg bg-six px-3 py-1"}
      >
        <textarea
          name={"query"}
          disabled={documentLoading}
          autoComplete="off"
          autoFocus
          ref={textareaRef}
          value={chatQuery}
          className={
            "flex-1  bg-six px-2 pl-1 text-xs  text-black-txt outline-none " +
            (!isTooltip
              ? "h-[1rem] max-h-[8rem] resize-none overflow-hidden"
              : "h-[2.5rem]")
          }
          style={{ overflowY: "16px", minHeight: "16px" }}
          onChange={(e) => {
            setChatQuery(e.target.value);
            // e.target.style.height = "auto"; // Reset the height
            e.target.style.height = "1rem";
            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on scrollHeight
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              !documentLoading && onSendQuery();
              setChatQuery("");
            }
          }}
        />

        <div className="flex h-full w-[1rem] items-center gap-3">
          <button
            onClick={() => {
              !documentLoading && onSendQuery();
              setChatQuery("");
            }}
          >
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
    if (currentDocumentVersion?.version_id && chatQuery) {
      appDispatch(documentAction.setDocumentLoading(true));
      const { data: gptRes } = await chatWithGpt({
        document_id: currentDocument?.id,
        message: chatQuery,
        highlighted_text: gptSearchProperties?.highlighted_text,
      });
      if (gptRes?.message) {
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
      } else {
        appDispatch(documentAction.setDocumentLoading(false));
      }
    }
  }
}

export default GptSearch;
