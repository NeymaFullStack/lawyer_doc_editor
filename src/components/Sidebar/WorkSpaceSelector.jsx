import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import RemSizeImage from "../generic/RemSizeImage";
import { debounce } from "lodash";
function WorkSpaceSelector() {
  let [isSelectorHovered, setIsSelectorHovered] = useState(false);
  let [isDropDownOpen, setIsDropDownOpen] = useState(false);
  let [dropDownList, setDropDownList] = useState([]);
  let containerRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  // const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Debounce the search query input to limit how often we update the search results
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Filter items based on the debounced search query
  const filteredItems = useMemo(() => {
    return dropDownList.filter((item) =>
      item.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [dropDownList, debouncedSearchQuery]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item) => {
    onSelect(item);
    setSearchQuery("");
    onClose();
  };

  useEffect(() => {
    // async function fetchData() {
    //   // You can await here
    //   let res = await fetchWorkplacesList();
    //   setDropDownList()
    // }
    // fetchData();
  }, []);

  // const handleKeyDown = (e) => {
  //   switch (e.key) {
  //     case "ArrowDown":
  //       setHighlightedIndex((prevIndex) =>
  //         Math.min(prevIndex + 1, filteredItems.length - 1),
  //       );
  //       break;
  //     case "ArrowUp":
  //       setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  //       break;
  //     case "Enter":
  //       if (isOpen && filteredItems.length > 0) {
  //         handleSelect(filteredItems[highlightedIndex]);
  //       }
  //       break;
  //     case "Escape":
  //       onClose();
  //       break;
  //     default:
  //       break;
  //   }
  // };
  return (
    <div
      onClick={() => {
        setIsDropDownOpen(true);
      }}
      onMouseEnter={() => {
        setIsSelectorHovered(true);
      }}
      onMouseLeave={() => {
        setIsSelectorHovered(false);
      }}
      ref={containerRef}
      className={`relative mx-5   border-[1.5px]   border-secondary-blue p-2 hover:cursor-pointer hover:bg-six ${isDropDownOpen ? "rounded-t-xl border-b-0 bg-six" : "rounded-xl"}`}
    >
      <div
        className={`flex items-center justify-between ${isDropDownOpen ? "pb-[1.5px]" : ""}`}
      >
        <div className="flex flex-1 items-center gap-2">
          <RemSizeImage
            imagePath={"/assets/icons/work-space-icon.svg"}
            remWidth={1.343}
            remHeight={1.343}
            alt={"Work-Space"}
          />
          <span className="text-xs font-bold text-black-txt">
            Lexington Ltd.{" "}
          </span>
        </div>

        <button
          className="ml-2"
          onClick={(e) => {
            setIsDropDownOpen((prev) => !prev);
            e.stopPropagation();
          }}
        >
          <RemSizeImage
            imagePath={`/assets/icons/${isSelectorHovered ? "solid-blue-arrowdown-icon" : "solid-lightblue-arrowdown-icon"}.svg`}
            remWidth={1.343}
            remHeight={1.343}
            alt={"Dropdown"}
          />
        </button>
      </div>

      {isDropDownOpen && (
        <div className="absolute -left-[1.5px] -right-[1.5px]  top-[2.4rem] z-10 flex flex-col rounded-b-xl border-[1.5px] border-t-0 border-secondary-blue bg-six ">
          <div className=" border-b-[1.5px] bg-six p-3 px-1">
            <div
              className={`mx-1 flex items-center gap-2 rounded-lg border-[1px] bg-white p-2 ${isFocusActive ? " border-primary-blue" : "border-white"}`}
            >
              <RemSizeImage
                imagePath={
                  isFocusActive
                    ? "/assets/icons/search-blue.svg"
                    : "/assets/icons/search-icon.svg"
                }
                remWidth={1}
                remHeight={1}
                alt={"Search"}
              />
              <input
                autoComplete="off"
                onFocus={() => {
                  setIsFocusActive(true);
                }}
                onBlur={() => {
                  setIsFocusActive(false);
                }}
                type="text"
                placeholder={"Search WorkSpace"}
                onChange={handleSearchChange}
                // onKeyDown={handleKeyDown}
                value={searchQuery}
                className="flex-1 text-black-txt"
              />
            </div>
          </div>
          <ul className=" max-h-60   overflow-y-auto px-2">
            {filteredItems.map((item, index) => (
              <li
                key={index}
                className={`flex cursor-pointer items-center justify-between p-2 py-2 text-black-txt hover:bg-secondary-blue hover:text-primary-blue `}
                onClick={() => handleSelect(item)}
              >
                <span>{item}</span>
                <RemSizeImage
                  imagePath={`/assets/icons/active-workspace.svg`}
                  remWidth={1.343}
                  remHeight={1.343}
                  alt={"Work-Space"}
                />
              </li>
            ))}
            <li
              key={"add-item"}
              className="flex items-center gap-2 py-2 text-sm"
            >
              <RemSizeImage
                imagePath={`/assets/icons/add-blue-outline.svg`}
                remWidth={1}
                remHeight={1}
                alt={"Add"}
              />
              <span className="font-semibold text-primary-blue">
                Add a Workspace
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  function onClose() {
    if (isDropDownOpen) {
      debugger;
      setIsDropDownOpen(false);
    }
  }
}

export default WorkSpaceSelector;
