import { Button } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VariableField from "./VariableField";
import { nanoid } from "nanoid";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useDispatch, useSelector } from "react-redux";
import {
  getDocumentVariables,
  updateDocumentVariables,
} from "@/api/clientSideServiceActions/dashboardServiceActions";
import { documentVariableAction } from "@/redux/editor/documentVariableSlice";

function LoganVariableTool() {
  const appDispatch = useDispatch();
  const [varibaleSearch, setVariableSearch] = useState();
  const [addVariableButtonHover, setAddVariableButtonHover] = useState(false);
  const { activeDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );
  const { variableList } = useSelector(
    (state) => state.documentVariableReducer,
  );

  // useEffect(() => {
  //   activeDocumentVersion.id &&
  //     activeDocumentVersion.version_id &&
  //     fetchDocumentVariables();
  // }, [activeDocumentVersion]);
  // console.log("varilanle List", variableList);
  return (
    <div
      className="flex h-full w-[26.5rem] flex-col  overflow-hidden bg-white "
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[3.3rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">
          Variables and Definitions
        </h2>
        <div className="flex items-center gap-2 ">
          {/* <Button
            className="btn btn--secondary !py-4"
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/sort-icon.svg"}
                remWidth={1.343}
                remHeight={1.343}
                alt={"Sort"}
              />
              // <Image
              //   src={"/assets/icons/sort-icon.svg"}
              //   height={21.49}
              //   width={21.49}
              //   alt="New"
              // />
            }
          >
            By Date
          </Button> */}
          {/* <Button
            className="btn btn--secondary !py-4"
            icon={
              <RemSizeImage
                imagePath={"/assets/icons/all-doc.svg"}
                remWidth={1.343}
                remHeight={1.343}
                alt={"All Doc"}
              />
              // <Image
              //   src={"/assets/icons/all-doc.svg"}
              //   height={21.49}
              //   width={21.49}
              //   alt="New"
              // />
            }
          >
            All
          </Button> */}
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
      <div className="flex-1 overflow-y-scroll p-4 text-xs">
        <ul>
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
                <li key={variable.variable} className="my-2">
                  <VariableField
                    variableProperties={variable}
                    addNew={variable.new ? true : false}
                    index={index}
                    updateVariableList={updateVariableList}
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
      variable: "",
      definition: "",
      new: true,
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

  async function updateVariableList(variable, varIndex = -1) {
    let varList = [...variableList];
    if (varIndex < 0) {
      varList.unshift(variable);
    } else {
      varList[varIndex] = variable;
    }
    if (activeDocumentVersion?.id && activeDocumentVersion.version_id) {
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
