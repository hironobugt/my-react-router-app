/**
 * Route protection utilities and documentation
 * Requirements: 2.4
 * 
 * This file documents the route protection strategy for the application.
 * 
 * PUBLIC ROUTES (no authentication required):
 * - / (home) - Landing page
 * - /register - User registration
 * - /login - User login
 * 
 * PROTECTED ROUTES (authentication required):
 * - /dashboard - User dashboard (redirects to /login if not authenticated)
 * - /users - User list (redirects to /login if not authenticated)
 * - /profile - Profile edit (redirects to /login if not authenticated)
 * 
 * ACTION ROUTES (authentication required):
 * - /logout - Logout action (invalidates session)
 * - /delete-user - Delete user action (requires authentication)
 * 
 * AUTHENTICATION FLOW:
 * 1. Public routes (login, register) use redirectIfAuthenticated() in loader
 *    - If user is already authenticated, redirect to /dashboard
 * 
 * 2. Protected routes use requireAuth() in loader
 *    - If user is not authenticated, redirect to /login
 *    - If user is authenticated, return user data
 * 
 * 3. Action routes use requireAuth() in action
 *    - Verify authentication before processing the action
 */

/**
 * Route categories for documentation and testing
 */
export const ROUTE_CATEGORIES = {
  public: [
    { path: '/', name: 'Home' },
    { path: '/register', name: 'Register' },
    { path: '/login', name: 'Login' },
  ],
  protected: [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/users', name: 'Users' },
    { path: '/profile', name: 'Profile' },
  ],
  actions: [
    { path: '/logout', name: 'Logout' },
    { path: '/delete-user', name: 'Delete User' },
  ],
} as const;

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return ROUTE_CATEGORIES.protected.some(route => route.path === path) ||
         ROUTE_CATEGORIES.actions.some(route => route.path === path);
}

/**
 * Check if a route is public (no authentication required)
 */
export function isPublicRoute(path: string): boolean {
  return ROUTE_CATEGORIES.public.some(route => route.path === path);
}

/**
 * Get the redirect path for unauthenticated users
 */
export function getUnauthenticatedRedirect(): string {
  return '/login';
}

/**
 * Get the redirect path for authenticated users accessing public routes
 */
export function getAuthenticatedRedirect(): string {
  return '/dashboard';
}
