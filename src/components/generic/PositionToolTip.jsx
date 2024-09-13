import React, { useEffect, useRef, useState } from "react";
let prevContainerRefLeft = 0;
function PositionToolTip({
  children,
  onClose,
  isOpen,
  position,
  containerRef,
}) {
  const toolTipRef = useRef(null);
  const [toolTipRect, setToolTipRect] = useState(null);
  const [toolTipPos, setToolTipPos] = useState({
    top: -9999, // Initially place it off-screen
    left: -9999,
  });

  const calculateTooltipPosition = () => {
    if (toolTipRef.current && containerRef && position) {
      let { width: toolTipWidth, height: toolTipHeight } =
        toolTipRef.current.getBoundingClientRect();
      let {
        width: containerWidth,
        height: containerHeight,
        left: containerLeft,
        top: containerTop,
      } = containerRef.getBoundingClientRect();
      let { left: triggerLeft, top: triggerTop } = position;
      let toolTipTop = triggerTop;
      let toolTipLeft = triggerLeft;
      if (
        prevContainerRefLeft !== 0 &&
        prevContainerRefLeft !== containerLeft
      ) {
        toolTipLeft = triggerLeft - (prevContainerRefLeft - containerLeft);
      }
      prevContainerRefLeft = containerLeft;
      const horizontalSpace =
        containerLeft + containerWidth - (toolTipLeft + 15);
      const verticalSpace = containerTop + containerHeight - (triggerTop + 15);

      if (toolTipWidth > horizontalSpace) {
        toolTipLeft = toolTipLeft - (toolTipWidth - horizontalSpace) - 30;
      }
      if (toolTipHeight > verticalSpace) {
        toolTipTop = triggerTop - (toolTipHeight - verticalSpace) - 55;
      }
      if (toolTipHeight < verticalSpace && toolTipWidth < horizontalSpace) {
        toolTipLeft += 12;
        toolTipTop += 12;
      } else if (
        toolTipHeight < verticalSpace &&
        toolTipWidth > horizontalSpace
      ) {
        toolTipTop += 20;
      } else if (
        toolTipHeight > verticalSpace &&
        toolTipWidth < horizontalSpace
      ) {
        toolTipLeft += 20;
      }
      setToolTipPos({ top: toolTipTop, left: toolTipLeft });
    }
  };

  const handleClickOutside = (event) => {
    if (toolTipRef.current && !toolTipRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Handle click outside to close tooltip
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      setToolTipPos(null);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Recalculate tooltip position when position or container changes
  useEffect(() => {
    calculateTooltipPosition();
  }, [position, toolTipRef, containerRef]);

  // Observe both tooltip and container size changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(calculateTooltipPosition);
    // const mutationObserver = new MutationObserver(() => {
    //   calculateTooltipPosition();
    // });

    if (containerRef) {
      console.log("node", containerRef.parentNode.parentNode.parentNode);
      resizeObserver.observe(containerRef.parentNode.parentNode.parentNode);
      // mutationObserver.observe(containerRef.parentNode.parentNode, {});
    }

    if (toolTipRef.current) {
      resizeObserver.observe(toolTipRef.current);
    }

    return () => {
      if (toolTipRef.current) {
        resizeObserver.unobserve(toolTipRef.current);
      }
      if (containerRef) {
        resizeObserver.unobserve(containerRef);
        // mutationObserver.disconnect();
      }
    };
  }, [containerRef, toolTipRef]);

  console.log("pos", toolTipPos);

  return (
    <>
      {toolTipPos?.top && toolTipPos?.left && (
        <div
          className={`fixed z-10 w-fit rounded-xl border border-none bg-white p-2 text-primary-gray shadow-3d outline-none`}
          ref={toolTipRef}
          style={{
            top: toolTipPos?.top,
            left: toolTipPos?.left,
            visibility: toolTipPos.top === -9999 ? "hidden" : "visible", // Hide until properly positioned
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}

export default PositionToolTip;
