import type { Route } from "./+types/profile";
import { requireAuth } from "~/utils/session";
import { userService } from "~/services/user.service";
import { createValidationError, createSuccessResponse } from "~/utils/errorResponse";

export async function loader({ request }: Route.LoaderArgs) {
  // Require authentication - will redirect to /login if not authenticated
  const currentUser = await requireAuth(request);
  
  return { user: currentUser };
}

export async function action({ request }: Route.ActionArgs) {
  // Require authentication
  const currentUser = await requireAuth(request);
  
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  // Update user profile
  const result = await userService.updateUser(currentUser.id, {
    username,
    email,
  });

  if (!result.success) {
    return createValidationError(result.errors || {});
  }

  return createSuccessResponse(result.data, "プロフィールを更新しました");
}
