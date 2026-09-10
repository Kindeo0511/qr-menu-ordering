import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/user_auth";

export function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // or a spinner

  return children;
}
