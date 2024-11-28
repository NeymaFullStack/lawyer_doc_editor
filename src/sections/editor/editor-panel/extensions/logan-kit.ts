import { HeadingOptions } from "@tiptap/extension-heading";
import { Extension } from "@tiptap/react";
import { LoganHeading } from "./logan-heading";
import { LoganText } from "./logan-text";
import { LoganParagraph } from "./logan-paragraph";
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
import { LoganLink } from "./logan-link";
import { LoganSearch } from "./logan-search";
import {
  PageNode,
  PaginationExtension,
} from "./logan-pagination/logan-page-extention";

export interface LoganKitOptions {
  heading: Partial<HeadingOptions> | false;
}

export const LoganKit = Extension.create<LoganKitOptions>({
  name: "LoganKIT",
  addExtensions() {
    const extensions: any[] = [
      // PageExtension,
      PaginationExtension,
      PageNode,
      LoganDocument,
      LoganHeading,
      LoganText,
      LoganParagraph,
      LoganSearch.configure({
        searchResultClass: "font-semibold bg-logan-primary-50 text-logan-blue",
        disableRegex: false,
      }),
      LoganLink,
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
