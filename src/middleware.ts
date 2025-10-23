import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "@viasegura/constants/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const isTokenInvalid = (token: string | undefined): boolean => {
    return !token || token === "undefined";
  };

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTES);
  const hasInvalidToken = isTokenInvalid(token);

  if (isProtectedRoute && hasInvalidToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(COOKIE_TOKEN);
    return response;
  }

  if (isPublicRoute && !hasInvalidToken && pathname !== "/") {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES, request.url));
  }

  return NextResponse.next();
}
