import { useEffect, useState } from "react";
import { useAuthManager } from "../../hooks/authManager";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { useAuth } from "../../contexts/AuthContext";

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuthManager();
  const { user, role, isAuthloading } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [signUpDetails, setSignUpDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthloading || !user) return;

    if (role === "admin") {
      navigate("/admin-board", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [isAuthloading, user, role, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    console.log("HANDLE SIGNUP CALLED");

    setErrorMessage("");

    try {
      const data = await signUp(signUpDetails);

      console.log("SIGNUP RETURNED:", data);
    } catch (error) {
      console.log("SIGNUP CAUGHT ERROR:", error);
      setErrorMessage(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen text-sm [&_input]:w-full [&_input]:bg-transparent [&_input]:px-4 [&_input]:py-3 [&_input]:border-2 [&_input]:rounded-md">
      <form
        className="flex flex-col [&>input]:mb-4 [&>label]:font-semibold gap-1 m-auto w-3/4 max-w-96"
        onSubmit={handleSignUp}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1 text-primary">Sign Up</h2>

          <span className="opacity-60">Create an account to get started</span>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md px-3 py-3 mb-4 bg-red-300">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          value={signUpDetails.name}
          onChange={(e) => {
            setSignUpDetails((prev) => ({
              ...prev,
              name: e.target.value,
            }));

            setErrorMessage("");
          }}
          required
        />

        <label htmlFor="email">Email</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={signUpDetails.email}
          onChange={(e) => {
            setSignUpDetails((prev) => ({
              ...prev,
              email: e.target.value,
            }));

            setErrorMessage("");
          }}
          required
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={signUpDetails.password}
          onChange={(e) => {
            setSignUpDetails((prev) => ({
              ...prev,
              password: e.target.value,
            }));

            setErrorMessage("");
          }}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary py-3 rounded-md flex gap-4 items-center justify-center text-white disabled:opacity-60"
        >
          <p>{loading ? "Creating Account..." : "Sign Up"}</p>

          {loading && <p className="fa fa-spin fa-spinner"></p>}
        </button>

        <p className="text-center my-4">Or</p>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="bg-white py-3 rounded-md flex gap-4 items-center justify-center"
        >
          <p>Sign Up with Google</p>
        </button>

        <Link className="text-purple-700 mt-4" to="/login">
          Already have an account?
        </Link>
      </form>
    </div>
  );
}
