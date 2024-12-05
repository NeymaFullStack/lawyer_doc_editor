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

  addOptions() {
    return {
      levels: [1, 1.25, 1.5, 2], // Default zoom levels
      defaultLevel: 1,
    };
  },

  addCommands() {
    return {
      setZoom:
        (zoomLevel: number) =>
        ({ editor }) => {
          const editorDom = editor.view.dom as HTMLElement;
          editorDom.style.transform = `scale(${zoomLevel})`;
          editorDom.style.transformOrigin = "-50 -50";
          return true;
        },
      resetZoom:
        () =>
        ({ editor }) => {
          const editorDom = editor.view.dom as HTMLElement;
          editorDom.style.transform = "scale(1)";
          return true;
        },
    };
  },
});
