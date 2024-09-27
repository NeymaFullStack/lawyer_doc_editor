import PositionToolTip from "@/components/generic/PositionToolTip";
import RemSizeImage from "@/components/generic/RemSizeImage";
import { Input } from "@/components/shadcn-components/ui/input";
import { documentActions, tagInsertionType } from "@/constants/enums";
import { documentAction } from "@/redux/documentSlice";
import { debounce } from "@/utils/generic";
import { cn } from "@/utils/shadcn-utils";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const LoganTagsMenu = ({
  onClickTag,
  isOpen,
  onClose,
  position,
  view,
  editorRef,
}) => {
  const appDispatch = useDispatch();

  const [input, setInput] = useState("");
  const { variableList } = useSelector(
    (state) => state.documentVariableReducer,
  );
  const articleList = useSelector(
    (state) => state.documentIndexingReducer.articleList,
  );
  const [tagList, setTagList] = useState([]);
  const [filteredTagList, setFilteredTagList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && filteredTagList?.length > 0) {
        onClickTag(view, filteredTagList?.[selectedIndex]);
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredTagList, onClickTag, view, onClose]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tagList]);

  useEffect(() => {
    let tagList = [];
    if (articleList?.length == 0 && variableList?.length == 0) {
      return;
    }
    for (let item of articleList) {
      let tag = {
        type: "",
        tagName: item?.title,
        index: item?.index,
        id: item.id,
      };
      if (
        item?.articleType &&
        item?.articleType === tagInsertionType.Appendix
      ) {
        tag.type = tagInsertionType.Appendix;
      }

      tagList.push(tag);
      if (item?.children && item.children.length > 0) {
        tagList = [...tagList, ...extractArticles(item?.children)];
      }
    }
    for (let item of variableList) {
      let tag = {
        type: tagInsertionType.Variable,
        tagName: item?.definition,
      };
      tagList.push(tag);
    }
    setTagList(tagList);
    function extractArticles(articleList) {
      let tagList = [];
      for (let item of articleList) {
        let tag = {
          type: item?.type,
          tagName: item?.title,
          index: item?.index,
          id: item.id,
        };
        tagList.push(tag);
        if (item.children) {
          tagList = [...tagList, ...extractArticles(item.children)];
        }
      }
      return tagList;
    }
  }, [articleList, variableList]);

  useEffect(() => {
    if (!input) {
      filteredTagList?.length > 0 && setFilteredTagList([]);
    } else {
      let filteredList = tagList.filter((item, index) => {
        return String(item.tagName).includes(input);
      });
      setFilteredTagList(filteredList);
    }
    setSelectedIndex(0);
  }, [input]);

  return (
    <PositionToolTip
      onClose={onClose}
      position={position}
      isOpen={isOpen}
      containerRef={editorRef}
      className={"p-0"}
    >
      <div className={`${filteredTagList.length > 0 && "min-w-[15rem]"}`}>
        <div className="px-3 pt-3">
          <h2 className="text-sm font-medium text-primary-gray">INSERT</h2>
          <Input
            ref={inputRef}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input || ""}
            autoComplete="off"
            placeholder={"Search"}
            className="my-[0.4rem] h-[1.6rem] max-w-32 bg-six"
          />
        </div>
        {input ? (
          <ul
            className={cn(
              "flex h-[15rem] flex-col overflow-y-scroll",
              filteredTagList.length < 1 &&
                "h-[8rem] items-center justify-center",
            )}
          >
            {filteredTagList?.length > 0 ? (
              filteredTagList?.map((item, index) => {
                let tagColors = {};
                if (item?.type === tagInsertionType?.SubArticle) {
                  tagColors["textColor"] = "text-primary-blue";
                  tagColors["bgColor"] = "bg-secondary-blue";
                } else if (item?.type === tagInsertionType?.Variable) {
                  tagColors["textColor"] = "text-var";
                  tagColors["bgColor"] = "bg-var";
                } else if (item?.type === tagInsertionType?.Article) {
                  tagColors["textColor"] = "text-primary-blue";
                  tagColors["bgColor"] = "bg-secondary-blue";
                } else if (item?.type === tagInsertionType?.Appendix) {
                  tagColors["textColor"] = "text-appendix-1";
                  tagColors["bgColor"] = "bg-appendix";
                }
                return (
                  <li
                    onClick={() => {
                      onClickTag(view, item);
                      onClose();
                    }}
                    key={index}
                    className={cn(
                      "group flex min-w-36 cursor-pointer items-center justify-between px-2 py-[0.5rem] hover:bg-six",
                      selectedIndex === index && "bg-six",
                    )}
                  >
                    <div
                      className={`flex items-center gap-2 rounded-md p-1 px-2  ${tagColors.bgColor}`}
                    >
                      {item.type === tagInsertionType.SubArticle ||
                      item.type === tagInsertionType.Variable ? (
                        <RemSizeImage
                          imagePath={
                            item.type === tagInsertionType.SubArticle
                              ? "/assets/icons/docaction/subarticle-gray.svg"
                              : "/assets/icons/docaction/variable-gray.svg"
                          }
                          remWidth={1}
                          remHeight={1}
                          alt={"Indexing"}
                        />
                      ) : (
                        <span
                          className={`text-xs font-semibold ${tagColors?.textColor}`}
                        >
                          {item?.type === tagInsertionType?.Appendix
                            ? "Appendix"
                            : "Article"}
                        </span>
                      )}
                      {item.type !== tagInsertionType.Variable && (
                        <span
                          className={`text-sm font-semibold ${tagColors?.textColor}`}
                        >{`${item?.index} -`}</span>
                      )}
                      <span
                        className={`max-w-[10rem] truncate text-xs font-semibold ${tagColors?.textColor}`}
                      >
                        {item?.tagName}
                      </span>
                    </div>

                    <div
                      className={cn(
                        " invisible ml-10 mr-2 group-hover:visible",
                        selectedIndex === index && "visible",
                      )}
                    >
                      <RemSizeImage
                        imagePath="/assets/icons/docaction/tag-select.svg"
                        remHeight={1.2}
                        remWidth={1.2}
                        alt="next"
                        className="-rotate-90:"
                      />
                    </div>
                  </li>
                );
              })
            ) : (
              <span className="mb-3 text-sm text-primary-gray">
                No Tags Found
              </span>
            )}
          </ul>
        ) : (
          <ul className="flex w-full flex-col gap-2 p-3 text-black-txt">
            <li
              className=" flex min-w-36 cursor-pointer items-center justify-between"
              onClick={() => {
                onClickActionTool(documentActions.Reference);
              }}
            >
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/indexing.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Article</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li
              className=" flex min-w-36 cursor-pointer items-center justify-between"
              onClick={() => {
                onClickActionTool(documentActions.Reference);
              }}
            >
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/indexing.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Indexing"}
                />
                <span className="text-sm font-semibold">Appendix</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li
              className=" flex min-w-36 cursor-pointer items-center justify-between"
              onClick={() => {
                onClickActionTool(documentActions.VariableTool);
              }}
            >
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/variable.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"Variable"}
                />
                <span className="text-sm font-semibold">Variable</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
            <li
              className=" flex min-w-36 cursor-pointer items-center justify-between"
              onClick={() => {
                onClickActionTool(documentActions.VariableTool);
              }}
            >
              <div className="flex items-center gap-2">
                <RemSizeImage
                  imagePath={"/assets/icons/docaction/definition.svg"}
                  remWidth={1}
                  remHeight={1}
                  alt={"definition"}
                />
                <span className="text-sm font-semibold">Definition</span>
              </div>
              <RemSizeImage
                imagePath="/assets/icons/arrow-down-gray.svg"
                remHeight={0.875}
                remWidth={0.875}
                alt="next"
                className="-rotate-90"
              />
            </li>
          </ul>
        )}
      </div>
    </PositionToolTip>
  );

  function onClickActionTool(tool) {
    appDispatch(documentAction.setActiveDocumentAction(tool));
  }
};

export default LoganTagsMenu;
