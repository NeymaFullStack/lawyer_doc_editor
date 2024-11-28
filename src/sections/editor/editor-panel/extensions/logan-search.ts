import { Extension, Range, type Dispatch } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import {
  Plugin,
  PluginKey,
  type EditorState,
  type Transaction,
} from "@tiptap/pm/state";
import { Node as PMNode } from "@tiptap/pm/model";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    search: {
      setSearchTerm: (searchTerm: string) => ReturnType;
      setReplaceTerm: (replaceTerm: string) => ReturnType;
      setCaseSensitive: (caseSensitive: boolean) => ReturnType;
      setIgnoreDiacritics: (ignoreDiacritics: boolean) => ReturnType;
      resetIndex: () => ReturnType;
      nextSearchResult: () => ReturnType;
      previousSearchResult: () => ReturnType;
      replace: () => ReturnType;
      replaceAll: () => ReturnType;
    };
  }
}

interface TextNodesWithPosition {
  text: string;
  pos: number;
}

const getRegex = (
  s: string,
  disableRegex: boolean,
  caseSensitive: boolean,
  ignoreDiacritics: boolean
): RegExp => {
  if (ignoreDiacritics) {
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return RegExp(
    disableRegex ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : s,
    caseSensitive ? "gu" : "gui"
  );
};

interface ProcessedSearches {
  decorationsToReturn: DecorationSet;
  results: Range[];
}

function processSearches(
  doc: PMNode,
  searchTerm: RegExp,
  searchResultClass: string,
  resultIndex: number,
  ignoreDiacritics: boolean
): ProcessedSearches {
  const decorations: Decoration[] = [];
  const results: Range[] = [];

  let textNodesWithPosition: TextNodesWithPosition[] = [];
  let index = 0;

  if (!searchTerm) {
    return {
      decorationsToReturn: DecorationSet.empty,
      results: [],
    };
  }

  doc?.descendants((node, pos) => {
    if (node.isText) {
      let textContent: any = node.text;

      if (ignoreDiacritics) {
        textContent = textContent
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }

      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + textContent,
          pos: textNodesWithPosition[index].pos,
        };
      } else {
        textNodesWithPosition[index] = {
          text: textContent,
          pos,
        };
      }
    } else {
      index += 1;
    }
  });

  textNodesWithPosition = textNodesWithPosition.filter(Boolean);

  for (const element of textNodesWithPosition) {
    const { text, pos } = element;
    const matches = Array.from(text.matchAll(searchTerm)).filter(
      ([matchText]) => matchText.trim()
    );

    for (const m of matches) {
      if (m[0] === "") break;

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length,
        });
      }
    }
  }

  for (let i = 0; i < results.length; i += 1) {
    const r = results[i];
    const className =
      i === resultIndex
        ? `${searchResultClass} search-result-current`
        : searchResultClass;
    const decoration: Decoration = Decoration.inline(r.from, r.to, {
      class: className,
    });

    decorations.push(decoration);
  }

  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results,
  };
}

const replace = (
  replaceTerm: string,
  results: Range[],
  { state, dispatch }: { state: EditorState; dispatch: Dispatch }
) => {
  const firstResult = results[0];

  if (!firstResult) return;

  const { from, to } = results[0];

  if (dispatch) dispatch(state.tr.insertText(replaceTerm, from, to));
};

const rebaseNextResult = (
  replaceTerm: string,
  index: number,
  lastOffset: number,
  results: Range[]
): [number, Range[]] | null => {
  const nextIndex = index + 1;

  if (!results[nextIndex]) return null;

  const { from: currentFrom, to: currentTo } = results[index];

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset;

  const { from, to } = results[nextIndex];

  results[nextIndex] = {
    to: to - offset,
    from: from - offset,
  };

  return [offset, results];
};

const replaceAll = (
  replaceTerm: string,
  results: Range[],
  { tr, dispatch }: { tr: Transaction; dispatch: Dispatch }
) => {
  let offset = 0;

  let resultsCopy = results.slice();

  if (!resultsCopy.length) return;

  for (let i = 0; i < resultsCopy.length; i += 1) {
    const { from, to } = resultsCopy[i];

    tr.insertText(replaceTerm, from, to);

    const rebaseNextResultResponse = rebaseNextResult(
      replaceTerm,
      i,
      offset,
      resultsCopy
    );

    if (!rebaseNextResultResponse) continue;

    offset = rebaseNextResultResponse[0];
    resultsCopy = rebaseNextResultResponse[1];
  }

  dispatch && dispatch(tr);
};

export const searchAndReplacePluginKey = new PluginKey(
  "searchAndReplacePlugin"
);

export interface SearchAndReplaceOptions {
  searchResultClass: string;
  disableRegex: boolean;
}

export interface SearchAndReplaceStorage {
  searchTerm: string;
  replaceTerm: string;
  results: Range[];
  lastSearchTerm: string;
  caseSensitive: boolean;
  lastCaseSensitive: boolean;
  resultIndex: number;
  lastResultIndex: number;
}

export const LoganSearch = Extension.create<
  SearchAndReplaceOptions,
  SearchAndReplaceStorage
>({
  name: "searchAndReplace",

  addOptions() {
    return {
      searchResultClass: "search-result",
      disableRegex: true,
      ignoreDiacritics: false,
    };
  },

  addStorage() {
    return {
      searchTerm: "",
      replaceTerm: "",
      results: [],
      lastSearchTerm: "",
      ignoreDiacritics: false,
      caseSensitive: false,
      lastCaseSensitive: false,
      resultIndex: 0,
      lastResultIndex: 0,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm;

          return false;
        },
      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm;

          return false;
        },
      setCaseSensitive:
        (caseSensitive: boolean) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive;

          return false;
        },
      setIgnoreDiacritics:
        (ignoreDiacritics: boolean) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.ignoreDiacritics = ignoreDiacritics;
          return false;
        },
      resetIndex:
        () =>
        ({ editor }) => {
          editor.storage.searchAndReplace.resultIndex = 0;

          return false;
        },
      nextSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace;

          const nextIndex = resultIndex + 1;

          if (results[nextIndex]) {
            editor.storage.searchAndReplace.resultIndex = nextIndex;
          } else {
            editor.storage.searchAndReplace.resultIndex = 0;
          }

          return false;
        },
      previousSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace;

          const prevIndex = resultIndex - 1;

          if (results[prevIndex]) {
            editor.storage.searchAndReplace.resultIndex = prevIndex;
          } else {
            editor.storage.searchAndReplace.resultIndex = results.length - 1;
          }

          return false;
        },
      replace:
        () =>
        ({ editor, state, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace;

          replace(replaceTerm, results, { state, dispatch });

          return false;
        },
      replaceAll:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace;

          replaceAll(replaceTerm, results, { tr, dispatch });

          return false;
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    const { searchResultClass, disableRegex } = this.options;

    const setLastSearchTerm = (t: string) =>
      (editor.storage.searchAndReplace.lastSearchTerm = t);
    const setLastCaseSensitive = (t: boolean) =>
      (editor.storage.searchAndReplace.lastCaseSensitive = t);
    const setLastResultIndex = (t: number) =>
      (editor.storage.searchAndReplace.lastResultIndex = t);

    return [
      new Plugin({
        key: searchAndReplacePluginKey,

        state: {
          init: () => DecorationSet.empty,

          apply({ doc, docChanged }, oldState) {
            const {
              searchTerm,
              lastSearchTerm,
              caseSensitive,
              lastCaseSensitive,
              resultIndex,
              lastResultIndex,
            } = editor.storage.searchAndReplace;

            if (
              !docChanged &&
              lastSearchTerm === searchTerm &&
              lastCaseSensitive === caseSensitive &&
              lastResultIndex === resultIndex
            ) {
              return oldState;
            }

            setLastSearchTerm(searchTerm);
            setLastCaseSensitive(caseSensitive);
            setLastResultIndex(resultIndex);

            if (!searchTerm) {
              editor.storage.searchAndReplace.results = [];
              return DecorationSet.empty;
            }

            const { decorationsToReturn, results } = processSearches(
              doc,
              getRegex(
                searchTerm,
                disableRegex,
                caseSensitive,
                editor.storage.searchAndReplace.ignoreDiacritics
              ),
              searchResultClass,
              resultIndex,
              editor.storage.searchAndReplace.ignoreDiacritics
            );

            editor.storage.searchAndReplace.results = results;

            return decorationsToReturn;
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
