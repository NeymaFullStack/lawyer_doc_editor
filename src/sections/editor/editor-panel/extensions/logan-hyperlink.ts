import { Link as BaseLink } from "@tiptap/extension-link";
import { markInputRule } from "@tiptap/core";

const extractHrefFromMatch = (match: any) => {
  return { href: match.groups.href };
};

export const extractHrefFromMarkdownLink = (match: any) => {
  match.pop();
  return extractHrefFromMatch(match);
};

export const LoganHyperLink = BaseLink.configure({
  openOnClick: false,
}).extend({
  inclusive: false,

  addInputRules() {
    const urlSyntaxRegExp =
      //@ts-ignore
      /(?:^|\s)(?<href>(?:https?:\/\/|www\.)[\S]+)(?:\s|\n)$/gim;

    return [
      markInputRule({
        find: urlSyntaxRegExp,
        type: this.type,
        getAttributes: extractHrefFromMatch,
      }),
    ];
  },
});
