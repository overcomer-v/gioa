import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { generalPagePadding } from "../utils/constants";

export function AdminHeader({ onAdminNavBarOpen }) {
  return (
    <header className="flex z-[100] items-center justify-between px-6  py-4 w-full border-b-[1px] mb-3 sticky top-0 ">
      <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-md w-1/2">
        <i className="fa fa-search"></i>
        <span className="opacity-50">Search</span>
      </div>
      <div className="flex gap-6 items-center">
        <i className="fa fa-user-circle"></i>
        <i
          onClick={() => {
            onAdminNavBarOpen((e) => !e);
          }}
          className="fa fa-bars"
        ></i>
      </div>
    </header>
  );
}

export function MainHeader() {
  const { user, role } = useAuth();

  return (
    <header className={`flex items-center ${generalPagePadding} py-5 justify-between w-full neutral-bg`}>
      <div className="flex items-center gap-2">
        <i className="fa fa-bullseye text-base"></i>{" "}
        <h2 className="text-xl font-semibold">Gioa</h2>
      </div>
      <div className="w-[50%] h-10 flex bg-neutral-100 items-center justify-between rounded-full overflow-hidden">
        <input
          className="bg-transparent px-4 py-1 text-sm"
          type="text"
          placeholder="Search Products here"
        />
        <i className="fa fa-search bg-primary h-full w-10 justify-center flex items-center"></i>
      </div>
      <div className="flex items-center gap-4">
        {user && role === "user" ? (
          <div className="flex gap-2 items-center ">
            <span>Account</span>
            <i className="fa fa-user-circle"></i>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {" "}
            <Link  to={"/login"} className="py-2 px-4 rounded-full border-2 text-sm border-neutral-600 hover:bg-neutral-100 hover:text-neutral-800">
              Login
            </Link>
            <Link to={"/signup"} className="py-2 px-4 rounded-full border-2 text-sm border-neutral-600 hover:bg-neutral-100 hover:text-neutral-800">
              SignUp
            </Link>
          </div>
        )}
        <i className="fa fa-shopping-cart border-l-2 border-neutral-500 pl-4"></i>
      </div>
    </header>
  );
}
