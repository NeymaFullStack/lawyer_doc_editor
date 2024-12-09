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
    return {
      setZoom:
        (zoomLevel: number) =>
        ({ commands }) => {
          const zoomContent = document.getElementById("zoomContent");
          if (zoomContent) {
            zoomContent.style.transform = `scale(${zoomLevel})`;
            if (zoomLevel >= 1) {
              zoomContent.style.transformOrigin = "top left";

              const scrollContent = zoomContent?.parentElement?.parentElement;
              if (scrollContent) {
                scrollContent.scrollLeft =
                  (scrollContent.scrollWidth - scrollContent.clientWidth) / 2;
              }
            } else {
              zoomContent.style.transformOrigin = "top center";
            }

            return true;
          }
          return false; // Return false if no editor DOM element is found
        },

      resetZoom:
        () =>
        ({ commands }) => {
          const editorDom = document.getElementById("zoomContent");
          if (editorDom) {
            editorDom.style.transform = "scale(1)";
            return true;
          }
          return false; // Return false if no editor DOM element is found
        },
    };
  },
});
