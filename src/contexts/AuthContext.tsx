import type { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/Services/supabase";

interface authContextValue {
  currentUser: User | null;
  isLoading: boolean;
  role: RoleType | null;
  isSuperAdmin: boolean;
  setRole: React.Dispatch<React.SetStateAction<RoleType | null>>;

  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<authContextValue | undefined>(undefined);

type RoleType = "user" | "admin" | "super_admin";

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<RoleType | null>(null);
  const isSuperAdmin = role === "super_admin";
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setIsLoading(false);
        setRole(null);
        return;
      }

      setCurrentUser(data?.user ?? null);
      setRole(data.user?.user_metadata.role ?? null);
      setIsLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setRole(session?.user.user_metadata.role ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        role,
        isSuperAdmin,
        setRole,
        isLoading,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("Auth comtext used outside of the provider");

  return context;
}
