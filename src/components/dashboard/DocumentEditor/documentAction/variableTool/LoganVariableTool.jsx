import { Button } from "antd";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VariableField from "./VariableField";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useDispatch, useSelector } from "react-redux";
import { updateDocumentVariables } from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVariableAction } from "@/redux/editor/documentVariableSlice";
import { nanoid } from "nanoid";

function LoganVariableTool() {
  const appDispatch = useDispatch();
  const [varibaleSearch, setVariableSearch] = useState();
  const [addVariableButtonHover, setAddVariableButtonHover] = useState(false);
  const documentIdRef = useRef(null);
  const { activeDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { variableList } = useSelector(
    (state) => state.documentVariableReducer,
  );

  const memoisedUpdateVariable = useCallback(() => {
    return updateVariableList;
  }, [
    variableList,
    activeDocumentVersion?.id,
    activeDocumentVersion.version_id,
  ]);
  console.log("variableList", variableList);
  // useEffect(() => {
  //   if (activeDocumentVersion?.id && activeDocumentVersion.version_id)
  //     documentIdRef.current = {
  //       documentId: activeDocumentVersion?.id,
  //       versionId: activeDocumentVersion.version_id,
  //     };
  // }, [activeDocumentVersion?.id, activeDocumentVersion.version_id]);
  return (
    <div
      className="flex h-full flex-col"
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[2.997rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">
          Variables and Definitions
        </h2>
        <div className="flex items-center gap-2 ">
          <button
            onClick={addNewVariable}
            onMouseEnter={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setAddVariableButtonHover(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setAddVariableButtonHover(false);
            }}
          >
            <RemSizeImage
              imagePath={`/assets/icons/${
                addVariableButtonHover ? "add-blue" : "add-light-blue"
              }.svg`}
              remWidth={2}
              remHeight={2}
              alt={"Add"}
            />
          </button>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 border-b-[0.063rem] border-secondary-blue bg-gradient-search px-5 py-3">
        <RemSizeImage
          imagePath={"/assets/icons/search-icon.svg"}
          remWidth={1.188}
          remHeight={1.188}
          alt={"Search"}
        />
        <input
          onChange={(e) => {
            setVariableSearch(e.target.value);
          }}
          autoComplete="off"
          className="w-[80%] bg-gradient-search  text-xs  outline-none"
          placeholder="Search For a Variable Id Or Value..."
        ></input>
      </div>
      <div className="flex-1 overflow-y-hidden p-4 text-xs">
        <ul className="h-full overflow-y-scroll">
          {variableList
            .filter((item) => {
              if (!varibaleSearch) {
                return true;
              }
              return (
                item.variable.includes(varibaleSearch) ||
                item.definition.includes(varibaleSearch)
              );
            })
            .map((variable, index) => {
              return (
                <li key={variable.id} className="my-2">
                  <VariableField
                    selectedVariableProperties={variable}
                    index={index}
                    updateVariableList={memoisedUpdateVariable()}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );

  function addNewVariable() {
    let tempVariableList = [...variableList];
    tempVariableList.unshift({
      variable_name: "",
      definition: "",
      id: nanoid(),
    });
    appDispatch(documentVariableAction.setVariableList(tempVariableList));
  }

  // async function fetchDocumentVariables() {
  //   let { data } = await getDocumentVariables({
  //     documentId: activeDocumentVersion?.id,
  //     documentVersionId: activeDocumentVersion?.version_id,
  //   });
  //   data?.length > 0 &&
  //     appDispatch(documentVariableAction.setVariableList(data));
  // }

  async function updateVariableList(
    variable,
    varIndex = -1,
    action = "update",
  ) {
    let varList = [...variableList];
    if (varIndex < 0) {
      varList.unshift(variable);
    } else {
      if (action === "update") {
        varList[varIndex] = variable;
      } else {
        varList.splice(varIndex, 1);
      }
    }

    if (activeDocumentVersion?.id && activeDocumentVersion?.version_id) {
      let { data } = await updateDocumentVariables(
        {
          documentId: activeDocumentVersion.id,
          documentVersionId: activeDocumentVersion.version_id,
        },
        { document_variables: varList },
      );
      appDispatch(documentVariableAction.setVariableList(data));
    }
  }
}

export default React.memo(LoganVariableTool);
