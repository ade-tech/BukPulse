import { useCurrentUser } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import PagePreloader from "./pagePreloader";

export default function AdminRoutes() {
  const { currentUser, isSuperAdmin, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) return <PagePreloader />;
  if (!isLoading && !isSuperAdmin)
    return <Navigate to={"/"} replace state={{ from: location }} />;

  if (!isLoading && currentUser && isSuperAdmin) return <Outlet />;
}
