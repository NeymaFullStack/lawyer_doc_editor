"use client";

import { useCallback, useMemo, useReducer } from "react";
import { ActionMapType, RefreshStateType } from "./type";
import { RefreshContext } from "./refresh-context";

type RefreshProviderProps = {
  children: React.ReactNode;
};

enum Types {
  TRIGGER_WORKSPACE_REFRESH = "TRIGGER_WORKSPACE_REFRESH",
}

type Payload = {
  [Types.TRIGGER_WORKSPACE_REFRESH]: {};
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: RefreshStateType = {
  workspaceRefresh: false,
};

const reducer = (
  state: RefreshStateType,
  action: ActionsType
): RefreshStateType => {
  switch (action.type) {
    case Types.TRIGGER_WORKSPACE_REFRESH:
      return { ...state, workspaceRefresh: !state.workspaceRefresh };
    default:
      return state;
  }
};

export function RefreshProvider({ children }: RefreshProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const triggerWorkspaceRefresh = useCallback(() => {
    dispatch({
      type: Types.TRIGGER_WORKSPACE_REFRESH,
      payload: {},
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      triggerWorkspaceRefresh,
    }),
    [state, triggerWorkspaceRefresh]
  );

  return (
    <RefreshContext.Provider value={memoizedValue}>
      {children}
    </RefreshContext.Provider>
  );
}
