import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearCurrentUser } from "~/store/authSlice";

export { action } from "./logout.server";

/**
 * Logout component - clears Redux state before redirect
 * This component is rendered briefly during logout to clear client state
 */
export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear Redux state
    dispatch(clearCurrentUser());
    
    // Navigate to login
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">ログアウト中...</p>
      </div>
    </div>
  );
}
