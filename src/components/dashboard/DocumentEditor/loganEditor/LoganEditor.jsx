"use client";
import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import LoganQuill from "./LoganQuill";
import { useCallback } from "react";
import {
  documentActions,
  documentStatus,
  gptActionType,
} from "@/constants/enums";
import { quillAction } from "@/redux/quillSlice";
import Tags from "@/components/generic/Tags";
import RemSizeImage from "@/components/generic/RemSizeImage";
import GptSearch from "../documentAction/draftTool/GptSearch";
import ContentSearchToolTip from "../documentAction/ContentSearchToolTip";
import { handleHighlighterChange } from "./customModules/highlighter";
import ToolBars from "./ToolBars";
import { getDocumentContentByVersionIdUrl } from "@/api/serviceUrl";
import { getDocumentContentByVersionId } from "@/api/clientSideServiceActions/dashboardServiceActions";
import useSWR from "swr";
import { documentAction } from "@/redux/documentSlice";
import { editorTextToBeReplaceRegex } from "@/utils/generic";

const LoganEditor = ({ docDetails = null }) => {
  let url = docDetails?.document_versions?.[0]?.version_id
    ? `${getDocumentContentByVersionIdUrl}${docDetails?.id}/${docDetails?.document_versions?.[0]?.version_id}`
    : null;
  const { data, error, isLoading, mutate } = useSWR(
    [url],
    getDocumentContentByVersionId,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );
  const appDispatch = useDispatch();
  const {
    copiedContent,
    exportDoc,
    documentState,
    activeDocumentAction,
    documentLoading,
    currentVersionDocument,
    editorUpdate,
  } = useSelector((state) => state.documentReducer);

  let isDocumentActionDraft =
    activeDocumentAction === documentStatus.Draft ? true : false;

  const { gptHighlighterActive, editorLock } = useSelector(
    (state) => state?.quillReducer?.toolbar,
  );

  let isStatusDraft = documentState === documentStatus.Draft ? true : false;
  const { activeQuillId, gptSearchProperties } = useSelector(
    (state) => state.quillReducer,
  );

  const quillRefs = useRef([]);
  const documentScrollRef = useRef();
  const [visiblePageId, setVisiblePageId] = useState(1);

  const [quillPages, setQuillPages] = useState([
    { id: 1 },
    // { id: 2 },
    // { id: 3 },
    // { id: 4 },
    // { id: 5 },
    // { id: 6 },
    // { id: 7 },
    // { id: 8 },
    // { id: 9 },
    // { id: 10 },
    // { id: 11 },
    // { id: 12 },
    // { id: 13 },
    // { id: 14 },
    // { id: 15 },
    // { id: 16 },
    // { id: 17 },
    // { id: 18 },
    // { id: 19 },
    // { id: 20 },
    // { id: 21 },
    // { id: 22 },
    // { id: 23 },
    // { id: 24 },
    // { id: 25 },
    // { id: 26 },
    // { id: 27 },
    // { id: 28 },
    // { id: 29 },
    // { id: 30 },
    // { id: 31 },
    // { id: 32 },
    // { id: 33 },
    // { id: 34 },
    // { id: 35 },
    // { id: 36 },
    // { id: 37 },
    // { id: 38 },
    // { id: 39 },
    // { id: 40 },
    // { id: 41 },
    // { id: 42 },
    // { id: 43 },
    // { id: 44 },
    // { id: 45 },
    // { id: 46 },
    // { id: 47 },
    // { id: 48 },
    // { id: 49 },
    // { id: 50 },
    // { id: 51 },
    // { id: 52 },
    // { id: 53 },
    // { id: 54 },
    // { id: 55 },
    // { id: 56 },
    // { id: 57 },
    // { id: 58 },
    // { id: 59 },
    // { id: 60 },
    // { id: 61 },
    // { id: 62 },
    // { id: 63 },
    // { id: 64 },
    // { id: 65 },
    // { id: 66 },
    // { id: 67 },
    // { id: 68 },
    // { id: 69 },
    // { id: 70 },
    // { id: 71 },
    // { id: 72 },
    // { id: 73 },
    // { id: 74 },
    // { id: 75 },
    // { id: 76 },
    // { id: 77 },
    // { id: 78 },
    // { id: 79 },
    // { id: 80 },
    // { id: 81 },
    // { id: 82 },
    // { id: 83 },
    // { id: 84 },
    // { id: 85 },
    // { id: 86 },
    // { id: 87 },
    // { id: 88 },
    // { id: 89 },
    // { id: 90 },
    // { id: 91 },
    // { id: 92 },
    // { id: 93 },
    // { id: 94 },
    // { id: 95 },
    // { id: 96 },
    // { id: 97 },
    // { id: 98 },
    // { id: 99 },
    // { id: 100 },
  ]);

  const createQuillRefs = useCallback((ref, index) => {
    quillRefs.current[index] = ref;
  }, []);

  const handleChange = useCallback(
    (value, page) => {
      if (quillRefs?.current?.[0]) {
        quillRefs.current[page].docContent = value;
      }
    },
    [quillRefs],
  );

  const memoizedtextSelctionFunction = useCallback(onTextSelection, [
    gptHighlighterActive,
    gptSearchProperties,
  ]);

  useEffect(() => {
    executeGptChanges();
  }, [editorUpdate]);

  useEffect(() => {
    console.log("data", data);
    if (data && quillRefs?.current?.[0]) {
      appDispatch(
        documentAction.setCurrentVersionDocument({
          ...data,
          versionId: data?.version_id,
          docContent: data?.content_details?.content,
        }),
      );
      appDispatch(
        documentAction.setActiveVersionDocument({
          ...data,
          versionId: data?.version_id,
          docContent: data?.content_details?.content,
        }),
      );
      quillRefs.current[0].docContent = data?.content_details?.content;
      console.log("mine", quillRefs.current[0].docContent);
    }
  }, [data]);

  useEffect(() => {
    if (!isDocumentActionDraft || !isStatusDraft) {
      quillRefs.current[0]?.editor.disable();
    } else {
      quillRefs.current[0]?.editor.enable();
    }
  }, [isDocumentActionDraft, isStatusDraft]);

  useEffect(() => {
    appDispatch(documentAction.setCurrentDocument(docDetails));
    if (typeof window !== undefined) {
      window.addEventListener("click", removeEditorFocus);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("click", removeEditorFocus);
      }
    };
  }, []);

  useEffect(() => {
    quillRefs.current?.[0]?.editor.setSelection(false);
    appDispatch(quillAction.setGptSearchProperties(null));
    quillRefs.current?.[0]?.editor.formatText(
      0,
      quillRefs.current?.[0]?.editor.getText()?.length,
      "highlighter",
      false,
    );
  }, [gptHighlighterActive]);

  useEffect(() => {
    if (activeQuillId !== 0) {
      isStatusDraft &&
        isDocumentActionDraft &&
        quillRefs.current?.[0]?.editor.container.classList.add(
          "focused-border",
        );
    } else {
      quillRefs.current?.[0]?.editor.container.classList.remove(
        "focused-border",
      );
    }
  }, [activeQuillId]);

  // useEffect(() => {
  //   if (activeQuillId !== 0 && activeQuillId !== quillId) {
  //     quillRefs.current?.[0].editor.container.classList.remove(
  //       "focused-border"
  //     );
  //   } else if (activeQuillId !== 0 && activeQuillId === quillId) {
  //     isStatusDraft &&
  //       isDocumentActionDraft &&
  //       quillRefs.current?.[0].editor.container.classList.add("focused-border");
  //   } else {
  //     quillRefs.current?.[0].editor.container.classList.remove(
  //       "focused-border"
  //     );
  //   }
  // }, [activeQuillId]);

  // useEffect(() => {
  //   const wrapper = documentScrollRef.current;
  //   !isDocumentActionDraft && wrapper.addEventListener("scroll", handleScroll);

  //   return () => {
  //     wrapper.removeEventListener("scroll", handleScroll);
  //   };
  // }, [visiblePageId, isDocumentActionDraft]);

  // useEffect(() => {
  //   // console.log(quillRefs?.current[0]);
  //   if (quillRefs?.current?.length > 0) {
  //     quillRefs?.current?.[0].editor.clipboard.addMatcher(
  //       Node.ELEMENT_NODE,
  //       function (node, delta) {
  //         console.log("node", node); // Check if the pasted content contains font sizes
  //         if (
  //           node.parentNode &&
  //           node.parentNode.nodeName === "SPAN" &&
  //           node.parentNode.style.fontSize
  //         ) {
  //           // Extract font size from the parent SPAN element
  //           var fontSize = node.parentNode.style.fontSize;
  //           // Apply font size to the pasted content
  //           delta.ops.forEach(function (op) {
  //             if (op.insert) {
  //               // Apply inline style to the text
  //               op.attributes = { style: "font-size:" + fontSize };
  //             } // if (!op.attributes) {
  //             //   op.attributes = {};
  //             // }
  //             // op.attributes.Size = fontSize;
  //             console.log("op", op);
  //           });
  //         }
  //         console.log("delta", delta);
  //         return delta;
  //       }
  //     );
  //   }
  // }, [quillRefs]);

  return (
    <div className="flex h-full w-full flex-col" aria-label="Editor">
      <ToolBars quillPages={quillPages} visiblePage={visiblePageId} />
      <div className=" flex w-full flex-1 flex-col items-center overflow-hidden p-1 pr-3">
        {copiedContent && (
          <div className="absolute -top-4 right-5">
            <ContentSearchToolTip />
          </div>
        )}
        <div className="mt-1 flex w-[89%] items-center  gap-2">
          {!isStatusDraft ||
            (activeDocumentAction !== documentActions.Draft && (
              <Tags
                textColor={"text-primary-blue"}
                bgColor={"bg-secondary-blue"}
              >
                Document
              </Tags>
            ))}
          <h2 className=" text-lg font-semibold text-black-txt">
            Updated By laws
          </h2>
          {/* <span className="text-xs">28 Pages</span> */}
        </div>
        <div
          ref={documentScrollRef}
          className="my-2 flex w-full flex-1 justify-center overflow-y-scroll p-1 pb-0"
        >
          <div className="relative  h-full w-[90%] gap-2 bg-white">
            {quillPages.map((quill, index) => {
              return (
                <div className="flex h-full w-full flex-col gap-2 " key={index}>
                  {/* <div
                    className={`${
                      activeDocumentAction == documentActions.VersionHistory
                        ? "m-auto"
                        : ""
                    }`}
                  >
                    <span className={"text-xs"}>{`Page ${quill.id}`}</span>
                  </div> */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      !documentLoading &&
                        isStatusDraft &&
                        isDocumentActionDraft;
                      appDispatch(quillAction.setActiveQuillId(quill.id));
                    }}
                    className={
                      "relative h-full w-full  !text-black" +
                      (gptHighlighterActive ? " ql-cus-highlighter " : "")
                    }
                  >
                    <LoganQuill
                      quillId={quill.id}
                      quillContent={
                        quillRefs?.current?.[index]?.docContent || "<p><p>"
                      }
                      onTextSelection={memoizedtextSelctionFunction}
                      handleChange={handleChange}
                      createQuillRefs={createQuillRefs}
                    />

                    {(editorLock ||
                      (gptHighlighterActive && gptSearchProperties)) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation(),
                            gptHighlighterActive && onCloseToolTip();
                        }}
                        className={`absolute bottom-0 left-0 right-0 top-0`}
                      ></div>
                    )}
                    {gptHighlighterActive && gptSearchProperties && (
                      <div
                        style={{
                          top: gptSearchProperties.top,
                          left: gptSearchProperties.left,
                        }}
                        className={`absolute`}
                      >
                        <GptSearch isTooltip onCloseToolTip={onCloseToolTip} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {documentLoading && (
              <div
                className={`absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-white opacity-[0.5]`}
              >
                <RemSizeImage
                  imagePath={"/assets/icons/loader.svg"}
                  remWidth={3.875}
                  remHeight={3.875}
                  alt={"Loader"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // function handleScroll() {
  //   const wrapper = documentScrollRef.current;
  //   const wrapperRect = wrapper.getBoundingClientRect();
  //   const wrapperHeight = wrapperRect.height;

  //   const pages = quillRefs.current;
  //   const halfVisibleHeight = wrapperHeight / 2;

  //   let visiblePage = visiblePageId;

  //   for (let i = 0; i < pages.length; i++) {
  //     const page = pages[i];
  //     const pageRect = page.editingArea.getBoundingClientRect();
  //     const pageTop = pageRect.top - wrapperRect.top;
  //     const pageBottom = pageTop + pageRect.height;

  //     if (pageTop <= halfVisibleHeight && pageBottom >= halfVisibleHeight) {
  //       visiblePage = i + 1;
  //       break;
  //     }
  //   }

  //   visiblePage !== visiblePageId && setVisiblePageId(visiblePage);
  // }

  function onCloseToolTip() {
    appDispatch(quillAction.setGptSearchProperties(null));
    quillRefs.current?.[0]?.editor.formatText(
      gptSearchProperties?.range.index,
      gptSearchProperties?.range.length,
      "highlighter",
      false,
    );
    quillRefs.current?.[0]?.editor.setSelection(false);
  }

  function onTextSelection(range, source, editor) {
    if (
      range?.length > 0 &&
      gptHighlighterActive &&
      JSON.stringify(range) !== JSON.stringify(gptSearchProperties?.range)
    ) {
      handleHighlighterChange.call(quillRefs.current[0]);
      let gptleftPosition = 15;
      let { top, left, right, bottom, height } = editor.getBounds(range);
      if (left >= 240) {
        gptleftPosition = left - 240;
      }
      if (608 - left <= 240) {
        gptleftPosition = 608 - 465;
      }
      appDispatch(
        quillAction.setGptSearchProperties({
          top: top + height + 15,
          left: gptleftPosition,
          range,
        }),
      );
    }
  }

  function removeEditorFocus() {
    !documentLoading && appDispatch(quillAction.setActiveQuillId(0));
    quillRefs.current?.[0]?.editor.formatText(
      0,
      quillRefs.current?.[0]?.editor.getText()?.length,
      "highlighter",
      false,
    );
    gptSearchProperties !== null &&
      appDispatch(quillAction.setGptSearchProperties(null));
  }

  function executeGptChanges() {
    if (editorUpdate?.action === gptActionType.Update) {
      if (editorUpdate.index > 0 && editorUpdate?.update_with) {
        let textToUpdate = editorTextToBeReplaceRegex.exec(
          editorUpdate?.content,
        )?.[1];

        quillRefs.current?.[0]?.editor?.deleteText(
          editorUpdate?.index,
          textToUpdate?.length,
        );
        quillRefs.current?.[0]?.editor?.insertText(
          editorUpdate?.index,
          editorUpdate.update_with,
        );
        appDispatch(
          documentAction.updateChatMessages({
            type: "loganGpt",
            text: textToUpdate,
          }),
        );
        appDispatch(documentAction.setDocumentLoading(false));
      } else {
        appDispatch(
          documentAction.updateChatMessages({
            type: "loganGpt",
            text: editorUpdate?.content,
          }),
        );
        appDispatch(documentAction.setDocumentLoading(false));
      }
    } else if (
      editorUpdate?.action === gptActionType.Explain ||
      editorUpdate?.content
    ) {
      appDispatch(
        documentAction.updateChatMessages({
          type: "loganGpt",
          text: editorUpdate?.content,
        }),
      );
      appDispatch(documentAction.setDocumentLoading(false));
    }

    // let timerId = setTimeout(() => {
    //   appDispatch(documentAction.setDocumentLoading(false));
    // }, [3000]);
    // debugger;
    return () => {
      clearTimeout(timerId);
    };
  }
  function onContentLoad(content) {}
};

export default React.memo(LoganEditor);
