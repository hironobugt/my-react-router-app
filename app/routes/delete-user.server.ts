import { redirect } from "react-router";
import type { Route } from "./+types/delete-user";
import { requireAuth, clearSessionCookie, getSessionFromRequest } from "~/utils/session";
import { userService } from "~/services/user.service";
import { sessionService } from "~/services/session.service";
import { createErrorResponse, createValidationError } from "~/utils/errorResponse";

export async function action({ request }: Route.ActionArgs) {
  // Require authentication
  const currentUser = await requireAuth(request);
  
  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return createValidationError({ userId: "ユーザーIDが指定されていません" });
  }

  try {
    // Delete the user
    await userService.deleteUser(userId);

    // If user deleted themselves, invalidate session and redirect to login
    if (userId === currentUser.id) {
      const session = await getSessionFromRequest(request);
      if (session) {
        await sessionService.deleteSession(session.id);
      }

      return redirect("/login", {
        headers: {
          "Set-Cookie": clearSessionCookie(),
        },
      });
    }

    // Otherwise, redirect back to users list
    return redirect("/users");
  } catch (error) {
    return createErrorResponse("ユーザーの削除に失敗しました");
  }
}
