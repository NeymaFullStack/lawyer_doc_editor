import { Node } from "@tiptap/pm/model";
import { SplitContext } from "./split-context";

export type ComputedFn = (
  splitContext: SplitContext,
  node: Node,
  pos: number,
  parent: Node | null,
  dom: HTMLElement
) => boolean;

export type NodesComputed = Record<string, ComputedFn>;

export type PageOptions = {
  footerHeight: number;
  headerHeight: number;
  bodyHeight: number;
  bodyWidth: number;
  bodyPadding: number;
  isPaging?: boolean;
  mode?: 1 | 2 | 3;
  headerData?: any[];
  footerData?: any[];
  NodesComputed?: NodesComputed;
  SystemAttributes?: Record<string, any>;
};
