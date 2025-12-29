import { UseAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router";
import PagePreloader from "./pagePreloader";

export default function PublicRoute() {
  const { currentUser, isLoading } = UseAuth();

  if (isLoading) return <PagePreloader />;
  if (!isLoading && currentUser) return <Navigate to="/" replace />;

  return <Outlet />;
}
