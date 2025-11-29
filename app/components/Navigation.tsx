import { Form, Link, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

/**
 * Navigation component with authentication-aware links
 * Requirements: 2.4, 3.3
 * 
 * Features:
 * - Shows different navigation links based on authentication state
 * - Highlights active route
 * - Displays current user information when authenticated
 * - Provides logout functionality
 */
export function Navigation() {
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    if (isActive(path)) {
      return `${baseClasses} border-blue-500 text-gray-900`;
    }
    return `${baseClasses} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                User Management
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className={getLinkClassName("/dashboard")}
                >
                  ダッシュボード
                </Link>
                <Link
                  to="/users"
                  className={getLinkClassName("/users")}
                >
                  ユーザー一覧
                </Link>
                <Link
                  to="/profile"
                  className={getLinkClassName("/profile")}
                >
                  プロフィール
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-medium">
                  {currentUser?.username || currentUser?.email}
                </span>
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    aria-label="ログアウト"
                  >
                    ログアウト
                  </button>
                </Form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
