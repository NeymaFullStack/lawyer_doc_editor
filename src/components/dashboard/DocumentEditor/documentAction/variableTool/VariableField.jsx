import RemSizeImage from "@/components/generic/RemSizeImage";
import { copiedContentType } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import { documentVariableAction } from "@/redux/editor/documentVariableSlice";
import { Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function VariableField({
  variableProperties,
  addNew,
  updateVariableList,
  index,
}) {
  const appDispatch = useDispatch();
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  const [editVariableState, setEditVariableState] = useState({
    variable: addNew ? true : false,
    definition: false,
  });

  const [variable, setVariable] = useState(variableProperties);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Event handler to update cursor position
  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };
  useEffect(() => {
    if (window !== undefined) {
      // copiedContent?.id && window.
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [copiedContent]);
  // console.log("copied", copiedContent);
  return (
    <div className="flex">
      {copiedContent?.content?.variable &&
        copiedContent?.content?.definition == variable.definition && (
          <div
            style={{
              left: cursorPosition.x + 5 + "px",
              top: cursorPosition.y + "px",
            }}
            className="fixed flex items-center gap-2 rounded-md border-[2px] border-dotted border-var p-1 text-var"
          >
            <RemSizeImage
              imagePath={"/assets/icons/paste-icon.svg"}
              remWidth={1.2}
              remHeight={1.2}
              alt={"Paste"}
            />
            <span className="text-xs font-semibold">
              {copiedContent?.content?.variable}
            </span>
          </div>
        )}
      <div className="group flex-1">
        <div className="flex w-full items-center gap-2">
          {editVariableState.variable ? (
            <div
              onBlur={() => {
                variable?.variable &&
                  setEditVariableState({
                    ...editVariableState,
                    variable: false,
                  });
                variable?.variable && updateVariableKey();
              }}
              className="flex h-[1.438rem] w-full items-center justify-between border-b-[0.063rem] border-primary-blue bg-six px-2"
            >
              <input
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    variable?.variable &&
                      setEditVariableState({
                        ...editVariableState,
                        variable: false,
                      });
                    variable?.variable && updateVariableKey();
                    // save variable
                  }
                }}
                autoFocus
                value={variable.variable}
                className="flex-1 bg-six text-black-txt"
                onChange={(e) => {
                  setVariable({
                    ...variable,
                    variable: e.target.value,
                  });
                }}
              />
              {variable.variable.length > 0 && (
                <button
                  onClick={() => {
                    setEditVariableState({
                      ...editVariableState,
                      variable: false,
                    });
                  }}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/right-tick.svg"}
                    remWidth={0.813}
                    remHeight={0.625}
                    alt={"Search"}
                  />
                  {/* <Image
                    src={"/assets/icons/right-tick.svg"}
                    height={10}
                    width={13}
                    alt="Right-Tick"
                  /> */}
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                "flex h-[1.5rem] items-center gap-2 " +
                (variable.definition ? "group-hover:text-primary-blue" : "")
              }
            >
              {variable.definition && (
                <button
                  onClick={() => {
                    appDispatch(
                      documentAction.setCopiedContent({
                        content: variable,
                        type: copiedContentType.Variable,
                      }),
                    );
                  }}
                  className=" m-auto hidden  h-full w-[3.313rem] items-center justify-center rounded-md bg-blue-gradient text-white group-hover:flex"
                >
                  Copy
                </button>
              )}
              <span
                onSelect={(e) => {
                  e.preventDefault();
                }}
                className=" cursor-default "
                onDoubleClick={() => {
                  setEditVariableState({
                    ...editVariableState,
                    variable: true,
                  });
                }}
              >
                {variable?.variable}
              </span>
              {/* <span className="rounded-md bg-six px-[0.313rem] py-[0.063rem]">
                {1}
              </span> */}
            </div>
          )}
        </div>
        <div
          className={`mt-[0.375rem] flex h-[2.5rem] items-center gap-2 rounded-lg ${
            copiedContent &&
            copiedContent?.content?.definition === variable.definition
              ? "border-[0.063rem] border-primary-blue"
              : "border-[0.063rem] border-secondary-blue"
          }`}
        >
          <div
            className="h-full w-full"
            onBlur={() => {
              setEditVariableState({ ...editVariableState, definition: false });
              updateVariableDefinition();
            }}
          >
            {variable?.definition || editVariableState?.definition ? (
              <div
                onFocus={() => {}}
                className=" flex h-full flex-1 items-center    px-3 text-black-txt"
              >
                <input
                  onKeyDown={(e) => {
                    e.key === "Enter" && updateVariableDefinition();
                  }}
                  autoComplete="off"
                  className="w-full"
                  autoFocus={!variable?.definition}
                  value={variable?.definition}
                  onChange={(e) => {
                    appDispatch(
                      documentVariableAction.setCurrentEditVaraible({
                        previousDefinition: variable.definition,
                        currentDefinition: e.target.value,
                        id: variable.variable,
                      }),
                    );
                    setVariable({
                      ...variable,
                      definition: e.target.value,
                    });
                  }}
                />
              </div>
            ) : (
              <div
                onClick={(e) => {
                  setEditVariableState({
                    ...editVariableState,
                    definition: true,
                  });
                }}
                className="flex h-full flex-1 items-center bg-six px-3 "
              >
                {variable.variable}
              </div>
            )}
          </div>
        </div>
      </div>
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            // {
            //   label: <span id={documentStatus.Draft}>{draft}</span>,
            //   key: documentStatus.Draft,
            // },
            // {
            //   type: "divider",
            // },
            {
              label: <span id={2}>Temp</span>,
              key: "temp",
            },
          ],
        }}
        placement="bottom"
      >
        <div className=" flex cursor-pointer flex-col justify-end px-2 pb-3">
          <RemSizeImage
            imagePath={"/assets/icons/option-icon.svg"}
            remWidth={0.25}
            remHeight={1.041}
            alt={"Options"}
          />
          {/* <Image
            src={"/assets/icons/option-icon.svg"}
            width={4}
            height={16.66}
            alt="Options"
          /> */}
        </div>
      </Dropdown>
    </div>
  );

  function updateVariableKey() {
    variable.variable !== variableProperties.variable &&
      updateVariableList(variable, index);
  }

  function updateVariableDefinition() {
    variable.definition !== variableProperties.definition &&
      updateVariableList(variable, index);
  }
}

export default React.memo(VariableField);
