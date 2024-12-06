import { Editor, isTextSelection } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";

export const idAttribs = {
  id: {
    parseHTML: (element: HTMLElement) => element.getAttribute("id"),
    renderHTML: (attributes: { id?: string }) => {
      if (!attributes.id) return {};
      return {
        id: attributes.id,
      };
    },
  },
};

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

type MapFn<T, R> = (arg: T) => R;

function mapSelf<T>(d: T): T {
  return d;
}

export function useAttributes<T, R>(
  editor: Editor,
  attribute: string,
  defaultValue: T,
  map?: MapFn<T, R>
): R {
  const mapFn = (map || mapSelf) as MapFn<T, R>;
  const [value, setValue] = useState<R>(mapFn(defaultValue));
  const prevValueCache = useRef<R>(value);

  useEffect(() => {
    const listener = () => {
      const attrs = { ...defaultValue, ...editor.getAttributes(attribute) };
      const nextAttrs = mapFn(attrs);

      if (deepEqual(prevValueCache.current, nextAttrs)) {
        return;
      }

      setValue(nextAttrs);
      prevValueCache.current = nextAttrs;
    };

    editor.on("transaction", listener);

    return () => {
      editor.off("transaction", listener);
    };
  }, [editor, defaultValue, attribute, mapFn]);

  return value;
}

type IsTextSelected = (editor: Editor) => boolean;

export const isTextSelected: IsTextSelected = (editor) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export default isTextSelected;
