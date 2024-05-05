import { isTokenExpired } from "@/utils/authUtils";
import { NextResponse } from "next/server";

export default function middleware(req, res) {
  // Check if the user is logged in
  const token = req.cookies.get("auth-token");
  // If the user is not logged in, redirect them to the login page

  // if (isTokenExpired(token) && req.nextUrl.pathname !== "/login") {
  //   return NextResponse.redirect(new URL(`/login`, req.url));
  // }
  // Otherwise, continue to the next middleware or route
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};
