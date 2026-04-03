import { useState } from "react";
import { supabase } from "../supabase";

export function useAuthManager() {
  const [loading, setLoading] = useState();
  const [supabaseError, setError] = useState();

  // async function uploadTest(e) {
  //   e.preventDefault();
  //   const { data, error } = await supabase
  //     .from("profiles")
  //     .insert([
  //       {
  //         id: "4b30e619-a62d-495d-824e-b9eb3577f720",
  //         name: "OluwaOpe",
  //         role: "user",
  //       },
  //     ]);

  //     if (error){
  //       console.log(error);
  //     }else{
  //       console.log(data);
  //     }
  // }

  async function signUp({ name, email, password, onSuccess }) {
    setLoading(true);
    try {
      const { data:{user}, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      } else {
        console.log("SignUp successfull");
        console.log(user);
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ user_id: user.id, name: name, email: email }]);

        if (insertError) {
          console.log(insertError);
          throw insertError;
        }

        const { error: rolesError } = await supabase.functions.invoke(
          "register-role",
          {
            body: { name: "Functions" },
          },
        );

        if (rolesError) {
          console.log(rolesError);
          throw rolesError;
        }
              onSuccess();

      }

    } catch (error) {
      console.log("Error occured :", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password , onSuccess}) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      } else {
        console.log("SignUp successfull");
      }

      onSuccess();
    } catch (error) {
      console.log("Error occured :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { loading, signUp, login, supabaseError };
}
