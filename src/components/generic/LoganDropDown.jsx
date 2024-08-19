"use client";
import { Dropdown } from "antd";
import React, { useRef, useState } from "react";

function LoganDropDown({
  baseElement,
  dropDownMenu = [],
  customDropDownMenu,
  placement = "",
  trigger,
  overlayStyle,
  className,
  rootClassName,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef();
  console.log("openMenu", openMenu);
  return (
    <div ref={dropdownRef} className="flex items-center">
      <Dropdown
        autoAdjustOverflow
        rootClassName={rootClassName}
        className={className}
        trigger={trigger || "click"}
        getPopupContainer={() => dropdownRef.current}
        onOpenChange={(value) => setOpenMenu(value)}
        open={openMenu}
        overlayStyle={overlayStyle}
        menu={dropDownMenu}
        {...(customDropDownMenu !== undefined &&
          customDropDownMenu !== false &&
          customDropDownMenu !== null && {
            dropdownRender: (menus) => customDropDownMenu({ menus, closeMenu }),
          })}
        placement={placement}
      >
        {baseElement}
      </Dropdown>
    </div>
  );

  function closeMenu() {
    setOpenMenu(false);
  }
}

export default LoganDropDown;
