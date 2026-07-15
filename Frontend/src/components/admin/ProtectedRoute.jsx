import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
