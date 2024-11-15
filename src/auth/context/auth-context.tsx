"use client";

import { createContext } from "react";

import { JWTContextType } from "../types";

export const AuthContext = createContext<JWTContextType>({} as JWTContextType);
