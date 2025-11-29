import { redirect } from "react-router";
import { sessionService } from "~/services/session.service";
import { userService } from "~/services/user.service";
import type { User } from "~/types/user.types";

/**
 * Get the current session from request
 */
export async function getSessionFromRequest(request: Request) {
  return await sessionService.getSessionFromRequest(request);
}

/**
 * Get the current authenticated user from request
 * Returns null if no valid session exists
 */
export async function getCurrentUser(request: Request): Promise<User | null> {
  const session = await getSessionFromRequest(request);
  
  if (!session) {
    return null;
  }

  const user = await userService.getUserById(session.userId);
  return user;
}

/**
 * Require authentication for a route
 * Redirects to login if not authenticated
 */
export async function requireAuth(request: Request): Promise<User> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    throw redirect("/login");
  }

  return user;
}

/**
 * Redirect to dashboard if already authenticated
 * Useful for login/register pages
 */
export async function redirectIfAuthenticated(request: Request) {
  const user = await getCurrentUser(request);
  
  if (user) {
    throw redirect("/dashboard");
  }
}

/**
 * Create a session cookie header
 */
export function createSessionCookie(sessionId: string, maxAge: number = 24 * 60 * 60): string {
  return `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

/**
 * Create a cookie header to clear the session
 */
export function clearSessionCookie(): string {
  return `sessionId=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
