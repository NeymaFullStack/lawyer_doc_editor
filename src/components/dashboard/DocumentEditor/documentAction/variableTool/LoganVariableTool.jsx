import { Button } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import VariableField from "./VariableField";
import { nanoid } from "nanoid";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { useSelector } from "react-redux";
import {
  getDocumentVariables,
  updateDocumentVariables,
} from "@/api/clientSideServiceActions/dashboardServiceActions";

function LoganVariableTool() {
  const [varibaleSearch, setVariableSearch] = useState();
  const [addVariableButtonHover, setAddVariableButtonHover] = useState(false);
  const [variablesList, setVariablesList] = useState([]);
  const { activeDocumentVersion } = useSelector(
    (state) => state.documentVersioningReducer,
  );

  useEffect(() => {
    activeDocumentVersion.id &&
      activeDocumentVersion.version_id &&
      fetchDocumentVariables();
  }, [activeDocumentVersion]);
  console.log("varilanle List", variablesList);
  return (
    <div
      className="h-full w-[26.5rem]  overflow-hidden bg-white "
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
      <div className="flex h-full max-h-full flex-col overflow-y-hidden p-3  pr-3 text-xs">
        <ul className="glex-1 mr-2 flex w-full flex-col gap-2 overflow-y-scroll pb-5">
          {variablesList
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
                <li key={variable.variable}>
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
    let tempVariableList = [...variablesList];
    tempVariableList.unshift({
      variable: "",
      definition: "",
      new: true,
    });
    setVariablesList(tempVariableList);
  }

  async function fetchDocumentVariables() {
    let { data } = await getDocumentVariables({
      documentId: activeDocumentVersion?.id,
      documentVersionId: activeDocumentVersion?.version_id,
    });
    data?.length > 0 && setVariablesList(data);
  }

  async function updateVariableList(variable, varIndex = -1) {
    let varList = [...variablesList];
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
      setVariablesList(data);
    }
  }
}

export default React.memo(LoganVariableTool);
