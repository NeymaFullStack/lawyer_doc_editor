"use client";
import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import RemSizeImage from "@/components/generic/RemSizeImage";
import DropFile from "@/components/generic/DropFile";
import { useSelector } from "react-redux";
import { uploadDocument } from "@/api/clientSideServiceActions/dashboardServiceActions";

function LoganDocumentBase() {
  const [fileList, setFileList] = useState([]);
  const [showFiles, setShowFiles] = useState(true);
  const [resizerActive, setResizerActive] = useState(false);
  const fileBaseRef = useRef(null);
  const fileListWrapperRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [baseHeight, setBaseheight] = useState(null);
  const currentDocumentVersion = useSelector(
    (state) => state.documentReducer?.currentDocumentVersion,
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      isResizing && window.addEventListener("mouseup", draggerMouseUp);
      isResizing && window.addEventListener("mousemove", draggerMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", draggerMouseUp);
      window.removeEventListener("mousemove", draggerMouseMove);
    };
  }, [isResizing]);

  useEffect(() => {
    if (showFiles) {
      fileBaseRef.current.style.height = `${baseHeight}px`;
    } else {
      fileBaseRef.current.style.height = "auto";
    }
  }, [showFiles]);

  return (
    <div className="relative h-[25%] bg-white " ref={fileBaseRef}>
      <>
        {showFiles &&
          (fileList.length > 0 && resizerActive ? (
            <div
              className="absolute top-[-0.313rem] cursor-ns-resize "
              onMouseLeave={(e) => {
                e.stopPropagation();
                e.preventDefault();
                !isResizing && setResizerActive(false);
              }}
              onDragStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                setIsResizing(true);
              }}
            >
              <RemSizeImage
                imagePath={"/assets/images/resizer.svg"}
                remWidth={35.25}
                remHeight={0.813}
                alt={"Processing"}
              />
              {/* <Image
                src={"/assets/images/resizer.svg"}
                height={13}
                width={564}
                alt="Processing"
              /> */}
            </div>
          ) : (
            <div
              className="h-[0.125rem] bg-[#095AD31A]"
              onMouseEnter={(e) => {
                e.stopPropagation();
                e.preventDefault();
                fileList.length > 0 && setResizerActive(true);
              }}
            ></div>
          ))}
      </>

      <div
        className={`${
          showFiles ? "bg-8 text-primary-blue" : "bg-blue-gradient text-white"
        } flex items-center justify-between px-4 py-2 ${
          resizerActive ? "border-y-[0.125rem]" : "border-b-[0.125rem]"
        } border-secondary-blue`}
      >
        <div className="flex items-center gap-2  text-xs font-semibold">
          <RemSizeImage
            imagePath={
              showFiles
                ? "/assets/icons/add-blue.svg"
                : "/assets/icons/add-white.svg"
            }
            remWidth={1.188}
            remHeight={1.188}
            alt={"Upload"}
          />
          {/* <Image
            src={
              showFiles
                ? "/assets/icons/add-blue.svg"
                : "/assets/icons/add-white.svg"
            }
            height={19}
            width={19}
            alt="Upload"
          /> */}
          <span>Related Files</span>
          <span className="rounded-lg bg-[#095AD31A] px-1 py-[0.125rem]">
            19
          </span>
        </div>
        <button
          onClick={() => setShowFiles(!showFiles)}
          className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-1 text-xs font-semibold ${
            showFiles ? "bg-[#095AD31A]" : ""
          }`}
        >
          <RemSizeImage
            imagePath={
              showFiles
                ? "/assets/icons/arrow-down-blue.svg"
                : "/assets/icons/arrow-up-white.svg"
            }
            remWidth={0.613}
            remHeight={0.324}
            alt={"arrow"}
          />
          {/* <Image
            src={
              showFiles
                ? "/assets/icons/arrow-down-blue.svg"
                : "/assets/icons/arrow-up-white.svg"
            }
            height={5.18}
            width={9.81}
            alt="arrow"
          /> */}
          <span>{showFiles ? "Hide" : "Show"}</span>
        </button>
      </div>
      {showFiles && (
        <>
          {fileList.length > 0 ? (
            <div className="flex h-[calc(100%-2.75rem)] ">
              <div
                ref={fileListWrapperRef}
                className="grid h-full flex-1 grid-cols-3 gap-5 overflow-y-scroll border-r-[0.094rem] border-secondary-blue p-4"
              >
                {fileList.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex h-fit cursor-pointer flex-col gap-1 "
                    >
                      <div className="group relative h-[2.8rem] w-[6.5rem] overflow-hidden break-words rounded-lg px-2 text-[0.188rem] shadow-out">
                        {parse(
                          "<p>Hello, World!ajskdcjkasjkcasjkcnjkasncjkasnkjcnasjkcnjkdadkhjwfdhishfishfiewhifhesdiufhiushiufasdkfcjkasdhfksdhiudskvbasdknkasdhiudsbfjkndsjkcnaisbcuiadiuvdknvuiehvikjabjkgvdsjbvu</p>",
                        )}
                        <div
                          className={`absolute bottom-0 left-0  
                  right-0 top-0 hidden items-center justify-center group-hover:flex group-hover:bg-gradient-preview`}
                        >
                          <RemSizeImage
                            imagePath={"/assets/icons/preview-eye.svg"}
                            remWidth={1.125}
                            remHeight={1.125}
                            alt={"arrow"}
                          />
                        </div>
                      </div>
                      <span className="text-[0.7rem]">Document X</span>
                      <span className="text-[0.5rem]">Added on 07-06-2023</span>
                    </div>
                  );
                })}
              </div>
              <div className="w-[2rem]"></div>
            </div>
          ) : (
            <div className="m-6">
              <DropFile onUpload={onUpload} />
            </div>
          )}
        </>
      )}
    </div>
  );

  function draggerMouseUp() {
    setIsResizing(false);
    setResizerActive(false);
  }

  function draggerMouseMove(e) {
    let baseExpandLimit = fileListWrapperRef.current.scrollHeight + 44;
    if (isResizing) {
      let newHeight =
        fileBaseRef.current.clientHeight +
        fileBaseRef.current.getBoundingClientRect().top -
        e.clientY;
      if (newHeight >= 160 && newHeight <= baseExpandLimit) {
        setBaseheight(newHeight);
        fileBaseRef.current.style.height = `${newHeight}px`;
      }
    }
  }

  async function onUpload({ file }) {
    // TODO: info.file send to backend api save the response to file list for showing those files
    let formData = new FormData();
    formData.append("file", file);
    const { data: content } = await uploadDocument(
      `/documents/${currentDocumentVersion.version_id}/upload`,
      formData,
    );
    setFileList([...fileList, content]);
  }
}

export default LoganDocumentBase;
