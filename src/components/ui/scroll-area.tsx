"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const isScrolling = React.useRef(false); // To prevent overlapping animations
  const velocity = React.useRef({ x: 0, y: 0 }); // Track velocity

  const smoothScroll = () => {
    if (scrollAreaRef.current) {
      const element = scrollAreaRef.current;

      // Reduce velocity gradually
      velocity.current.x *= 0.9;
      velocity.current.y *= 0.9;

      if (Math.abs(velocity.current.x) < 0.1) velocity.current.x = 0;
      if (Math.abs(velocity.current.y) < 0.1) velocity.current.y = 0;

      // Apply smooth scrolling
      element.scrollLeft += velocity.current.x;
      element.scrollTop += velocity.current.y;

      // Stop the animation if velocity is negligible
      if (velocity.current.x !== 0 || velocity.current.y !== 0) {
        requestAnimationFrame(smoothScroll);
      } else {
        isScrolling.current = false;
      }
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (scrollAreaRef.current) {
      // Update velocity
      velocity.current.x += event.deltaX;
      velocity.current.y += event.deltaY;

      // Start animation loop if not already running
      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScroll();
      }
    }
  };

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={scrollAreaRef}
        className="h-full w-full rounded-[inherit]"
        onWheel={handleWheel}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors bg-logan-primary-200 rounded-full",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px] mr-2",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-logan-primary-300" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
