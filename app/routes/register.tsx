import { Suspense } from "react";
import { redirect, useActionData, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/register";
import { UserForm, ClientOnly } from "~/components/shared";
import type { UserFormValues } from "~/components/shared";
import { userService } from "~/services/user.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ユーザー登録 - User Management System" },
    { name: "description", content: "新しいアカウントを作成" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Create user using service (server-side)
  const result = await userService.createUser({
    username,
    email,
    password,
  });

  if (!result.success) {
    return {
      errors: result.errors || {},
    };
  }

  // Redirect to login page on success
  return redirect("/login");
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (values: UserFormValues) => {
    // Create FormData and submit to server-side action
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    if (values.password) {
      formData.append("password", values.password);
    }
    submit(formData, { method: "post" });
  };

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
                <UserForm
                  onSubmit={handleSubmit}
                  submitLabel={isSubmitting ? "登録中..." : "登録"}
                  errors={actionData?.errors}
                  initialValues={{ username: "", email: "" }}
                />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
