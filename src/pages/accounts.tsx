import { useLogout } from "@/hooks/useAuth";
import { useCurrentUser } from "@/contexts/AuthContext";
import { AdminAccount, UserAccount } from "@/components/ui/usersAccount";
import PagePreloader from "@/components/ui/pagePreloader";
import { useGetProfileFromId } from "@/hooks/useProfile";

export default function Accounts() {
  const { logoutUser, isLoggingOut } = useLogout();
  const { isAdmin, isLoading, currentUser } = useCurrentUser();
  const { profile, isLoading: isFetching } = useGetProfileFromId(
    currentUser?.id!
  );
  isLoading && <PagePreloader />;
  return isAdmin ? (
    <AdminAccount
      logoutUser={logoutUser}
      isLoggingOut={isLoggingOut}
      profile={profile}
      user_id={currentUser?.id}
      isloading={isFetching}
    />
  ) : (
    <UserAccount
      logoutUser={logoutUser}
      isLoggingOut={isLoggingOut}
      profile={profile}
      isloading={isFetching}
    />
  );
}
