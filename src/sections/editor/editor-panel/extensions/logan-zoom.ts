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
          const editorDom = document.getElementById("zoomContent");
          if (editorDom) {
            editorDom.style.transform = `scale(${zoomLevel})`;
            editorDom.style.transformOrigin = "0 0";
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
