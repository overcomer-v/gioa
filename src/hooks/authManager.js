import { useState } from "react";
import { supabase } from "../supabase";

export function useAuthManager() {
  const [loading, setLoading] = useState(false);
  const [supabaseError, setError] = useState(null);

 async function signUp({ name, email, password }) {
  setLoading(true);
  setError(null);

  try {
    console.log("SIGNUP FUNCTION STARTED");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    console.log("SUPABASE SIGNUP RESPONSE:", data, error);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    setError(error);
    throw error;
  } finally {
    console.log("SIGNUP FINISHED");
    setLoading(false);
  }
}

  async function login({ email, password, onSuccess }) {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Login successful:", data.user);

      onSuccess?.(data.user);
    } catch (error) {
      console.error("Login error:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Logout error:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    supabaseError,
    signUp,
    login,
    logout,
  };
}
