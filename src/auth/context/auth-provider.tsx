"use client";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { ActionMapType, AuthStateType, AuthUserType } from "../types";
import { isValidToken, setSession } from "./utils";
import axios, { endpoints } from "@/utils/axios";
import { AuthContext } from "./auth-context";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return { loading: false, user: action.payload.user };

    case Types.LOGIN:
      return { ...state, user: action.payload.user };

    case Types.LOGOUT:
      return { ...state, user: null };

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
        setSession(null);
        //   TO DO: Set session as accessToken and  Fetch user data from the server by sending a request to the /me endpoint
      } else {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: Types.INITIAL, payload: { user: null } });
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
    const { accessToken, first_name, last_name } = res.data;

    setSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: { user: { email, first_name, last_name } },
    });
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
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
    }),
    [login, logout, state.user, status],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
