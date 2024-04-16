import { AutoComplete } from "antd";
import React, { useState } from "react";
import RemSizeImage from "./RemSizeImage";

function LoganAutoComplete() {
  const [isFocusActive, setIsFocusActive] = useState(false);
  return (
    <AutoComplete
      className={`logan-autocomplete  ${
        isFocusActive && " border-primary-blue"
      }`}
    >
      <div className="flex items-center gap-3">
        <RemSizeImage
          imagePath={
            isFocusActive
              ? "/assets/icons/search-blue.svg"
              : "/assets/icons/search-icon.svg"
          }
          remWidth={1.25}
          remHeight={1.25}
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
          placeholder={"Search a client, document..."}
          type="text"
          className="bg-six w-full"
        ></input>
      </div>
    </AutoComplete>
  );
}

export default LoganAutoComplete;
