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
  const [toolTipPos, setToolTipPos] = useState({
    top: -9999, // Initially place it off-screen
    left: -9999,
  });
  const handleClickOutside = (event) => {
    if (toolTipRef.current && !toolTipRef.current.contains(event.target)) {
      onClose();
    }
  };

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

// import React, { useEffect, useRef } from "react";
// import {
//   useFloating,
//   shift,
//   flip,
//   offset,
//   autoUpdate,
//   autoPlacement,
// } from "@floating-ui/react";

// function PositionToolTip({ children, onClose, isOpen, position }) {
//   const toolTipRef = useRef(null);

//   // Use `useFloating` hook to manage the floating element (tooltip)
//   const { x, y, strategy, refs, update } = useFloating({
//     placement: "bottom-start", // default placement, can be customized
//     whileElementsMounted: autoUpdate,
//     middleware: [
//       offset(12), // Adds space between reference and tooltip
//       shift(), // Prevents it from overflowing the container boundary
//     ],
//   });

//   // Adjust the tooltip position when `isOpen` or `position` changes
//   useEffect(() => {
//     if (isOpen && position) {
//       refs.setReference({
//         getBoundingClientRect: () => ({
//           width: 0,
//           height: 0,
//           top: position.top,
//           left: position.left,
//           right: position.left,
//           bottom: position.top,
//         }),
//       });
//     }
//   }, [isOpen, position, refs]);

//   // Automatically update the tooltip position on window resize or scroll
//   useEffect(() => {
//     if (toolTipRef.current) {
//       return autoUpdate(refs.reference, refs.floating, update);
//     }
//   }, [refs, update]);

//   return (
//     <div
//       onBlur={onClose}
//       className={`fixed z-10 w-fit rounded-xl border bg-white p-2 text-primary-gray shadow-3d`}
//       ref={refs.setFloating} // Set the floating element reference
//       style={{
//         display: isOpen ? "block" : "none",
//         position: strategy,
//         top: y ?? 0, // Use floating UI's calculated position
//         left: x ?? 0, // Use floating UI's calculated position
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// export default PositionToolTip;
