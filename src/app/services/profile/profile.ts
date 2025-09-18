import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./profile-service";

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });
}
