import { redirect } from "react-router";
import type { Route } from "./+types/register";
import { userService } from "~/services/user.service";
import { redirectIfAuthenticated } from "~/utils/session";
import { createValidationError } from "~/utils/errorResponse";

export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to dashboard if already authenticated
  await redirectIfAuthenticated(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Create user
  const result = await userService.createUser({
    username,
    email,
    password,
  });

  if (!result.success) {
    return createValidationError(result.errors || {});
  }

  // Redirect to login page on success
  return redirect("/login");
}
