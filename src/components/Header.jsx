import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { generalPagePadding } from "../utils/constants";
import { useProfile } from "../hooks/databaseManager/useProfile";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function AdminHeader({ onAdminNavBarOpen }) {
  const { user } = useAuth();
  const { userProfile } = useProfile();
  const [showProfileDialogBox, setShowProfileDialogBox] = useState(false);
  return (
    <header className=" sticky top-0 z-[100] flex items-center justify-between h-[72px] border-b border-neutral-200 bg-white px-5 md:px-8 ">
      {" "}
      {/* Search */}{" "}
      <div className=" hidden md:flex items-center w-[420px] h-10 rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-400 ">
        {" "}
        <i className="fa fa-search mr-3" />{" "}
        <span>Search products, orders...</span>{" "}
      </div>{" "}
      {/* Mobile title */}{" "}
      <p className="md:hidden text-lg font-semibold text-primary"> GIOA </p>{" "}
      {/* Right */}{" "}
      <div className="flex items-center gap-3">
        {" "}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileDialogBox((current) => !current);
          }}
          className=" flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100 "
        >
          {" "}
          <span className=" flex items-center justify-center h-9 w-9 rounded-full bg-primary text-white ">
            {" "}
            <i className="fa fa-user text-xs" />{" "}
          </span>{" "}
          <span className="hidden md:block text-sm font-medium text-primary">
            {" "}
            {userProfile?.name || "Admin"}{" "}
          </span>{" "}
          <i className="hidden md:block fa fa-chevron-down text-[10px] text-neutral-400" />{" "}
        </button>{" "}
        <button
          type="button"
          onClick={() => {
            onAdminNavBarOpen((current) => !current);
          }}
          className=" flex md:hidden items-center justify-center h-9 w-9 rounded-lg hover:bg-neutral-100 "
          aria-label="Open admin navigation"
        >
          {" "}
          <i className="fa fa-bars" />{" "}
        </button>{" "}
      </div>{" "}
      {user && userProfile && showProfileDialogBox && (
        <AdminProfileDialog
          userProfile={userProfile}
          onClose={() => setShowProfileDialogBox(false)}
        />
      )}{" "}
    </header>
  );
}
function AdminProfileDialog({ userProfile, onClose }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" absolute right-5 md:right-8 top-[64px] w-[250px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl "
    >
      {" "}
      <div className="px-5 py-5">
        {" "}
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          {" "}
          Administrator{" "}
        </p>{" "}
        <p className="mt-2 font-semibold text-primary">
          {" "}
          {userProfile.name}{" "}
        </p>{" "}
        <p className="mt-1 truncate text-xs text-neutral-500">
          {" "}
          {userProfile.email}{" "}
        </p>{" "}
      </div>{" "}
      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          onClose();
        }}
        className=" flex w-full items-center gap-3 border-t border-neutral-100 px-5 py-3 text-sm text-red-600 hover:bg-red-50 "
      >
        {" "}
        <i className="fa fa-sign-out rotate-180 text-xs" /> Sign out{" "}
      </button>{" "}
    </div>
  );
}

export function MainHeader({ setShowMobileNav }) {
  const { user, role } = useAuth();

  const navigate = useNavigate();

  const [showProfileDialogBox, setShowProfileDialogBox] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handler = () => setShowProfileDialogBox(false);

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    const search = searchValue.trim();

    if (!search) {
      navigate("/shop");
    } else {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }

    // Close mobile search after searching
    setShowMobileSearch(false);
  }

  return (
    <>
      <header
        className={`relative z-50 ${generalPagePadding} flex items-center justify-between h-[70px] bg-primary`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileNav(true);
            }}
            className="flex md:hidden items-center justify-center text-white mr-1"
            aria-label="Open navigation"
          >
            <i className="fa fa-bars text-lg" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-[rgb(171,192,34)] text-primary">
              <i className="fa fa-laptop text-sm" />
            </span>

            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              GIOA
            </span>
          </Link>
        </div>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden lg:flex w-[38%] h-10">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-l-full bg-white/10 border border-white/20 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[rgb(171,192,34)]"
          />

          <button
            type="submit"
            className="w-11 flex items-center justify-center rounded-r-full bg-white text-primary"
            aria-label="Search"
          >
            <i className="fa fa-search text-sm" />
          </button>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Mobile search */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileSearch((current) => !current);
            }}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white"
            aria-label="Search"
          >
            <i className="fa fa-search text-sm" />
          </button>

          {/* User */}
          {user ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDialogBox((current) => !current);
              }}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Account"
            >
              <i className="fa fa-user text-sm" />
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-white/30 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white transition-colors hover:bg-white hover:text-primary"
            >
              Sign in
            </Link>
          )}

          {/* Cart / Admin */}
          {user && role === "admin" ? (
            <Link
              to="/admin-board"
              className="hidden md:flex items-center gap-2 border-l border-white/20 pl-4 text-sm font-medium text-white hover:text-[rgb(171,192,34)] transition-colors"
            >
              Admin
              <i className="fa fa-arrow-right text-xs" />
            </Link>
          ) : (
            user && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center border-l border-white/20 pl-3 md:pl-4 text-white hover:text-[rgb(171,192,34)]"
                aria-label="Cart"
              >
                <i className="fa fa-shopping-cart text-lg" />
              </Link>
            )
          )}
        </div>

        {/* Profile dropdown */}
        {user && showProfileDialogBox && (
          <HeaderDialog onClose={() => setShowProfileDialogBox(false)} />
        )}
      </header>

      {/* Mobile search panel */}
      {showMobileSearch && (
        <div
          className="lg:hidden relative z-40 border-b border-neutral-200 bg-white px-4 py-3 shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSearch} className="flex h-11 w-full">
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 rounded-l-xl border border-neutral-300 bg-neutral-50 px-4 text-sm text-primary outline-none focus:border-[rgb(171,192,34)]"
            />

            <button
              type="submit"
              className="w-12 rounded-r-xl bg-primary text-white"
              aria-label="Search"
            >
              <i className="fa fa-search text-sm" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function HeaderDialog({ onClose }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-4 md:right-10 top-[64px] w-[260px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
    >
      {/* Account information */}
      <div className="px-5 py-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Account
        </p>

        <p className="mt-2 font-semibold text-primary">
          {user.user_metadata?.name || "User"}
        </p>

        <p className="mt-1 truncate text-xs text-neutral-500">{user.email}</p>
      </div>

      <div className="border-t border-neutral-100" />

      {/* Profile */}
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center justify-between px-5 py-3 text-sm text-primary hover:bg-neutral-50"
      >
        <span>My profile</span>
        <i className="fa fa-arrow-right text-xs text-neutral-400" />
      </Link>

      {/* Sign out */}
      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          onClose();
        }}
        className="flex w-full items-center gap-3 border-t border-neutral-100 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
      >
        <i className="fa fa-sign-out rotate-180 text-xs" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
