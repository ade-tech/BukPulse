import { useCurrentUser } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import PagePreloader from "./pagePreloader";

export default function PublicRoute() {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();

  const redirectTo = (location.state as any)?.from?.pathname ?? "/";

  if (isLoading) return <PagePreloader />;
  if (!isLoading && currentUser) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}
