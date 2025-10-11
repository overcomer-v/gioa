import { useEffect, useState } from "react";
import { useAuthManager } from "../../hooks/authManager";
import { supabase } from "../../supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function SignUpPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const { signUp, loading } = useAuthManager();
  const [signUpDetails, setSignUpDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { user, isAuthloading, role } = useAuth();

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") {
        setErrorMessage(null);
      }
    });

    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target === "input") {
          setErrorMessage(null);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!isAuthloading && user) {
      if (role != "admin") {
        navigate("/");
      } else {
        navigate("/admin-board");
      }
    }
  }, [isAuthloading]);

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(signUpDetails);
    if (signUpDetails) {
     try {
       await signUp(signUpDetails);
     } catch (error) {
      setErrorMessage(error.message);
     }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen text-sm [&_input]:w-full [&_input]:bg-transparent [&_input]:px-4 [&_input]:py-3 [&_input]:border-2 [&_input]:rounded-md">
      <form
        className="flex flex-col [&>input]:mb-4 [&>label]:font-semibold gap-1 m-auto w-3/4 max-w-96"
        action=""
        onSubmit={handleUpload}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1 text-primary">SignUp</h2>
          <span className="opacity-60">
            Welcome Back, Please Sign In to Continue
          </span>
        </div>

        { errorMessage && <div className="flex ease-in-out transition-all duration-500 translate-y-2 items-center gap-2 rounded-md px-3 py-3 mb-4 bg-red-300">
          <i className="fas fa-exclamation-circle"></i>
          <span>{errorMessage}</span>
        </div>}

        <label htmlFor="name">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={signUpDetails.name}
          onChange={(e) => {
            setSignUpDetails((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />

        <label htmlFor="email">Email</label>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={signUpDetails.email}
          onChange={(e) => {
            setSignUpDetails((prev) => {
              return { ...prev, email: e.target.value };
            });
          }}
        />

        <label htmlFor="password">Password</label>

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={signUpDetails.password}
          onChange={(e) => {
            setSignUpDetails((prev) => {
              return { ...prev, password: e.target.value };
            });
          }}
        />
        <button
          type="submit"
          className="bg-primary py-3 rounded-md flex gap-4 items-center justify-center"
        >
          <p>SignUp</p>
          {loading && <p className=" fa fa-spin fa-spinner"></p>}
        </button>

        <p className="text-center my-4">Or</p>

        <button
          onClick={() => {
            supabase.auth.signOut();
          }}
          className="bg-white py-3 rounded-md flex gap-4 items-center justify-center"
        >
          <p>SignUp with Google</p>
        </button>
        <Link className="text-purple-700 mt-4" to={"/"}>
          Already have an account ?
        </Link>
      </form>
    </div>
  );
}
