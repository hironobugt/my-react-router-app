import { Suspense } from "react";
import { useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/register";
import { ClientOnly } from "~/components/shared";

export { loader, action } from "./register.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ユーザー登録 - User Management System" },
    { name: "description", content: "新しいアカウントを作成" },
  ];
}

export default function Register() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新しいアカウントを作成
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              既存のアカウントでログイン
            </a>
          </p>
        </div>

        <div className="mt-8">
          <ClientOnly fallback={<div className="text-center">読み込み中...</div>}>
            {() => (
              <Suspense fallback={<div className="text-center">読み込み中...</div>}>
                <form method="post" className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      ユーザー名
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="ユーザー名を入力"
                    />
                    {actionData?.errors?.username && (
                      <p className="mt-1 text-sm text-red-600">{actionData.errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      メールアドレス
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="email@example.com"
                    />
                    {actionData?.errors?.email && (
                      <p className="mt-1 text-sm text-red-600">{actionData.errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      パスワード
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="8文字以上"
                    />
                    {actionData?.errors?.password && (
                      <p className="mt-1 text-sm text-red-600">{actionData.errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "登録中..." : "登録"}
                  </button>
                </form>
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
