import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Real Next.js Server Action IDs are long hex hashes; probes use short strings like "x". */
const VALID_ACTION_ID = /^[a-f0-9]{40,}$/i;

export function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  const actionId = request.headers.get("next-action");
  if (actionId !== null && !VALID_ACTION_ID.test(actionId)) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
