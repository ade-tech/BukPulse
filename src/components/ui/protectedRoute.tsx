import { UseAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import PagePreloader from "./pagePreloader";

export default function ProtectedRoute() {
  const { currentUser, isLoading } = UseAuth();
  const location = useLocation();

  if (isLoading) return <PagePreloader />;
  if (!isLoading && !currentUser) return <Navigate to={"/login"} replace />;
  if (!isLoading && currentUser && currentUser?.user_metadata.is_new) {
    if (location.pathname === "/onboarding") return <Outlet />;
    return <Navigate to={"/onboarding"} replace />;
  }
  if (!isLoading && currentUser && !currentUser?.user_metadata.is_new)
    return <Outlet />;
}
