import CopyButton from "@/components/generic/buttons/CopyButton";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { copiedContentType } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import { documentVariableAction } from "@/redux/editor/documentVariableSlice";
import { Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function VariableField({
  selectedVariableProperties,
  updateVariableList,
  index,
}) {
  const appDispatch = useDispatch();
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  const [editVariableState, setEditVariableState] = useState({
    variable_name:
      !selectedVariableProperties?.variable_name &&
      !selectedVariableProperties?.definition,
    definition: false,
  });

  const [variable, setVariable] = useState();
  useEffect(() => {
    setVariable({ ...selectedVariableProperties });
  }, [selectedVariableProperties]);
  return (
    <div className="flex">
      <div className="group flex-1">
        <div className="flex w-full items-center gap-2">
          {editVariableState?.variable_name ? (
            <div
              onBlur={() => {
                variable?.variable_name &&
                  setCurrentEditingData({
                    variable_name: false,
                  });
                variable?.variable_name && updateVariable();
              }}
              className="flex h-[1.438rem] w-full items-center justify-between border-b-[0.063rem] border-primary-blue bg-six px-2"
            >
              <input
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    variable?.variable_name &&
                      setCurrentEditingData({
                        variable_name: false,
                      });
                    variable?.variable_name && updateVariable();
                    // save variable
                  }
                }}
                autoFocus={true}
                value={variable?.variable_name || ""}
                className="flex-1 bg-six text-black-txt"
                onChange={(e) => {
                  setVariable({
                    ...variable,
                    // definition: e.target.value
                    //   ? !variable.definition
                    //     ? `[${variable.variable_name}${e.target.value}]`
                    //     : variable.definition
                    //   : variable.definition,
                    variable_name: e.target.value,
                  });
                }}
              />
              {variable?.variable_name?.length > 0 && (
                <button
                  onClick={() => {
                    setCurrentEditingData({
                      variable_name: false,
                    });
                  }}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/right-tick.svg"}
                    remWidth={0.813}
                    remHeight={0.625}
                    alt={"Search"}
                  />
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                "flex h-[1.5rem] items-center gap-2 " +
                (variable?.definition ? "group-hover:text-primary-blue" : "")
              }
            >
              <CopyButton
                className=" hidden group-hover:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  appDispatch(
                    documentAction.setCopiedContent({
                      title:
                        variable?.definition || `[${variable?.variable_name}]`,
                      type: copiedContentType.Variable,
                      id: selectedVariableProperties?.id,
                    }),
                  );
                }}
              />
              <span
                onSelect={(e) => {
                  e.preventDefault();
                }}
                className=" cursor-default "
                onDoubleClick={() => {
                  setCurrentEditingData({
                    variable_name: true,
                  });
                }}
              >
                {variable?.variable_name}
              </span>
              {/* <span className="rounded-md bg-six px-[0.313rem] py-[0.063rem]">
                {1}
              </span> */}
            </div>
          )}
        </div>
        <div
          className={`mt-[0.375rem] flex h-[2.5rem] items-center gap-2 rounded-lg ${
            copiedContent && copiedContent?.definition === variable?.definition
              ? "border-[0.063rem] border-primary-blue"
              : "border-[0.063rem] border-secondary-blue"
          }`}
        >
          <div
            className="h-full w-full"
            onBlur={() => {
              setEditVariableState({ ...editVariableState, definition: false });
              updateVariable();
            }}
          >
            {variable?.definition || editVariableState?.definition ? (
              <div className=" flex h-full flex-1 items-center    px-3 text-black-txt">
                <input
                  onKeyDown={(e) => {
                    e.key === "Enter" && updateVariable();
                  }}
                  autoComplete="off"
                  autoFocus={variable.definition === ""}
                  className="w-full"
                  value={variable?.definition}
                  onChange={(e) => {
                    appDispatch(
                      documentVariableAction.setCurrentEditVaraible({
                        previousDefinition: variable?.definition
                          ? variable?.definition
                          : `[${variable?.variable_name}]`,
                        currentDefinition: e.target.value
                          ? e.target.value
                          : `[${variable?.variable_name}]`,
                        id: variable?.id,
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
                {variable?.variable_name ? `[${variable?.variable_name}]` : ""}
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
              label: "Delete",
              key: "temp",
            },
          ],
          onClick: () => {
            appDispatch(
              documentVariableAction.setCurrentEditVaraible({
                previousDefinition: variable?.definition
                  ? variable?.definition
                  : `[${variable?.variable_name}]`,
                currentDefinition: "",
                id: variable?.id,
              }),
            );
            updateVariableList(variable, index, "delete");
          },
        }}
        placement="bottom"
      >
        <div className=" flex cursor-pointer flex-col justify-end px-1 pb-3 pl-3">
          <RemSizeImage
            imagePath={"/assets/icons/option-icon.svg"}
            remWidth={0.4}
            remHeight={1.041}
            alt={"Options"}
          />
        </div>
      </Dropdown>
    </div>
  );

  function setCurrentEditingData(data) {
    setEditVariableState({ ...editVariableState, ...data });
  }

  function updateVariable() {
    // variable?.variable_name !== variableProperties?.variable_name &&
    //   setVariable(variable, index);
    // variable?.definition !== variableProperties?.definition &&
    //   setVariable(variable, index);

    (variable.definition !== selectedVariableProperties?.definition ||
      variable?.variable_name !== selectedVariableProperties?.variable_name) &&
      updateVariableList(variable, index);
  }
}

export default React.memo(VariableField);
