import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ログイン - User Management System" },
    { name: "description", content: "アカウントにログイン" },
  ];
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ログイン機能は後で実装されます
          </p>
          <p className="mt-4 text-center">
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              新しいアカウントを作成
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
