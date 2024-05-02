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
const dummyVars = [
  {
    variable: "Contract_Value",
    definition: "WK Tech Industries",
    id: nanoid(),
    count: 1,
  },
  {
    name: "Contract_Value",
    value: "WK Tech Industries",
    count: 1,
    id: nanoid(),
  },
  {
    name: "Contract_Value",
    value: "",
    count: 1,
    id: nanoid(),
  },
];
function LoganVariableTool() {
  const [addVariableButtonHover, setAddVariableButtonHover] = useState(false);
  const [variablesList, setVariablesList] = useState([]);
  const { activeDocumentVersion } = useSelector(
    (state) => state.documentReducer,
  );

  useEffect(() => {
    activeDocumentVersion.id &&
      activeDocumentVersion.version_id &&
      fetchDocumentVariables();
  }, [activeDocumentVersion]);

  return (
    <div
      className="h-full w-[26.5rem]  overflow-hidden bg-white "
      aria-label="Logan Document Version History"
    >
      <div className="flex h-[3.3rem] w-full items-center justify-between border-b-[0.063rem] border-secondary-blue px-[0.8rem]">
        <h2 className="text-sm font-semibold text-primary-gray">Variables</h2>
        <div className="flex items-center gap-2 ">
          <Button
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
          </Button>
          <Button
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
          </Button>
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
            {/* <Image
              src={`/assets/icons/${
                addVariableButtonHover ? "add-blue" : "add-light-blue"
              }.svg`}
              height={32}
              width={32}
              alt="Add"
            /> */}
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
        {/* <Image
          src={"/assets/icons/search-icon.svg"}
          height={19}
          width={19}
          alt="New"
        /> */}
        <input
          autoComplete="off"
          className="w-[80%] bg-gradient-search  text-xs  outline-none"
          placeholder="Search For a Variable Id Or Value..."
        ></input>
      </div>
      <div className=" h-[100%] overflow-hidden p-3 pr-3 text-xs">
        <ul className=" mr-2  flex h-[92%] flex-col gap-4 overflow-y-scroll">
          {variablesList.map((variable, index) => {
            return (
              <li key={nanoid()}>
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
    data?.length > 0 ? setVariablesList(data) : setVariablesList(dummyVars);
  }

  function updateVariableList(variable, varIndex = -1) {
    let varList = [...variablesList];
    if (varIndex < 0) {
      varList.unshift(variable);
    } else {
      varList[varIndex] = variable;
    }
    let res = updateDocumentVariables(
      {
        documentId: activeDocumentVersion.id,
        documentVersionId: activeDocumentVersion.versionId,
      },
      { document_variables: varList },
    );
  }
}

export default React.memo(LoganVariableTool);
