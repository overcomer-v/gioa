import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";

export function useProfile() {

      const [users, setUsers] = useState([]);


    async function fetchAllUserProfiles() {
        try {
            
        const {data,error} = await supabase.from("profiles").select("*");

        if (error) {
            throw error;
        }else{
            setUsers(data);
        }

        } catch (error) {
            console.error(error);
        }

    }

    return {fetchAllUserProfiles,users};
}