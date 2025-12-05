import { Suspense, lazy } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/register";
import { ClientOnly } from "~/components/shared";

export { loader, action } from "./register.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ユーザー登録 - User Management System" },
    { name: "description", content: "新しいアカウントを作成" },
  ];
}

// Lazy load the form component to avoid SSR issues with remote modules
const RegisterFormClient = lazy(() => import("~/components/RegisterFormClient"));

export default function Register() {
  const actionData = useActionData() as any;
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
                <RegisterFormClient
                  errors={actionData?.errors}
                  isSubmitting={isSubmitting}
                />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
