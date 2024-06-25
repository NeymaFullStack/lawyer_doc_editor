import React, { useEffect, useRef } from "react";

const ArticleMenu = ({ items = [], onClick, isOpen, onClose, position }) => {
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.removeEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (item) => {
    onClick(item);
    onClose();
  };

  return (
    <div
      className="relative"
      ref={menuRef}
      style={{
        display: isOpen ? "block" : "none",
        top: position.top,
        left: position.left,
      }}
    >
      <ul className="absolute mt-2 w-48 rounded border bg-white shadow-lg">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => handleMenuItemClick(item)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleMenu;
