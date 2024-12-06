import { Extension } from "@tiptap/core";

export const LoganHotKey = Extension.create({
  name: "LoganHotKey",

  addKeyboardShortcuts() {
    return {
      "mod-q": () => {
        this.editor.commands.toggleBold();
        return true;
      },
      "mod-i": () => {
        this.editor.commands.toggleItalic();
        return true;
      },
      "mod-u": () => {
        this.editor.commands.toggleUnderline();
        return true;
      },
      "mod-l": () => {
        this.editor.chain().focus().toggleOrderedList().run();
        return true;
      },
      "mod-;": () => {
        this.editor.chain().focus().toggleBulletList().run();
        return true;
      },
      "mod-k": () => {
        this.editor.chain().focus().toggleLink({ href: "" }).run();
        return true;
      },
    };
  },
});
