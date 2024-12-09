import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    zoom: {
      setZoom: (zoomLevel: number) => ReturnType;
      resetZoom: () => ReturnType;
      increaseZoom: () => ReturnType;
      decreaseZoom: () => ReturnType;
    };
  }
}

export const LoganZoom = Extension.create({
  name: "zoom",

  addOptions() {
    return {
      levels: [1, 1.25, 1.5, 2, 2.5, 3],
      defaultLevel: 1,
      minZoom: 0.5,
      maxZoom: 3,
      onZoomChange: (zoomLevel: number) => {
        const zoomLevelElement = document.getElementById("zoomLevel");
        if (zoomLevelElement) {
          zoomLevelElement.innerText = `${zoomLevel * 100}%`;
        }
      },
    };
  },

  addCommands() {
    return {
      setZoom: (zoomLevel: number) => {
        return () => {
          if (
            zoomLevel < this.options.minZoom ||
            zoomLevel > this.options.maxZoom
          ) {
            return false;
          }

          const editorDom = this.editor.view.dom as HTMLElement;
          editorDom.style.transform = `scale(${zoomLevel})`;
          editorDom.style.transformOrigin = "top left";
          editorDom.style.transition = "transform 0.2s ease-in-out";

          // Emit the zoom level
          this.options.onZoomChange(zoomLevel);
          return true;
        };
      },

      resetZoom: () => {
        return () => {
          const defaultLevel = this.options.defaultLevel;
          const editorDom = this.editor.view.dom as HTMLElement;
          editorDom.style.transform = `scale(${defaultLevel})`;

          // Emit the default zoom level
          this.options.onZoomChange(defaultLevel);
          return true;
        };
      },

      increaseZoom: () => {
        return () => {
          const currentZoom = this.editor.view.dom.style.transform.match(
            /scale\((\d+(\.\d+)?)\)/
          );
          let zoomLevel = currentZoom
            ? parseFloat(currentZoom[1])
            : this.options.defaultLevel;

          zoomLevel = Math.min(zoomLevel + 0.25, this.options.maxZoom);
          return this.editor.commands.setZoom(zoomLevel);
        };
      },

      decreaseZoom: () => {
        return () => {
          const currentZoom = this.editor.view.dom.style.transform.match(
            /scale\((\d+(\.\d+)?)\)/
          );
          let zoomLevel = currentZoom
            ? parseFloat(currentZoom[1])
            : this.options.defaultLevel;

          zoomLevel = Math.max(zoomLevel - 0.25, this.options.minZoom);
          return this.editor.commands.setZoom(zoomLevel);
        };
      },
    };
  },
});
