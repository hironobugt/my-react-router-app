import { Form } from "react-router";
import { RemoteFormField, RemoteButton } from "./RemoteComponents";

interface RegisterFormClientProps {
  errors?: Record<string, string>;
  isSubmitting: boolean;
}

export default function RegisterFormClient({ errors, isSubmitting }: RegisterFormClientProps) {
  return (
    <Form method="post" className="space-y-4">
      <RemoteFormField
        label="ユーザー名"
        name="username"
        type="text"
        placeholder="ユーザー名を入力"
        error={errors?.username}
        required
      />

      <RemoteFormField
        label="メールアドレス"
        name="email"
        type="email"
        placeholder="email@example.com"
        error={errors?.email}
        required
      />

      <RemoteFormField
        label="パスワード"
        name="password"
        type="password"
        placeholder="8文字以上"
        error={errors?.password}
        required
      />

      <RemoteButton
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "登録中..." : "登録"}
      </RemoteButton>
    </Form>
  );
}
