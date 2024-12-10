import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    zoom: {
      setZoom: (zoomLevel: number) => ReturnType;
      resetZoom: () => ReturnType;
    };
  }
}

export const LoganZoom = Extension.create({
  name: "zoom",

  addCommands() {
    const getZoomContent = () => document.getElementById("zoomContent");
    const getScrollContent = (zoomContent: HTMLElement | null) =>
      zoomContent?.parentElement?.parentElement as HTMLElement | null;

    return {
      setZoom:
        (zoomLevel: number) =>
        ({ commands }) => {
          const zoomContent = getZoomContent();

          if (zoomContent) {
            zoomContent.style.transform = `scale(${zoomLevel})`;

            if (zoomLevel >= 1) {
              zoomContent.style.transformOrigin = "top left";
              const scrollContent = getScrollContent(zoomContent);
              if (scrollContent) {
                scrollContent.scrollLeft =
                  (scrollContent.scrollWidth - scrollContent.clientWidth) / 2;
              }
            } else {
              zoomContent.style.transformOrigin = "top center";
            }

            return true;
          }
          return false;
        },

      resetZoom:
        () =>
        ({ commands }) => {
          const zoomContent = getZoomContent();
          if (zoomContent) {
            zoomContent.style.transform = "scale(1)";
            return true;
          }
          return false;
        },
    };
  },
});
