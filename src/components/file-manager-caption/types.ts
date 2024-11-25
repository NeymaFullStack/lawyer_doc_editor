export type ViewType = "list" | "grid";

export type ViewContextProps = {
  view: ViewType;
  setView: (view: ViewType) => void;
};
