import { mergeAttributes } from "@tiptap/core";
import { BulletList } from "@tiptap/extension-bullet-list";
import { idAttributes } from "@/lib/id";

export const LoganBulletList = BulletList.extend({
  // content: `listItem*`,
  // addAttributes() {
  //   return idAttributes;
  // },
  // renderHTML({ node, HTMLAttributes }) {
  //   if (HTMLAttributes.id) {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     node.attrs.id = HTMLAttributes.id;
  //   }
  //   return [
  //     "ul",
  //     mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //     0,
  //   ];
  // },
});
