import React, { useEffect, useRef, useState } from "react";

function PositionToolTip({
  children,
  onClose,
  isOpen,
  position,
  containerRef,
}) {
  const toolTipRef = useRef(null);
  const [toolTipRect, setToolTipRect] = useState(null);
  const [toolTipPos, setToolTipPos] = useState(null);
  const handleClickOutside = (event) => {
    if (toolTipRef.current && !toolTipRef.current.contains(event.target)) {
      onClose();
    }
  };
  console.log("containerRef", containerRef.getBoundingClientRect());
  console.log("position", position);
  console.log("toolTipRef", toolTipRef?.current);

  useEffect(() => {
    isOpen && document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      setToolTipPos(null);
    };
  }, [isOpen]);

  useEffect(() => {
    if (toolTipRect && containerRef && position) {
      let { width: toolTipWidth, height: toolTipHeight } = toolTipRect;
      let {
        width: containerWidth,
        height: containerHeight,
        left: containerLeft,
        top: containerTop,
      } = containerRef.getBoundingClientRect();
      let { left: triggerLeft, top: triggerTop } = position;
      let [toolTipTop, toolTipLeft] = [triggerTop, triggerLeft];
      const horizontalSpace =
        containerLeft + containerWidth - (triggerLeft + 15);
      const verticalSpace = containerTop + containerHeight - (triggerTop + 15);
      if (toolTipWidth > horizontalSpace) {
        toolTipLeft = triggerLeft - (toolTipWidth - horizontalSpace);
        toolTipLeft -= 30; //taking extra space into account
      }
      if (toolTipHeight > verticalSpace) {
        toolTipTop = triggerTop - (toolTipHeight - verticalSpace);
        toolTipTop -= 55; //taking extra space into account
      }
      if (toolTipHeight < verticalSpace && toolTipWidth < horizontalSpace) {
        toolTipLeft += 12; //taking extra space into account
        toolTipTop += 12; //taking extra space into account
      } else if (
        toolTipHeight < verticalSpace &&
        toolTipWidth > horizontalSpace
      ) {
        toolTipTop += 20; //taking extra space into account
      } else if (
        toolTipHeight > verticalSpace &&
        toolTipWidth < horizontalSpace
      ) {
        toolTipLeft += 20; //taking extra space into account
      }
      setToolTipPos({ top: toolTipTop, left: toolTipLeft });
    }
  }, [position, toolTipRect, containerRef]);

  useEffect(() => {
    const handleResize = (entries) => {
      for (let entry of entries) {
        setToolTipRect(entry.contentRect);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (toolTipRef.current) {
      resizeObserver.observe(toolTipRef.current);
    }

    return () => {
      if (toolTipRef.current) {
        resizeObserver.unobserve(toolTipRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`shadow-3d fixed z-10 w-fit rounded-xl border bg-white p-2 text-primary-gray `}
      ref={toolTipRef}
      style={{
        display: isOpen ? "block" : "none",
        top: toolTipPos?.top ? toolTipPos?.top : position.top + 15,
        left: toolTipPos?.left ? toolTipPos?.left : position.left + 15,
      }}
    >
      {children}
    </div>
  );
}

export default PositionToolTip;
