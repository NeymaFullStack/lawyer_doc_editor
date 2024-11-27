import { HeadingOptions } from "@tiptap/extension-heading";
import { Extension } from "@tiptap/react";
import { LoganHeading } from "./logan-heading";
import { LoganText } from "./logan-text";
import { LoganParagraph } from "./logan-paragraph";
import { PageExtension } from "./logan-pagination/logan-pagination";
import { LoganDocument } from "./logan-document";
import { LoganBold } from "./logan-bold";
import { LoganItalic } from "./logan-italic";
import { LoganUnderline } from "./logan-underline";
import { LoganHistory } from "./logan-history";
import { LoganColor } from "./logan-color";
import { LoganHighlight } from "./logan-highlight";
import { LoganImage } from "./logan-image";
import { LoganBulletList } from "./logan-bullets";
import { LoganOrderedList } from "./logan-ordered-list";
import { LoganListItem } from "./logan-listitem";
import { LoganTextStyle } from "./logan-text-style";

export interface LoganKitOptions {
  heading: Partial<HeadingOptions> | false;
}

export const LoganKit = Extension.create<LoganKitOptions>({
  name: "LoganKIT",
  addExtensions() {
    const extensions: any[] = [
      PageExtension,
      LoganDocument,
      LoganHeading,
      LoganText,
      LoganParagraph,
      LoganHistory,
      LoganBold,
      LoganItalic,
      LoganUnderline,
      LoganColor,
      LoganHighlight,
      LoganTextStyle,
      LoganBulletList,
      LoganOrderedList,
      LoganListItem,
      LoganImage,
    ];
    return extensions;
  },
});
