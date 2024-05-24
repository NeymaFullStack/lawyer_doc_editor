"use client";
import React, { useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/core";

function useEditor({ element }) {
  const editor = useRef();
  useEffect(() => {
    editor.current = new Editor({
      //   editorProps: {
      //     attributes: { class: "abc" },
      //   },
      element: element,
      extensions: [StarterKit],
      content: "<p>Hello World! 🌎️</p>",
      autofocus: true,
      editable: true,
      injectCSS: false,
    });
  }, [element]);
  return editor.current;
}

export default useEditor;
