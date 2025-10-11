import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [isAuthloading, setLoading] = useState();
  const [role, setRole] = useState();

  async function getRole() {
    const { data, error } = await supabase.from("roles").select("role");
    if (error) {
      console.log(error);
    }
    return data;
  }

  useEffect(() => {
    const handleSessionFetch = (user) => {
      setLoading(true);
      setUser(user);
      getRole().then((result) => {
       if (result) {
         setRole(result[0]?.role);
        console.log(result[0]?.role);
        setLoading(false);
       }
      });
    };

    supabase.auth.getUser().then((user)=>{
      if (user) {
        handleSessionFetch(user);
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
      }
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
