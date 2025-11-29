import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Application routes configuration
 * Requirements: 2.4
 * 
 * Public routes:
 * - / (home)
 * - /register
 * - /login
 * 
 * Protected routes (require authentication):
 * - /dashboard
 * - /users
 * - /profile
 * 
 * Action routes:
 * - /logout
 * - /delete-user
 */
export default [
  // Public routes
  index("routes/home.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  
  // Protected routes (authentication required)
  route("dashboard", "routes/dashboard.tsx"),
  route("users", "routes/users.tsx"),
  route("profile", "routes/profile.tsx"),
  
  // Action routes
  route("logout", "routes/logout.tsx"),
  route("delete-user", "routes/delete-user.tsx"),
] satisfies RouteConfig;
