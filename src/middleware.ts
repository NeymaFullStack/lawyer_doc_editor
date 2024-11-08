import { isTokenExpired } from "@/utils/authUtils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest): NextResponse | undefined {
  // Retrieve the token from cookies
  const token = req.cookies.get("authToken")?.value;

  // Determine if the token has expired
  const hasTokenExpired = isTokenExpired(token);

  if (hasTokenExpired && req.nextUrl.pathname !== "/login") {
    // Redirect to login if the token is expired and not on the login page
    return NextResponse.redirect(new URL(`/login`, req.url));
  } else if (!hasTokenExpired && req.nextUrl.pathname === "/login") {
    // Redirect to dashboard if the token is valid and on the login page
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  // Continue to the next middleware or route if no redirect is necessary
}

export const config = {
  matcher: [`/dashboard/:path*`, "/settings", "/login"],
};
