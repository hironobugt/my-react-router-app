import { useEffect } from "react";
import { useLoaderData, Link } from "react-router";
import { useDispatch } from "react-redux";
import type { Route } from "./+types/dashboard";
import { requireAuth } from "~/utils/session";
import { setCurrentUser } from "~/store/authSlice";
import type { User } from "~/types/user.types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ダッシュボード - User Management System" },
    { name: "description", content: "ユーザーダッシュボード" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Require authentication - will redirect to /login if not authenticated
  const user = await requireAuth(request);
  
  return { user };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  const dispatch = useDispatch();

  // Update Redux store with current user on mount
  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              ダッシュボード
            </h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ようこそ、{user.username}さん
              </h2>
              <p className="text-gray-600">
                User Management Systemにログインしています。
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ユーザー情報
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ユーザー名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">アカウント作成日</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">最終更新日</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                クイックアクション
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  プロフィール編集
                </Link>
                <Link
                  to="/users"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ユーザー一覧
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
