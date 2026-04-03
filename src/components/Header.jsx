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
        <i className="fa fa-laptop text-white  bg-[rgb(171,192,34)] px-2 py-1 rounded-md text-xl"></i>{" "}
        <h2 className="text-2xl font-bold text-primary">GIOA</h2>
      </div>
      <div className="w-[40%] h-12 flex items-center justify-between rounded-xl overflow-hidden">
        <input
          className="bg-transparent px-8 border-neutral-200 border-2 rounded-l-xl h-full w-full py-1 text-sm placeholder:text-neutral-600"
          type="text"
          placeholder="Search Products here"
        />
        <i className="fa fa-search bg-primary h-full w-12 justify-center text-white flex items-center"></i>
      </div>
      <div className="flex items-center gap-4">
        {user && role === "user" ? (
          <div className="flex gap-2 items-center ">
            <span>Account</span>
            <i className="fa fa-user-circle"></i>
          </div>
        ) : (
          <div className="flex items-center gap-3 ">
            {" "}
            <Link  to={"/login"} className="py-2 px-4 rounded-md border-2 text-sm hover:border-primary border-neutral-600 hover:bg-primary hover:text-white">
              Login
            </Link>
            <Link to={"/signup"} className="py-2 px-4 rounded-md border-2 text-sm hover:border-primary border-neutral-600 hover:bg-primary hover:text-white">
              SignUp
            </Link>
          </div>
        )}
        <i className="fa fa-shopping-cart border-l-2 border-neutral-500 pl-4 text-[rgb(171,192,34)] "></i>
      </div>
    </header>
  );
}
