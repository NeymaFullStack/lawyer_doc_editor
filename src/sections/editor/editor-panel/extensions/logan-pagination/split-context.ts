import { Node, Schema } from "@tiptap/pm/model";

type SplitInfo = {
  pos: number;
  depth: number;
  attributes?: Record<string, any>;
};

export class SplitContext {
  private doc: Node;
  private accumulatedHeight = 0;
  private pageBoundary: SplitInfo | null = null;
  private height = 0;
  private paragraphDefaultHeight: number = 0;
  public attributes: Record<string, any> = {};
  private schema: Schema;

  constructor(
    schema: Schema,
    doc: Node,
    height: number,
    paragraphDefaultHeight: number
  ) {
    this.doc = doc;
    this.height = height;
    this.schema = schema;
    this.paragraphDefaultHeight = paragraphDefaultHeight;
  }

  get getDoc(): Node {
    return this.doc;
  }

  get getHeight(): number {
    return this.height;
  }

  get getDefaultHeight(): number {
    return this.paragraphDefaultHeight;
  }

  get getPageBoundary(): SplitInfo | null {
    return this.pageBoundary;
  }

  get getLastPage(): Node | null {
    return this.doc.lastChild;
  }

  isOverflow(height: number): boolean {
    return this.accumulatedHeight + height > this.height;
  }

  isOverflowTest(height: number): boolean {
    const diffHeight = this.accumulatedHeight + height - this.height;
    return diffHeight > this.paragraphDefaultHeight && this.isOverflow(height);
  }

  addHeight(height: number): void {
    this.accumulatedHeight = height;
  }

  setBoundary(pos: number, depth: number): void {
    this.pageBoundary = { pos, depth };
  }

  splitResolve(pos: number): any {
    // @ts-ignore
    const array = this.doc.resolve(pos).path;
    const chunks = [];
    if (array.length <= 3) return array;
    const size = 3;
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
