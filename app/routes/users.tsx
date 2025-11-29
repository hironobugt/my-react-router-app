import { Suspense, useState, useEffect } from "react";
import { useLoaderData, useNavigate, useFetcher, Link } from "react-router";
import { useDispatch } from "react-redux";
import type { Route } from "./+types/users";
import type { User } from "~/types/user.types";
import { UserCard, ConfirmDialog, ClientOnly } from "~/components/shared";
import { setCurrentUser } from "~/store/authSlice";

export { loader } from "./users.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ユーザー一覧 - User Management System" },
    { name: "description", content: "登録ユーザー一覧" },
  ];
}

export default function Users() {
  const { users, currentUser } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const dispatch = useDispatch();
  const [userList, setUserList] = useState<User[]>(users);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Update Redux store with current user on mount
  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [currentUser, dispatch]);

  const handleEdit = (userId: string) => {
    // Navigate to profile edit page
    navigate(`/profile?userId=${userId}`);
  };

  const handleDelete = (userId: string) => {
    // Open confirmation dialog
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    
    // Submit delete request
    const formData = new FormData();
    formData.append("userId", userToDelete);
    
    fetcher.submit(formData, {
      method: "post",
      action: "/delete-user",
    });
    
    // Update local state to remove the user from the list
    setUserList(prevList => prevList.filter(u => u.id !== userToDelete));
    
    // Close dialog
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                ユーザー一覧
              </h1>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ダッシュボードに戻る
              </Link>
            </div>

            {userList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">ユーザーが登録されていません</p>
              </div>
            ) : (
              <ClientOnly fallback={<div className="text-center">読み込み中...</div>}>
                {() => (
                  <Suspense fallback={<div className="text-center">読み込み中...</div>}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {userList.map((user) => (
                        <UserCard
                          key={user.id}
                          user={{
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            createdAt: user.createdAt.toString(),
                          }}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          showActions={true}
                        />
                      ))}
                    </div>
                    
                    {/* Delete Confirmation Dialog */}
                    <ConfirmDialog
                      isOpen={deleteDialogOpen}
                      title="ユーザーの削除"
                      message="このユーザーを削除してもよろしいですか？この操作は取り消せません。"
                      confirmLabel="削除"
                      cancelLabel="キャンセル"
                      variant="danger"
                      onConfirm={confirmDelete}
                      onCancel={cancelDelete}
                    />
                  </Suspense>
                )}
              </ClientOnly>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
