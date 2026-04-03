import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export function useProfile() {
  const [userProfile, setUserProfile] = useState();
  const [userProfiles,setUserProfiles] = useState([]);
  const { user } = useAuth();

  useEffect(() => {

     async function fetchAllUserProfiles() {
    
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")

        if (error) {
          throw error;
        } else {
          setUserProfiles(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchUserProfile() {
      
      if (!user) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserProfile();
    fetchAllUserProfiles();
  }, [user]);



  return { userProfile,userProfiles };
}
