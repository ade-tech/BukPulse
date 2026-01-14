import {
  getProfileFromId,
  getUserOtherProfileData,
} from "@/Services/ProfileAPI";
import { useQuery } from "@tanstack/react-query";

export const useGetProfileFromId = (id: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["Profile", id],
    queryFn: ({ queryKey }) => getProfileFromId(queryKey[1]),
    enabled: !!id,
  });
  return { profile, isLoading };
};
export const useGetUserOtherProfileData = (id: string) => {
  const { data: otherInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ["Other Profile Info", id],
    queryFn: ({ queryKey }) => getUserOtherProfileData(queryKey[1]),
    enabled: !!id,
  });
  return { otherInfo, isLoadingInfo };
};
