import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [isAuthloading, setLoading] = useState();
  const [role, setRole] = useState();

  async function getRole(id) {
    const { data, error } = await supabase
      .from("roles")
      .select("role")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.log(error);
    }
    return data;
  }

  useEffect(() => {
    const handleSessionFetch = (userInfo) => {
      setLoading(true);
      setUser(userInfo);
      getRole(userInfo.id).then((result) => {
        if (result) {
          setRole(result?.role);
          console.log(result?.role);
          setLoading(false);
        }
      });
    };

    supabase.auth.getUser().then(({data}) => {
      if (data.user) {
        handleSessionFetch(data.user);
      }
    });

    const { data: authSubscriber } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          handleSessionFetch(session?.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
        }
      },
    );

    return () => {
      authSubscriber.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthloading, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
