import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { debounce } from "lodash";

const DropdownSearchSelector = ({
  items,
  onSelect,
  placeholder = "Select an item",
  containerRef,
  onClose,
  isOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

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
    return items.filter((item) =>
      item.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [items, debouncedSearchQuery]);

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

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredItems.length - 1),
        );
        break;
      case "ArrowUp":
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;
      case "Enter":
        if (isOpen && filteredItems.length > 0) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <div className="absolute top-[2rem]">
      <div className=" border-bg-six border-secondary-blue p-3">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border border-gray-300 p-2"
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          value={searchQuery}
        />
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto border border-gray-300 bg-white">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li
                key={item}
                className={`cursor-pointer p-2 ${highlightedIndex === index ? "bg-gray-200" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No items found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearchSelector;

// Example usage
// const items = ["Apple", "Banana", "Cherry", "Date", "Fig", "Grape", "Honeydew"];

// function App() {
//   const handleSelect = (item) => {
//   };

//   return (
//     <div className="p-4">
//       <DropdownSearchSelector items={items} onSelect={handleSelect} />
//     </div>
//   );
// }

// export default App;
