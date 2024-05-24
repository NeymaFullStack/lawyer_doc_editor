"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ToolBar from "./ToolBar";
import Tag from "@/components/generic/Tag";
import { useDispatch, useSelector } from "react-redux";
import { documentActions } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import {
  getDocumentContentByVersionIdUrl,
  getDocumentDataUrl,
} from "@/api/serviceUrl";
import {
  getDocumentContentByVersionId,
  getDocumentData,
  updateDocumentVersionContent,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVersioningAction } from "@/redux/editor/documentVersioningSlice";
import { useParams } from "next/navigation";
import { classIdSpan } from "./extensions/classIdSpan";
import { useCallback, useEffect, useRef } from "react";
import { Fragment } from "prosemirror-model";
import { debounce } from "lodash";

const TiptapEditor = () => {
  const { docId } = useParams();
  const appDispatch = useDispatch();
  const textInsertRef = useRef(false);

  const {
    currentDocumentVersion,
    activeDocumentVersion,
    selectedDocumentVersion,
  } = useSelector((state) => state.documentVersioningReducer);
  const { currentEditVariable } = useSelector(
    (state) => state.documentVariableReducer,
  );

  const {
    copiedContent,
    exportDoc,
    activeDocumentAction,
    documentLoading,
    currentDocument,
    editorUpdate,
  } = useSelector((state) => state.documentReducer);

  const debouncedUpdateContent =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(
      debounce((content, docId, versionId) => {
        updateDocumentVersionContent({
          document_id: docId,
          version_id: versionId,
          content: content,
        });
      }, 3000),
      [],
    );

  const editor = useEditor(
    {
      extensions: [StarterKit, Underline, classIdSpan],
      injectCSS: true,
      autofocus: true,
      editorProps: {
        // handleClick: (view, pos, event) => handleOnClickEditor(editor, pos),
      },
      onSelectionUpdate: handleSelection,
      onUpdate: handleChange,
    },
    [],
  );

  useEffect(() => {
    editor && fetchDocumentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    activeDocumentAction === documentActions.Preview ||
    activeDocumentAction === documentActions.VersionHistory
      ? editor?.setEditable(false)
      : editor?.setEditable(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentAction]);

  useEffect(() => {
    if (activeDocumentVersion) {
      if (
        activeDocumentAction === documentActions.VersionHistory ||
        (activeDocumentAction !== documentActions.VersionHistory &&
          activeDocumentVersion.is_auto_saved !== null)
      ) {
        setEditorContent(activeDocumentVersion?.docContent);
      }
      //   quillRefs.current?.[0]?.editor.container.classList.remove(
      //     "auto-save",
      //     "save",
      //   );
      //   activeDocumentVersion.is_auto_saved !== null &&
      //     quillRefs.current?.[0]?.editor.container.classList.add(
      //       `${activeDocumentVersion.is_auto_saved ? "auto-save" : "save"}`,
      //     );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentVersion]);

  useEffect(() => {
    if (currentDocumentVersion) {
      if (
        selectedDocumentVersion === null ||
        selectedDocumentVersion?.version_id !==
          currentDocumentVersion?.version_id
      ) {
        setEditorContent(currentDocumentVersion?.docContent);
        appDispatch(
          documentVersioningAction.setDocumentVersion({
            activeDocumentVersion: {
              ...currentDocumentVersion,
            },
            selectedDocumentVersion: {
              ...currentDocumentVersion,
            },
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentAction, currentDocumentVersion]);

  useEffect(() => {
    copiedContent !== null && (textInsertRef.current = true);
  }, [copiedContent]);

  useEffect(() => {
    if (editor && currentEditVariable?.previousDefinition) {
      //   editor.commands.replaceTextInNodeWithClassAndValue(
      //     "doc-variable",
      //     currentEditVariable?.previousDefinition,
      //     currentEditVariable?.currentDefinition,
      //   );
      let contenthtml = editor?.getHTML();
      contenthtml = String(contenthtml).replaceAll(
        `>${currentEditVariable?.previousDefinition}<`,
        `>${currentEditVariable?.currentDefinition}<`,
      );
      setEditorContent(String(contenthtml));
      debouncedUpdateContent(
        contenthtml,
        currentDocument.id,
        currentDocumentVersion.version_id,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditVariable]);

  return (
    <div className="logan-tiptap h-full">
      <ToolBar editor={editor} />
      <div className="flex h-[calc(100%-3rem)] w-full flex-col items-center overflow-hidden p-1 pr-3">
        <div className="mt-1 flex w-[90%] items-center  gap-2">
          {activeDocumentAction !== documentActions.Draft && (
            <Tag textColor={"text-primary-blue"} bgColor={"bg-secondary-blue"}>
              Document
            </Tag>
          )}
          <h2 className=" text-lg font-semibold text-black-txt">
            {currentDocument?.document_name || " "}
          </h2>
          {/* <span className="text-xs">28 Pages</span> */}
        </div>
        <div className=" my-2 h-full  w-[90%] overflow-y-scroll  bg-white ">
          {activeDocumentVersion && (
            <EditorContent
              editor={editor}
              className={`min-h-full w-full border-[0.125rem] px-5 py-2  ${activeDocumentAction !== documentActions.VersionHistory && editor?.isFocused ? "border-primary-blue" : ""} ${editor && activeDocumentVersion?.is_auto_saved !== null ? (activeDocumentVersion?.is_auto_saved ? "auto-save" : "save") : ""}`}
            />
          )}
        </div>
      </div>
    </div>
  );

  async function fetchDocumentData() {
    const res = await getDocumentData(`${getDocumentDataUrl}/${docId}`);
    if (res?.id) {
      appDispatch(documentAction.setCurrentDocument(res));
      const verRes = await getDocumentContentByVersionId(
        `${getDocumentContentByVersionIdUrl}${res?.id}/${res?.current_version?.version_id}`,
      );
      if ((verRes, verRes?.content_details?.content)) {
        appDispatch(
          documentVersioningAction.setDocumentVersion({
            currentDocumentVersion: {
              ...verRes,
              docContent: verRes?.content_details?.content,
            },
          }),
        );
        setEditorContent(verRes?.content_details?.content);
      }
    }
  }

  function handleSelection({ editor, transaction }) {
    let pos = transaction?.curSelection?.$from.pos;
    if (copiedContent && textInsertRef.current === true) {
      textInsertRef.current = false;
      const textContent = copiedContent?.content.definition;
      editor.commands.insertContentAt(
        Number(pos),
        `<span id=${copiedContent?.content?.variable} class="doc-variable">${textContent}</span>`,
        { updateSelection: true },
      );
      appDispatch(documentAction.setCopiedContent(null));
    }
  }

  function setEditorContent(content) {
    editor?.commands.setContent(content);
  }

  function handleChange({ editor, transaction }) {
    if (
      currentDocumentVersion &&
      editor.getHTML() !== currentDocumentVersion?.docContent &&
      activeDocumentAction !== documentActions.VersionHistory
    ) {
      appDispatch(
        documentVersioningAction.setDocumentVersion({
          currentDocumentVersion: {
            ...currentDocumentVersion,
            docContent: editor.getHTML(),
          },
        }),
      );

      debouncedUpdateContent(
        editor.getHTML(),
        currentDocument.id,
        currentDocumentVersion.version_id,
      );
    }
  }
};

export default TiptapEditor;
