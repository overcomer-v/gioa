import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthloading, setLoading] = useState(true);

  async function getRole(userId) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching role:", error);
      return null;
    }

    return data?.role ?? null;
  }

  async function loadUser(userInfo) {
    if (!userInfo) {
      setUser(null);
      setRole(null);
      return;
    }

    setUser(userInfo);


    const userRole = await getRole(userInfo.id);

    setRole(userRole);
    console.log(userRole);
  }

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      await loadUser(user);

      if (mounted) {
        setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Don't await Supabase calls directly inside the auth callback.
        setTimeout(() => {
          if (mounted) {
            loadUser(session?.user);
          }
        }, 0);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthloading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);