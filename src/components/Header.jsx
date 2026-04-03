import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { generalPagePadding } from "../utils/constants";
import { useProfile } from "../hooks/databaseManager/useProfile";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function AdminHeader({ onAdminNavBarOpen }) {
  const { user, role } = useAuth();
  const { userProfile } = useProfile();
  const [showProfileDialogBox, setShowProfileDialogBox] = useState(false);

  return (
    <header className="flex z-[100] items-center justify-between px-16  py-4 w-full border-b-[1px] mb-3 sticky top-0 ">
      <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-md w-1/2">
        <i className="fa fa-search"></i>
        <span className="opacity-50">Search</span>
      </div>
      <div className="flex gap-6 items-center">
        <div
          className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 p-2 rounded-md"
          onClick={(e) => {
            setShowProfileDialogBox(true);
            e.stopPropagation();
          }}
        >
          <i className="fa fa-user-circle text-xl"></i>
          <p className="font-medium">{userProfile?.name}</p>
        </div>
        <i
          onClick={() => {
            onAdminNavBarOpen((e) => !e);
          }}
          className="fa fa-bars"
        ></i>
      </div>
      {user && userProfile && showProfileDialogBox && (
        <div className=" absolute top-20 right-20 bg-white rounded-lg p-4 px-8 z-[500] shadow-inner border-2 drop-shadow-md">
          <div className=" font-semibold mb-6 flex items-center justify-between">
            <p>Admin</p>
            {/* <i className="fa fa-arrow-right"></i> */}
          </div>
          <p className="font-semibold text-xl">{userProfile.name}</p>
          <div>{userProfile.email}</div>

          <button
            onClick={async (e) => {
              await supabase.auth.signOut();
              e.stopPropagation();
            }}
            className="mt-8 border-2 border-neutral-600 p-3 rounded-lg w-full flex items-center gap-4 justify-center"
          >
            <i className="fa fa-sign-out rotate-180"></i>
            <p className="">Sign Out</p>
          </button>
        </div>
      )}
    </header>
  );
}

export function MainHeader() {
  const { user, role } = useAuth();
  const { userProfile } = useProfile();
  const [showProfileDialogBox, setShowProfileDialogBox] = useState(false);

  useEffect(() => {
    const handler = () => setShowProfileDialogBox(false);

    window.document.addEventListener("click", handler);
    return () => window.document.removeEventListener("click", handler); // ← same reference
  }, []);

  return (
    <header
      className={`flex items-center ${generalPagePadding} py-5 justify-between w-full neutral-bg`}
    >
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
          <div
            className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 p-2 rounded-md"
            onClick={(e) => {
              setShowProfileDialogBox(true);
              e.stopPropagation();
            }}
          >
            <i className="fa fa-user-circle text-xl"></i>
            <p className="font-medium">{userProfile?.name}</p>
          </div>
        ) : role === "admin" ? (
          <div>
            <div
              className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 p-2 rounded-md"
              onClick={(e) => {
                setShowProfileDialogBox(true);
                e.stopPropagation();
              }}
            >
              <i className="fa fa-user-circle text-xl"></i>
              <p className="font-medium">{"Admin"}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 ">
            {" "}
            <Link
              to={"/login"}
              className="py-2 px-4 rounded-md border-2 text-sm hover:border-primary border-neutral-600 hover:bg-primary hover:text-white"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="py-2 px-4 rounded-md border-2 text-sm hover:border-primary border-neutral-600 hover:bg-primary hover:text-white"
            >
              SignUp
            </Link>
          </div>
        )}
        { user && role === "admin" ? (
          <Link to={"/admin-board"} className="border-l-2 border-neutral-500 pl-4  flex items-center gap-3 cursor-pointer hover:underline underline-offset-4" >
            <p className="font-semibold">Admin Page</p>
            <i className="fa fa-arrow-right"></i>
          </Link>
        ) :
          <i className="text-xl fa fa-shopping-cart border-l-2 border-neutral-500 pl-4 text-[rgb(171,192,34)] "></i>
        }{" "}
      </div>

      {user && userProfile && showProfileDialogBox && (
        <div className=" absolute top-20 right-20 bg-white rounded-lg p-4 px-8 z-[500] shadow-inner border-2 drop-shadow-md">
          <div className=" font-semibold mb-6 flex items-center justify-between">
            <p>Go To Profile</p>
            <i className="fa fa-arrow-right"></i>
          </div>
          <p className="font-semibold text-xl">{userProfile.name}</p>
          <div>{userProfile.email}</div>

          <button
            onClick={async (e) => {
              await supabase.auth.signOut();
              e.stopPropagation();
            }}
            className="mt-8 border-2 border-neutral-600 p-3 rounded-lg w-full flex items-center gap-4 justify-center"
          >
            <i className="fa fa-sign-out rotate-180"></i>
            <p className="">Sign Out</p>
          </button>
        </div>
      )}
    </header>
  );
}
