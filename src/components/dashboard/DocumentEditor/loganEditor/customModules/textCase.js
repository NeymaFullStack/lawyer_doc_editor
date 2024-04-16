import { Quill } from "react-quill";
var Parchment = Quill.import("parchment");
class UppercaseAttributor extends Parchment.Attributor.Class {
  add(node, value) {
    if (value === false) {
      this.remove(node);
      return true;
    }
    return super.add(node, value);
  }
}

const upperCase = new UppercaseAttributor("upperCase", "ql-upperCase", {
  scope: Parchment.Scope.INLINE,
  whitelist: ["active"],
});

export function handleCaseChange() {
  let range = this.quill.getSelection();
  let formats = this.quill.getFormat(range);
  let textCase = formats.upperCase ? false : "active";

  this?.quill && this?.quill.format("upperCase", textCase, Quill.sources.USER);
}

export { upperCase };
