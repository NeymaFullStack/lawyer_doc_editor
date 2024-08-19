import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tag from "./Tag";
import { useSelector } from "react-redux";
import RemSizeImage from "./RemSizeImage";
import { copiedContentType, documentType } from "@/constants/enums";
import { documentIndexingAction } from "@/redux/editor/documentIndexingSlice";
import { useDispatch } from "react-redux";
import { documentAction } from "@/redux/documentSlice";
import { toggleCollapsibleListOpenState } from "@/utils/component-utils";
import OptionButton from "./buttons/OptionButton";
import LoganDropDown from "./LoganDropDown";
import NewButtonActionsDropDown from "../Sidebar/NewButtonActionsDropDown";
import { Button } from "antd";

const CollapsibleList = ({
  items,
  isDragAndDrop = false,
  articleAction = undefined,
  collapsibleListOpenState,
}) => {
  const appDispatch = useDispatch();
  // console.log("collapse", collapsibleListOpenState);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`root-${crypto.randomUUID()}`} type="item">
        {(provided) => (
          <div
            className="flex flex-col justify-center gap-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <CollapsibleItem
                key={item.id}
                item={item}
                index={index}
                articleAction={articleAction}
                isDragAndDrop={isDragAndDrop}
                level={0}
                articleParentType={item.articleType}
                collapsibleItemOpenState={
                  collapsibleListOpenState?.length > 0
                    ? collapsibleListOpenState.find(
                        (collapseItem, index) => collapseItem.id === item.id,
                      )
                    : {}
                }
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
  // function reorder(list, startIndex, endIndex) {
  //   const [removed] = list.splice(startIndex, 1);
  //   list.splice(endIndex, 0, removed);
  //   return list;
  // }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;
    let sourceItem = null;
    let destinationItem = null;
    let isRoot = false;
    if (source.droppableId === destination.droppableId) {
      const newItems = JSON.parse(JSON.stringify(items));

      if (String(source.droppableId).includes("root-")) {
        sourceItem = newItems[source.index];
        destinationItem = newItems[destination.index];
        isRoot = true;
      } else {
        findDroppableAreaItem(newItems);
      }
      appDispatch(
        documentIndexingAction.setReorderAppendixState({
          sourceItem,
          destinationItem,
          isRoot,
        }),
      );
    }

    function findDroppableAreaItem(items) {
      for (let index = 0; index < items.length; index++) {
        if (items?.[index]?.id === source.droppableId) {
          items?.[index]?.children.forEach((actionItem, index) => {
            source.index === index && (sourceItem = actionItem);
            destination.index === index && (destinationItem = actionItem);
            return;
          });
        } else if (items?.[index]?.children && items) {
          findDroppableAreaItem(items[index].children);
        }
      }
    }

    // const reorderRecursive = (items) => {
    //   items.forEach((item) => {
    //     if (`${item.id}-subitems` === source.droppableId) {
    //       item.children = reorder(
    //         item.children,
    //         source.index,
    //         destination.index,
    //       );
    //     } else if (item.children) {
    //       reorderRecursive(item.children);
    //     }
    //   });
    // };

    // reorderRecursive(newItems);
    // appDispatch(documentIndexingAction.setArticlesList(newItems));
  }
};

const CollapsibleItem = ({
  item,
  index,
  level = 0,
  articleAction,
  isDragAndDrop,
  last = false,
  articleParentType,
  collapsibleItemOpenState,
}) => {
  const appDispatch = useDispatch();

  const [hovered, setHovered] = useState(false);
  const { currentDocument } = useSelector((state) => state.documentReducer);
  const [articleInputValue, setArticleInputValue] = useState("");
  const [isAddButtonHovered, setisAddButtonHovered] = useState(false);
  const copiedContent = useSelector(
    (state) => state.documentReducer.copiedContent,
  );
  const { collapsibleListOpenState } = useSelector(
    (state) => state.documentIndexingReducer,
  );
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Event handler to update cursor position
  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };
  useEffect(() => {
    if (window !== undefined && copiedContent) {
      // copiedContent?.id && window.
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      setCursorPosition({ x: 0, y: 0 });
    };
  }, [copiedContent]);
  // const toggleOpen = () => setitem?.IsOpen(!item?.isOpen);
  console.log(item.id, collapsibleItemOpenState?.isOpen);

  const content = (
    <div
      onMouseEnter={(e) => {
        setHovered(true);
        e.stopPropagation();
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.stopPropagation();
      }}
      className={`${collapsibleItemOpenState?.isOpen && level == 0 ? "rounded-lg border " : `relative ${!last ? "border-b" : ""} ${!collapsibleItemOpenState?.isOpen && !item.input ? "py-2" : ""}`}`}
    >
      <div
        onClick={() => {
          item?.children?.length > 0 &&
            toggleCollapsibleListOpenState(
              collapsibleListOpenState,
              item.id,
              appDispatch,
            );
        }}
        className={`flex items-center justify-between ${collapsibleItemOpenState?.isOpen ? "border-b py-2" : " bg-white"} ${hovered ? "pb-2" : ""}`}
      >
        <div
          style={{ marginLeft: `${level / 2 + 0.15}rem` }}
          className="flex flex-col justify-between"
        >
          <div className="flex items-center gap-2">
            <RemSizeImage
              className={`ml-1 cursor-pointer py-2  ${collapsibleItemOpenState?.isOpen ? "rotate-90" : ""}`}
              imagePath={"/assets/icons/docaction/expand-blue.svg"}
              remWidth={0.45}
              remHeight={0.5}
              alt={"Expand"}
            />
            {level === 0 ? (
              <Tag
                textColor="text-white"
                bgColor={
                  articleParentType === "document"
                    ? "bg-primary-blue"
                    : "bg-appendix-1"
                }
              >
                {documentType[item.articleType]}
              </Tag>
            ) : (
              <>
                {level === 1 ? (
                  <Tag
                    textColor={
                      articleParentType === "document"
                        ? "text-primary-blue"
                        : "text-appendix-1"
                    }
                    bgColor={
                      articleParentType === "document"
                        ? "bg-secondary-blue"
                        : "bg-appendix"
                    }
                  >
                    Article
                  </Tag>
                ) : (
                  <div className=" h-[1.498rem]"></div>
                )}
              </>
            )}
            {level > 0 && (
              <div className="flex items-center gap-1 ">
                <RemSizeImage
                  imagePath={`/assets/icons/docaction/${articleParentType === "document" ? "article-icon" : "appendix-icon"}.svg`}
                  remWidth={0.45}
                  remHeight={0.45}
                  alt={"article"}
                />
                <span
                  className={`text-xs ${articleParentType === "document" ? "text-primary-blue" : "text-appendix-1"}`}
                >
                  {item.index}
                </span>
              </div>
            )}

            {item.input ? (
              <div className="mr-3 flex w-full items-center gap-2">
                <input
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="New Article Name"
                  autoFocus
                  value={articleInputValue}
                  className="my-[0.3806rem] h-[1.8rem] flex-1 rounded-md border-[1px]  border-primary-gray pl-2 text-black-txt focus:border-primary-blue"
                  onChange={(e) => {
                    setArticleInputValue(e.target.value);
                  }}
                />
                <span
                  className=" cursor-pointer"
                  onClick={() => articleAction("delete", item.id, level)}
                >
                  <RemSizeImage
                    imagePath={"/assets/icons/cross-icon.svg"}
                    remWidth={0.898}
                    remHeight={1.125}
                    alt={"Close"}
                  />
                </span>
              </div>
            ) : (
              <h3 className=" max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold text-black-txt hover:text-primary-blue">
                {item.title}
              </h3>
            )}
            {!item.input && (
              <span
                className={`rounded-md bg-six px-[0.313rem] py-[0.063rem] ${item?.children?.length > 0 ? "text-primary-blue" : "text-primary-gray"}`}
              >
                {item?.children?.length || 0}
              </span>
            )}
          </div>
          {articleAction && !collapsibleItemOpenState?.isOpen && (
            <div
              className={`absolute -bottom-[.635rem]  left-0 right-0  flex w-full items-center  bg-white  ${hovered ? "visible" : "invisible"}`}
            >
              <span
                className={`h-[1px] flex-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
              ></span>
              <button
                onMouseEnter={() => {
                  setisAddButtonHovered(true);
                }}
                onMouseLeave={() => {
                  setisAddButtonHovered(false);
                }}
                className={`mx-3 rounded-md  px-5 py-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
                onClick={(e) => {
                  articleAction("addNew", item.id, level), e.stopPropagation();
                }}
              >
                <RemSizeImage
                  imagePath={`/assets/icons/add-${isAddButtonHovered ? "white" : "blue"}-outline.svg`}
                  remWidth={0.65}
                  remHeight={1.125}
                  alt={"Close"}
                />
              </button>
              <span
                className={`h-[1px] flex-1 ${isAddButtonHovered ? "bg-primary-blue" : "bg-secondary-blue"}`}
              ></span>
            </div>
          )}
        </div>
        {hovered &&
          (level > 0 || (level == 0 && articleParentType !== "document")) && (
            <div className="mr-2 flex items-center gap-2">
              <button
                onClick={(e) => {
                  appDispatch(
                    documentAction.setCopiedContent({
                      content: item,
                      type: item.articleType || item.type,
                    }),
                  );
                  e.stopPropagation();
                }}
                className={`h-full w-[3.313rem] cursor-pointer items-center justify-center rounded-md bg-secondary-blue py-[0.15rem] text-xs font-medium text-primary-blue ${hovered ? "visible" : "invisible"} `}
              >
                Copy
              </button>
              <LoganDropDown
                placement="bottomRight"
                trigger={"click"}
                baseElement={
                  <button className="p-1" onClick={(e) => e.stopPropagation()}>
                    <OptionButton />
                  </button>
                }
                customDropDownMenu={({ closeMenu }) => (
                  <ul className="text-md rounded-xl bg-white p-1 shadow-out-lg">
                    <li
                      onClick={() => {
                        //delete itme logic
                        articleAction("delete", item.id, level);
                        closeMenu();
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-lg p-2 py-1 pr-4 hover:bg-five hover:text-primary-blue"
                    >
                      <RemSizeImage
                        imagePath={"/assets/icons/delete-outline.svg"}
                        remWidth={0.9}
                        remHeight={0.9}
                        alt={"delete"}
                      />
                      <span className=" font-medium text-black-txt">
                        Delete
                      </span>
                    </li>
                  </ul>
                )}
              />
            </div>
          )}
      </div>
      {collapsibleItemOpenState?.isOpen && item.children && (
        <Droppable droppableId={`${item.id}`} type={`subitem-${level}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {item?.children.map((child, index) => (
                <CollapsibleItem
                  key={child.id}
                  item={child}
                  index={index}
                  level={level + 1}
                  articleAction={articleAction}
                  isDragAndDrop={isDragAndDrop}
                  last={item?.children?.length === index + 1}
                  articleParentType={articleParentType}
                  collapsibleItemOpenState={
                    collapsibleItemOpenState?.children?.length > 0
                      ? collapsibleItemOpenState?.children.find(
                          (collapseItem, index) => collapseItem.id === child.id,
                        )
                      : {}
                  }
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );

  return (
    <>
      {copiedContent?.content && (
        <div
          style={{
            left: cursorPosition.x + 5 + "px",
            top: cursorPosition.y + "px",
          }}
          className={`fixed flex items-center gap-2 rounded-md border-[2px] border-dotted ${copiedContent.type === copiedContentType.Appendix ? "border-appendix-1 text-appendix-1" : " border-primary-blue text-primary-blue"}  p-1 `}
        >
          <RemSizeImage
            imagePath={`/assets/icons/${copiedContent.type === copiedContentType.Appendix ? "paste-appendix" : "paste-icon"}.svg`}
            remWidth={1.2}
            remHeight={1.2}
            alt={"Paste"}
          />
          <div className="ml-1 flex items-center gap-2 text-sm font-semibold ">
            <div className="flex items-center">
              <RemSizeImage
                className={"mr-1"}
                imagePath={`/assets/icons/docaction/${copiedContent.type === copiedContentType.Appendix ? "appendix" : "article-icon"}.svg`}
                remWidth={0.5}
                remHeight={0.5}
                alt={"article"}
              />
              {copiedContent.type === copiedContentType.Appendix
                ? `Appendix ${copiedContent?.content?.index} -`
                : "Article -"}
            </div>
            <span>{copiedContent?.content?.title}</span>
          </div>
        </div>
      )}
      {isDragAndDrop && articleAction ? (
        <Draggable draggableId={item?.id?.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${snapshot.isDragging ? "bg-gray-100" : ""}`}
            >
              {content}
            </div>
          )}
        </Draggable>
      ) : (
        <div>{content}</div>
      )}
    </>
  );
};

export default CollapsibleList;
