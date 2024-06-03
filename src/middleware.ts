import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware

  /*  console.log('Middleware executed for:', request.nextUrl.pathname);*/

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  const isNotHomeLoginOrSignup =
    request.nextUrl.pathname !== "/" &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/password" &&
    request.nextUrl.pathname !== "/signup" &&
    request.nextUrl.pathname !== "/reset";
  if (!session && isNotHomeLoginOrSignup) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|header.png).*)",
  ],
};
