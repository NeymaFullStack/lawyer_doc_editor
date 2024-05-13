import { isTokenExpired } from "@/utils/authUtils";
import { NextResponse } from "next/server";

export default function middleware(req, res) {
  // Check if the user is logged in
  const token = req.cookies.get("authToken");
  const hasTokenExpired = isTokenExpired(token?.value);
  if (hasTokenExpired && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL(`/login`, req.url));
  } else if (!hasTokenExpired && req.nextUrl.pathname == "/login") {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  // Otherwise, continue to the next middleware or route
}

export const config = {
  matcher: [`/dashboard/:path*`, "/login"],
};
