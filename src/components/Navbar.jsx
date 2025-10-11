import { use, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export function AdminNavBar({ openAdminNavbar, setOpenAdminNavbar }) {
  const navRef = useRef();

  useEffect(() => {
    function handleOffsideClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenAdminNavbar(false);
      }
    }

    if (openAdminNavbar) {
      setTimeout(() => {
        document.addEventListener("click", handleOffsideClick);
      }, 100);
    }

    return () => {
      document.removeEventListener("click", handleOffsideClick);
    };
  }, [openAdminNavbar]);

  return (
    <nav
      ref={navRef}
      className={`py-10 px-2 pr-24 h-screen bg-primary-dark fixed  z-[1000] md:left-0 ${
        openAdminNavbar ? "left-0" : "-left-[250px]"
      } top-0 ease-in-out transition-all duration-700 `}
    >
      <div className=" flex items-center gap-4 mb-8">
        <i className="fa fa-bullseye"></i>
        <div>Gioa</div>
      </div>
      <div className="flex flex-col gap-6">
        <NavItems
          name={"Dashboard"}
          iconData={"fa-map"}
          to={"/admin-board"}
        ></NavItems>
        <NavItems
          name={"Users"}
          iconData={"fa-user"}
          to={"/admin-users"}
        ></NavItems>
        <NavItems
          name={"Products"}
          iconData={"fa-box"}
          to={"/admin-products"}
        ></NavItems>
        <NavItems
          name={"Reports"}
          iconData={"fa-comments"}
          to={"/admin-reports"}
        ></NavItems>
        <Link
         to={"/"}
          className="flex items-center gap-2 mt-8 ml-4 text-sm"
        >
          <i className="fa fa-arrow-left "></i>
          <span>Bact to HomePage</span>
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="flex items-center gap-2 mt-2 ml-4 text-sm"
        >
          <i className="fa fa-sign-out rotate-180 "></i>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );

  function NavItems({ name, iconData, to }) {
    return (
      <NavLink
        onClick={() => {
          setOpenAdminNavbar(false);
        }}
        to={to}
      >
        {({ isActive }) => (
          <div
            className={`flex gap-4 items-center ${
              isActive ? "border-l-2 opacity-100" : "opacity-50"
            } pl-8 `}
          >
            <i className={`fa ${iconData} text-sm`}></i>
            <h5 className="text-sm">{name}</h5>
          </div>
        )}
      </NavLink>
    );
  }
}

export function UserNavBar({ setShowBrands }) {
  return (
    <nav className=" py-2 gap-6 px-8 bg-primary flex items-center overflow-auto">
      <NavItems label={"Home"} iconData={"fa-home"} to={"/"}></NavItems>
      <NavItems
        label={"Contact Us"}
        iconData={"fa-phone"}
        to={"contacts"}
      ></NavItems>
      <NavItems
        label={"About Us"}
        iconData={"fa-bullseye"}
        to={"about"}
      ></NavItems>
      <NavItems
        label={"Shop by Brands"}
        iconData={"fa-shop"}
        isBrands={true}
        onClick={() => {
          setShowBrands((e) => !e);
        }}
      ></NavItems>
      <NavItems
        label={"Categories"}
        iconData={"fa-sort"}
        to={"/categories"}
      ></NavItems>
    </nav>
  );

  function NavItems({ label, to, iconData, onClick, isBrands }) {
    return (
      <NavLink to={to} onClick={onClick}>
        {({ isActive }) => (
          <div
            className={`flex items-center gap-2 flex-shrink-0 flex-nowrap text-nowrap px-4 py-2 text-sm ${
              isActive && !isBrands && "bg-neutral-800 text-primary"
            } hover:bg-neutral-800 hover:text-primary rounded-full`}
          >
            <i className={`fa ${iconData}`}></i>
            <span className="">{label}</span>
          </div>
        )}
      </NavLink>
    );
  }
}
