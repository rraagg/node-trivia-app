import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("connect.sid");

  console.log("Token:", token); // Debugging: Log the token

  if (token) {
    try {
      // Optional: Add a backend call to verify session validity
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/auth-status`, {
        headers: { Cookie: `connect.sid=${token}` },
        credentials: "include",
      });

      console.log("Response status:", response.status); // Debugging: Log the response status

      if (response.ok) {
        console.log("Valid token found. Allowing access.");
        return NextResponse.next(); // Valid token, proceed
      }

      console.log("Invalid token. Redirecting to login.");
      return NextResponse.redirect(new URL("/login?reason=not_authenticated", req.url));
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect(new URL("/login?reason=verification_error", req.url));
    }
  }

  console.log("No token found. Redirecting to login.");
  return NextResponse.redirect(new URL("/login?reason=not_authenticated", req.url));
}

export const config = {
  matcher: ["/questions/:path*", "/play-trivia/:path*"], // Define protected routes
};

