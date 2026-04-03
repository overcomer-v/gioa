import { useEffect, useState } from "react";
import { useAuthManager } from "../../hooks/authManager";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const { login, loading } = useAuthManager();
  const [errorMessage, setErrorMessage] = useState();
  const { user, isAuthloading, role } = useAuth();
  const navigate = useNavigate();
  const [logInDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

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
    console.log(user, role);
    if (!isAuthloading && user && role) {
      if (role != "admin") {
        navigate("/")
      } else {
        navigate("/admin-board");
      }
    }
  }, [isAuthloading, loading, user, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (logInDetails) {
      try {
        await login({
          ...logInDetails,
          onSuccess: () => {
            navigate(0);
          },
        });
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen text-sm [&_input]:bg-transparent [&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:border-2 [&_input]:rounded-md">
      <form
        className="flex flex-col [&>input]:mb-4 [&>label]:font-semibold [&>label]:mb-1 m-auto w-3/4 max-w-96"
        action=""
        onSubmit={handleLogin}
      >
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-primary">Login</h2>
          <span className="opacity-50 text-xs">
            Welcome Back, Please Sign In to Continue
          </span>
        </div>

        {errorMessage && (
          <div className="flex ease-in-out transition-all duration-500 translate-y-2 items-center gap-2 rounded-md px-3 py-3 mb-4 bg-red-300">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={logInDetails.email}
          onChange={(e) => {
            setLoginDetails((prev) => {
              return { ...prev, email: e.target.value };
            });
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={logInDetails.password}
          onChange={(e) => {
            setLoginDetails((prev) => {
              return { ...prev, password: e.target.value };
            });
          }}
        />
        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-md flex gap-4 items-center justify-center"
        >
          <p>Sign In</p>
          {loading && <p className=" fa fa-spin fa-spinner"></p>}
        </button>
        <Link className="text-purple-700 mt-4" to={"/signup"}>
          Don't have an account ?
        </Link>
      </form>
    </div>
  );
}
