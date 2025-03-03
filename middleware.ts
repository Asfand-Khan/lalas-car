import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("lalascar-token")?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/login", "/forgot-password", "/otp"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicAsset = pathname.startsWith("/images") || pathname.startsWith("/public");

  console.log("Token:", token, "Pathname:", pathname);

  if (isPublicAsset) {
    return NextResponse.next();
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
