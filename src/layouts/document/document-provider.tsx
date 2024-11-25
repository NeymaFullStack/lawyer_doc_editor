"use client";

import { useCallback, useMemo, useReducer } from "react";
import { DocumentContext } from "./document-context";
import { ActionMapType, DocumentStateType, DocumentType } from "./type";
import axios, { endpoints } from "@/lib/axios";

type DocumentProviderProps = {
  children: React.ReactNode;
};

enum Types {
  SET_DOCUMENT = "SET_DOCUMENT",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  CLEAR_DOCUMENT = "CLEAR_DOCUMENT",
}

type Payload = {
  [Types.SET_DOCUMENT]: { document: DocumentType };
  [Types.SET_LOADING]: { loading: boolean };
  [Types.CLEAR_DOCUMENT]: null;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: DocumentStateType = {
  loading: true,
  document: null,
};

const reducer = (
  state: DocumentStateType,
  action: ActionsType
): DocumentStateType => {
  switch (action.type) {
    case Types.SET_DOCUMENT:
      return { ...state, loading: false, document: action.payload.document };
    case Types.SET_LOADING:
      return { ...state, loading: action.payload.loading };
    case Types.CLEAR_DOCUMENT:
      return { ...state, loading: false, document: null };
    default:
      return state;
  }
};

export function DocumentProvider({ children }: DocumentProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchDocument = useCallback(async (id: string) => {
    dispatch({ type: Types.SET_LOADING, payload: { loading: true } });

    try {
      const res = await axios.get(endpoints.document.document(id));
      const document = res.data;
      dispatch({
        type: Types.SET_DOCUMENT,
        payload: { document },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const saveDocument = useCallback(async () => {
    dispatch({ type: Types.SET_LOADING, payload: { loading: true } });

    try {
      const res = await axios.post(endpoints.document.save);
      const documentId = res.data.data.at(0).document_id;
      fetchDocument(documentId);
    } catch (error) {
      console.error(error);
    }
  }, [fetchDocument]);

  const clearDocument = useCallback(() => {
    dispatch({ type: Types.CLEAR_DOCUMENT, payload: null });
  }, []);

  const status = state.loading ? "loading" : "idle";

  const memoizedValue = useMemo(
    () => ({
      document: state.document,
      loading: status === "loading",
      fetchDocument,
      clearDocument,
      saveDocument,
    }),
    [state.document, fetchDocument, clearDocument, saveDocument, status]
  );

  return (
    <DocumentContext.Provider value={memoizedValue}>
      {children}
    </DocumentContext.Provider>
  );
}
