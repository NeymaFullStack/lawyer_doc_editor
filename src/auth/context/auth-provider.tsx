"use client";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { ActionMapType, AuthStateType, AuthUserType } from "../types";
import { isValidToken, setSession } from "./utils";
import axios, { endpoints } from "@/lib/axios";
import { AuthContext } from "./auth-context";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_USER = "SET_USER",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.SET_USER]: {
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

    case Types.SET_USER:
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
        setSession(accessToken);
        const res = await axios.get(endpoints.me);

        dispatch({
          type: Types.INITIAL,
          payload: { user: { ...res.data } },
        });
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

    const { access_token } = res.data;
    setSession(access_token);
    const { data } = await axios.get(endpoints.me);

    dispatch({
      type: Types.LOGIN,
      payload: { user: { ...data } },
    });
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
  }, []);

  const setUser = useCallback(async (user: AuthUserType) => {
    dispatch({
      type: Types.SET_USER,
      payload: { user: { ...user } },
    });
  }, []);

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(() => {
    return {
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      setUser,
      login,
      logout,
    };
  }, [login, logout, state.user, status, setUser]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
