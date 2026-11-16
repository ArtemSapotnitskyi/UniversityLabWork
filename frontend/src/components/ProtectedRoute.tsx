import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== "Admin") {
    return <Navigate to="/cars" replace />;
  }

  return <Outlet />;
}
