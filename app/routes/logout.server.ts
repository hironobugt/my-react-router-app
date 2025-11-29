import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { sessionService } from "~/services/session.service";
import { clearSessionCookie } from "~/utils/session";

export async function action({ request }: Route.ActionArgs) {
  // Get session ID from cookie
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("sessionId="))
    ?.split("=")[1];

  // Delete session from database if it exists
  if (sessionId) {
    await sessionService.deleteSession(sessionId);
  }

  // Clear session cookie and redirect to login
  return redirect("/login", {
    headers: {
      "Set-Cookie": clearSessionCookie(),
    },
  });
}
