"use client";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { ActionMapType, AuthStateType, AuthUserType } from "../types";
import {
  isValidToken,
  setSession,
  setWorkspaceSession,
  WORKPACE_KEY,
} from "./utils";
import axios, { endpoints } from "@/lib/axios";
import { AuthContext } from "./auth-context";
import { AxiosHeaders } from "axios";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_USER = "SET_USER",
  SET_WORKSPACE = "SET_WORKSPACE",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
  [Types.SET_USER]: {
    user: AuthUserType;
  };
  [Types.SET_WORKSPACE]: {
    workspace: string | null;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
  workspace: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return { ...state, loading: false, user: action.payload.user };

    case Types.LOGIN:
      return { ...state, user: action.payload.user };

    case Types.LOGOUT:
      return { ...state, user: null };

    case Types.SET_WORKSPACE:
      return { ...state, workspace: action.payload.workspace };

    default:
      return state;
  }
};

const STORAGE_KEY = "accessToken";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const res = await axios.get(endpoints.me);

        dispatch({
          type: Types.INITIAL,
          payload: { user: { ...res.data } },
        });
      } else {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
      }
      // set workspace
      const workspace = sessionStorage.getItem(WORKPACE_KEY);
      if (workspace) {
        setWorkspaceSession(workspace);
        dispatch({
          type: Types.SET_WORKSPACE,
          payload: { workspace },
        });
      } else {
        dispatch({
          type: Types.SET_WORKSPACE,
          payload: { workspace: null },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: { user: null },
      });
      dispatch({
        type: Types.SET_WORKSPACE,
        payload: { workspace: null },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post(endpoints.login, {
      username: email,
      password,
    });

    const { headers } = res;
    const accessToken = headers["token"];
    const workspaceId = headers["workspace_id"];

    setWorkspaceSession(workspaceId);
    setSession(accessToken);

    const { data } = await axios.get(endpoints.me);

    dispatch({
      type: Types.LOGIN,
      payload: { user: { ...data } },
    });
  }, []);
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
    dispatch({
      type: Types.SET_WORKSPACE,
      payload: { workspace: null },
    });
  }, []);

  const setUser = useCallback(async (user: AuthUserType) => {
    dispatch({
      type: Types.SET_USER,
      payload: { user: { ...user } },
    });
  }, []);

  const setWorkspace = useCallback(async (workspace: string | null) => {
    dispatch({
      type: Types.SET_WORKSPACE,
      payload: { workspace },
    });
    setWorkspaceSession(workspace);
  }, []);

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      login,
      logout,
      setUser,
      setWorkspace,
      workspace: state.workspace,
    }),
    [login, logout, state.user, status, setUser, setWorkspace, state.workspace],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
