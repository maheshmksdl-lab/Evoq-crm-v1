import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthed   = request.cookies.get("crm_auth")?.value === "true";
  const { pathname } = request.nextUrl;
  const isPublic   = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  // Unauthenticated → always send to login
  if (!isAuthed && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already authed and hitting auth pages → send to dashboard
  if (isAuthed && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Expose the pathname to the root layout (needed to keep the light-only auth
  // pages from getting the dark class during server render).
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|logo\\.png|.*\\.svg).*)"],
};
