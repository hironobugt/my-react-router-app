import type { Route } from "./+types/users";
import { requireAuth } from "~/utils/session";
import { userService } from "~/services/user.service";

export async function loader({ request }: Route.LoaderArgs) {
  // Require authentication - will redirect to /login if not authenticated
  const currentUser = await requireAuth(request);
  
  // Get all users (excluding password hashes)
  const users = await userService.getAllUsers();
  
  return { users, currentUser };
}
