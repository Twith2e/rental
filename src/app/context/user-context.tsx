import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useGetProfile } from "@/app/services/profile/profile";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data, refetch, isFetching, error: fetchError } = useGetProfile();

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading: isFetching,
        error: fetchError ? fetchError.message : null,
        refresh: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
