import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/Services/supabase";

interface authContextValue {
  currentUser: User | null;
  currentSession: Session | null;
  isLoading: boolean;
  role: RoleType | null;
  isSuperAdmin: boolean;
  setRole: React.Dispatch<React.SetStateAction<RoleType | null>>;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
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
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setCurrentSession(data.session);
      setCurrentUser(data.session?.user ?? null);
      setRole(data.session?.user.user_metadata.role ?? null);
      setIsLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentSession(session);
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
        currentSession,
        setCurrentSession,
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
