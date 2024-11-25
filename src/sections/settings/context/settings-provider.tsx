"use client";
import React, { useCallback, useMemo, useReducer } from "react";
import {
  ActionMapType,
  SettingsStateType,
  SettingType,
  WorkspaceType,
} from "../types";

import { SettingsContext } from "./settings-context";

enum Types {
  SET_SETTING = "SET_SETTING",
  SET_WORKPLACE = "SET_WORKPLACE",
}

type Payload = {
  [Types.SET_SETTING]: SettingType;
  [Types.SET_WORKPLACE]: WorkspaceType;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: SettingsStateType = {
  setting: "userDetails",
  workspace: { id: 1, name: "Lexington" },
};

const reducer = (state: SettingsStateType, action: ActionsType) => {
  switch (action.type) {
    case Types.SET_SETTING:
      return { ...state, setting: action.payload };
    case Types.SET_WORKPLACE:
      return { ...state, workspace: action.payload };
    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

export function SettingsProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeSetting = useCallback((setting: SettingType) => {
    dispatch({
      type: Types.SET_SETTING,
      payload: setting,
    });
  }, []);

  const changeWorkspace = useCallback((workspace: WorkspaceType) => {
    dispatch({
      type: Types.SET_WORKPLACE,
      payload: workspace,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      changeSetting,
      changeWorkspace,
    }),
    [state, changeSetting, changeWorkspace]
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
