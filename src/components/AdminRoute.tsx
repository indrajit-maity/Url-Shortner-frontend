import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuhtContext";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Tell logged-in non-admins why they were redirected
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast.error("You need admin access to view that page");
    }
  }, [isAuthenticated, isAdmin]);

  // Not logged in: go to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but not an admin: back to the dashboard
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}