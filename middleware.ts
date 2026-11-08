import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

    let token = await getToken({ req, secret });

    // Fallback check cho secureCookie nếu môi trường dev/prod có sự khác biệt
    if (!token) {
      token = await getToken({ req, secret, secureCookie: false });
    }
    if (!token) {
      token = await getToken({ req, secret, secureCookie: true });
    }

    // Nếu chưa đăng nhập hoặc role không phải admin thì điều hướng về trang chủ "/"
    if (!token || (token as { role?: string }).role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const response = NextResponse.next();

  // 2. Set Cache-Control header on public HTML pages so Cloudflare caches HTML
  if (
    req.method === "GET" &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/tai-khoan") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
