import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../supabase";
import { generalPagePadding } from "../utils/constants";

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
        <Link to={"/"} className="flex items-center gap-2 mt-8 ml-4 text-sm">
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

export function UserNavBar({ setShowBrands, showBrands }) {
  return (
    <nav
      className={`${generalPagePadding} py-4 gap-6 no-scrollbar bg-primary md:flex items-center overflow-auto hidden sticky top-0 z-50`}
    >
      <NavItems label={"Home"} iconData={"fa-home"} to={"/"}></NavItems>

      <NavItems
        label={"Categories"}
        iconData={"fa-sort"}
        to={"/categories"}
      ></NavItems>
      <NavItems
        label={"Featured"}
        iconData={"fa-box"}
        to={"/featured-products"}
      ></NavItems>
      <div
        className={`${showBrands && "border-[2px] border-neutral-100 rounded-xl"}`}
      >
        <NavItems
          label={"Shop by Brands"}
          iconData={"fa-shop"}
          isBrands={true}
          onClick={() => {
            setShowBrands((e) => !e);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        ></NavItems>
      </div>
      <NavItems label={"Contact Us"} iconData={"fa-phone"} to={"/b"}></NavItems>
      <NavItems
        label={"About Us"}
        iconData={"fa-bullseye"}
        to={"/a"}
      ></NavItems>
    </nav>
  );
}

export function UserMobileNavBar({showMobileNav,setShowMobileNav,setShowBrands, showBrands}) {

const navRef = useRef(null);

   useEffect(() => {
    const handler = (e) => {
      if (e.target !== navRef.current) {
        setShowMobileNav(false);
      }
    };

   setTimeout(()=>{
     window.document.addEventListener("click", handler);
   },200);
    return () => window.document.removeEventListener("click", handler); // ← same reference
  }, [showMobileNav,setShowMobileNav]);


  return (
    <>
      <nav ref={navRef} className={`fixed ${showMobileNav ? "left-0" : "-left-[80%]"} top-0 bg-primary w-[70%] flex flex-col gap-4 h-full py-6 px-5 z-50 ease-in-out duration-500 translate-x-0`}>
        <div className="flex items-center gap-4 mb-4 ml-5">
          <i className="fa fa-laptop text-white bg-[rgb(171,192,34)] px-2 py-2 md:py-1 rounded-md md:text-xl"></i>
          <h2 className="md:text-2xl font-bold text-white">GIOA</h2>
           { <i className="text-xl fa fa-shopping-cart pl-4 text-white  ml-auto"></i>}
        </div>

        <NavItems label={"Home"} iconData={"fa-home"} to={"/"} />
        <NavItems label={"Categories"} iconData={"fa-sort"} to={"/categories"} />
        <NavItems label={"Featured"} iconData={"fa-box"} to={"/featured-products"} />
          <div
        className={`${showBrands && "border-[2px] border-neutral-100 rounded-xl"}`}
      >
        <NavItems
          label={"Shop by Brands"}
          iconData={"fa-shop"}
          isBrands={true}
          onClick={() => {
            setShowBrands((e) => !e);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        ></NavItems>
      </div>
        <NavItems label={"Contact Us"} iconData={"fa-phone"} to={"/b"} />
        <NavItems label={"About Us"} iconData={"fa-bullseye"} to={"/a"} />
      </nav>

      {/* Dark overlay on the right */}
      <div className={`fixed top-0 h-full w-[100%] bg-black/30 z-40  ${showMobileNav ? "right-0 " : "-left-[100%]"} ease-in-out duration-500 translate-x-0`}  />
    </>
  );
}

function NavItems({ label, to, iconData, onClick, isBrands }) {
  return (
    <NavLink to={to} onClick={onClick}>
      {({ isActive }) => (
        <div
          className={`flex text-white items-center gap-2 flex-shrink-0 flex-nowrap text-nowrap px-5 py-2 text-sm ${
            isActive &&
            !isBrands &&
            "bg-neutral-100  !text-primary font-semibold scale-105"
          } hover:bg-neutral-100 hover:text-primary rounded-lg`}
        >
          <i className={`fa ${iconData}`}></i>
          <span className="">{label}</span>
        </div>
      )}
    </NavLink>
  );
}
