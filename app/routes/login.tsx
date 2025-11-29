import { Suspense, useEffect } from "react";
import { useActionData, useNavigation, useSubmit, useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import type { Route } from "./+types/login";
import { ClientOnly } from "~/components/shared";
import { setCurrentUser } from "~/store/authSlice";

export { loader, action } from "./login.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ログイン - User Management System" },
    { name: "description", content: "アカウントにログイン" },
  ];
}

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  error?: string;
  isSubmitting: boolean;
}

function LoginForm({ onSubmit, error, isSubmitting }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </div>
    </form>
  );
}

export default function Login() {
  const actionData = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  // Extract error message from standardized error response
  const errorMessage = actionData && 'errors' in actionData 
    ? (actionData.errors.general || Object.values(actionData.errors)[0])
    : undefined;

  const handleSubmit = (email: string, password: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              新しいアカウントを作成
            </a>
          </p>
        </div>

        <ClientOnly fallback={<div className="text-center">読み込み中...</div>}>
          {() => (
            <Suspense fallback={<div className="text-center">読み込み中...</div>}>
              <LoginForm
                onSubmit={handleSubmit}
                error={errorMessage}
                isSubmitting={isSubmitting}
              />
            </Suspense>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
