"use client";
import React from "react";
import { Quill } from "react-quill";
import { highlighter } from "./customModules/highlighter";
import { useDispatch, useSelector } from "react-redux";
import { quillAction } from "@/redux/quillSlice";
import "quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import { documentActions } from "@/constants/enums";
import RemSizeImage from "@/components/generic/RemSizeImage";

export class CustomModule {
  constructor(quill) {
    this.quill = quill;

    // Intercept text-change event
    this.quill.on("editor-change", this.handleEditorChange.bind(this));
  }

  // Custom handler for text-change event
  handleEditorChange(eventType) {
    // Check if the editor is being initialized
    if (eventType === "text-change") {
      // Preserve <span> tags in the initial HTML content
      this.preserveSpanTags();
    }
  }

  // Custom method to preserve <span> tags in HTML content
  preserveSpanTags() {
    // Get the current editor content as HTML
    const html = this.quill.root.innerHTML;
    // Replace <span> tags with placeholders to prevent Quill from modifying them
    const modifiedHTML = html.replace(
      /<span\b[^>]*>(.*?)<\/span>/g,
      (match, content) => {
        return `<!--SPAN_START-->${content}<!--SPAN_END-->`;
      },
    );

    // Set the modified HTML content back to the editor
    this.quill.root.innerHTML = modifiedHTML;
  }
}

Quill.register("modules/customModule", CustomModule);

// Initialize Quill with custom module

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "undo",
  "redo",
  "doc-var",
];

const Inline = Quill.import("blots/inline");

class DocVarBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.classList.add("doc-var");
    return node;
  }

  static formats(node) {
    return node.classList.contains("doc-var");
  }
}
DocVarBlot.blotName = "doc-var";
DocVarBlot.tagName = "span";

Quill.register(DocVarBlot);

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["1", "2", "3"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);

//

// Quill.register({ "formats/upperCase": upperCase });
Quill.register({ "formats/highlighter": highlighter });
// Quill.register({ "formats/docLock": true });

function QuillToolbar({ tollbarId }) {
  const appDispatch = useDispatch();
  const { gptHighlighterActive, editorLock } = useSelector(
    (state) => state?.quillReducer?.toolbar,
  );
  const activeDocumentAction = useSelector(
    (state) => state.documentReducer.activeDocumentAction,
  );
  const activeQuillId = useSelector(
    (state) => state.quillReducer.activeQuillId,
  );

  return (
    <div
      id={`toolbar-${tollbarId}`}
      className="flex w-full items-center justify-between"
    >
      <span
        className="ql-formats flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          onClick={() => {
            appDispatch(
              quillAction.setToolbarActiveFormat({
                editorLock: !editorLock,
              }),
            );
          }}
          className={
            "ql-docLock ln-cus-img-btn " +
            (activeDocumentAction == documentActions.VariableTool ||
            activeDocumentAction == documentActions.Reference
              ? "!hidden"
              : "")
          }
        >
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/doc-lock.svg"}
            remWidth={2}
            remHeight={2}
            alt={"Lock"}
          />
          {/* <Image
            id="lock"
            src={"/assets/icons/quillicons/doc-lock.svg"}
            height={32}
            width={32}
            alt="Document Lock"
          /> */}
        </button>
        <button
          className={
            "ql-highlighter " +
            (gptHighlighterActive
              ? "ln-cus-img-btn--active "
              : "ln-cus-img-btn ") +
            (activeDocumentAction == documentActions.VariableTool ||
            activeDocumentAction == documentActions.Reference
              ? "!hidden"
              : "")
          }
          onClick={(e) => {
            appDispatch(
              quillAction.setToolbarActiveFormat({
                gptHighlighterActive: !gptHighlighterActive,
              }),
            );
          }}
        >
          <RemSizeImage
            imagePath={
              gptHighlighterActive
                ? "/assets/icons/quillicons/highlighter-active.svg"
                : "/assets/icons/quillicons/highlighter.svg"
            }
            remWidth={2}
            remHeight={2}
            alt="Highlighter"
          />
          {/* <Image
            id="highlight"
            src={
              gptHighlighterActive
                ? "/assets/icons/quillicons/highlighter-active.svg"
                : "/assets/icons/quillicons/highlighter.svg"
            }
            height={32}
            width={32}
            layout="responsive"
            alt="Highlighter"
          /> */}
        </button>
        <button className="ql-undo ln-cus-img-btn">
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/undo-icon.svg"}
            remWidth={2}
            remHeight={2}
            alt={"Undo"}
          />
          {/* <Image
            id="undo"
            src={"/assets/icons/quillicons/undo-icon.svg"}
            height={32}
            width={32}
            alt="Undo"
          /> */}
        </button>
        <button className="ql-redo ln-cus-img-btn">
          <RemSizeImage
            imagePath={"/assets/icons/quillicons/redo-icon.svg"}
            remWidth={2}
            remHeight={2}
            alt={"Redo"}
          />
          {/* <Image
            id="redo"
            src={"/assets/icons/quillicons/redo-icon.svg"}
            height={32}
            width={32}
            alt="Redo"
          /> */}
        </button>
      </span>
      <span
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={
          "flex flex-1 items-center justify-end gap-2 " +
          (activeQuillId === 0 ||
          activeDocumentAction == documentActions.VariableTool ||
          activeDocumentAction == documentActions.Reference
            ? "hidden"
            : "")
        }
      >
        <span className=" ql-formats w-fit gap-2 border-r-[0.094rem] border-[#ffffff]">
          <span className="ql-formats flex flex-row-reverse items-center justify-between">
            {/* <button className="ql-upperCase">
              
              <Image
                src={"/assets/icons/quillicons/case-change.svg"}
                height={18}
                width={18}
                alt="Case Change"
              />
            </button> */}
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/case-change.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt={"Case Change"}
            />
            <select className="ql-font ml-[0.1rem]" defaultValue={"arial"}>
              <option value="arial">Arial</option>
              <option value="comic-sans">Comic Sans</option>
              <option value="courier-new">Courier New</option>
              <option value="georgia">Georgia</option>
              <option value="helvetica">Helvetica</option>
              <option value="lucida">Lucida</option>
            </select>
          </span>
          <span className="ql-formats ml-2 flex-row-reverse items-center justify-between">
            {/* <button className="ql-line-height">
              <Image
                src={"/assets/icons/quillicons/line-height.svg"}
                height={18}
                width={18}
                alt="Line Height"
              />
            </button> */}
            <RemSizeImage
              imagePath={"/assets/icons/quillicons/line-height.svg"}
              remWidth={1.125}
              remHeight={1.125}
              alt={"Size"}
            />
            <select className="ql-size ml-[0.1rem]" defaultChecked="1">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </span>
        </span>
        <span className="ql-formats  flex items-center gap-2 border-r-[0.094rem] border-[#ffffff]">
          <button className="ql-underline"></button>
          <button className="ql-italic"></button>
          <button className="ql-bold"></button>
        </span>
        <span className="ql-formats  flex items-center gap-2 border-r-[0.094rem] border-[#ffffff]">
          <select className="ql-align" />
        </span>
        <span className="ql-formats flex items-center ">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
      </span>
    </div>
  );
}

export default QuillToolbar;
