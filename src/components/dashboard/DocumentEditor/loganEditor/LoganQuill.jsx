"use client";

import React, { useEffect, useRef, useState } from "react";
import { redoChange, undoChange } from "./customModules/history";
import ReactQuill from "react-quill";
import "quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import { formats } from "./QuillToolbar";

const modules = (id) => {
  return {
    toolbar: {
      formats: formats,
      container: `#toolbar-${id}`,
      handlers: {
        undo: undoChange,
        redo: redoChange,
      },
    },
    // formats: formats,

    history: {
      delay: 500,
      maxStack: 500,
      userOnly: true,
    },
  };
};

function LoganQuill({
  quillId,
  createQuillRefs,
  quillContent,
  handleChange,
  onTextSelection,
}) {
  const quillRef = useRef();
  // console.log("quillContent", quillContent);
  return (
    <ReactQuill
      id={`ql-${quillId}`}
      ref={(ref) => {
        createQuillRefs(ref, quillId - 1);
        quillRef.current = ref;
      }}
      onChangeSelection={onTextSelection}
      onChange={(value, _, source, editor) => {
        value !== quillContent &&
          handleChange(value, quillId - 1, _, source, editor);
      }}
      value={quillContent}
      theme="snow"
      placeholder="Write something..."
      modules={modules(quillId)}
      className="!logan-doc w-full"
    />
  );
}

export default React.memo(LoganQuill);
