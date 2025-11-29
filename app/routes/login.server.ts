import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { authService } from "~/services/auth.service";
import { sessionService } from "~/services/session.service";
import { redirectIfAuthenticated } from "~/utils/session";
import { createAuthError } from "~/utils/errorResponse";

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to dashboard if already authenticated
  await redirectIfAuthenticated(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Authenticate user
  const authResult = await authService.login(email, password);

  if (!authResult.success || !authResult.user) {
    return createAuthError(authResult.error || "ログインに失敗しました");
  }

  // Create session
  const session = await sessionService.createSession(authResult.user.id);

  // Set session cookie and redirect to dashboard
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": `sessionId=${session.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`,
    },
  });
}
