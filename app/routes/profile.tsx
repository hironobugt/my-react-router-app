import { Suspense, useState, useEffect } from "react";
import { useLoaderData, useActionData, Link } from "react-router";
import type { Route } from "./+types/profile";
import { UserForm, ClientOnly } from "~/components/shared";
import { useAppDispatch } from "~/store/hooks";
import { setCurrentUser } from "~/store/authSlice";
import type { action } from "./delete-user.server";
import type { loader } from "./dashboard";

export { loader, action } from "./profile.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "プロフィール編集 - User Management System" },
    { name: "description", content: "プロフィール情報の編集" },
  ];
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const dispatch = useAppDispatch();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update Redux store with current user on mount
  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user, dispatch]);

  // Update Redux state when profile is successfully updated
  useEffect(() => {
    if (actionData?.success && actionData.data) {
      dispatch(setCurrentUser(actionData.data));
      if (actionData.message && !successMessage) {
        setSuccessMessage(actionData.message);
        // Clear message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    }
  }, [actionData, successMessage, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                プロフィール編集
              </h1>
            </div>

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            <ClientOnly fallback={<div className="text-center">読み込み中...</div>}>
              {() => (
                <Suspense fallback={<div className="text-center">読み込み中...</div>}>
                  <UserForm
                    initialValues={{
                      username: user.username,
                      email: user.email,
                    }}
                    onSubmit={() => {}}
                    submitLabel="更新"
                    errors={actionData?.errors}
                    showPassword={false}
                  />
                </Suspense>
              )}
            </ClientOnly>

            <div className="mt-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
