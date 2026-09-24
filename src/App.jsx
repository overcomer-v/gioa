import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { SignUpPage } from "./pages/auth/SignUp";
import { AuthContextProvider, useAuth } from "./contexts/AuthContext";
import { AdminNavBar, UserMobileNavBar, UserNavBar } from "./components/Navbar";
import { AdminHeader, MainHeader } from "./components/Header";
import { Products } from "./pages/admin/Products";
import { LoginPage } from "./pages/auth/Login";
import { UserHomePage } from "./pages/user/HomePage";
import { useEffect, useState } from "react";
import { Users } from "./pages/admin/Users";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { BrandsView } from "./components/BrandsView";
import { CategoriesViewer } from "./pages/user/Categories";
import { Footer } from "./components/Footer";
import { GroupListOpener } from "./pages/user/GroupListOpener";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { ProductDetailsView } from "./pages/user/ProductDetailsView";
import { FeaturedProducts } from "./pages/user/FeaturedProduct";
import { ProductQueryPage } from "./pages/user/QueryPage";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/signup" element={<SignUpPage></SignUpPage>}></Route>{" "}
        <Route element={<AdminRoutesParent />}>
          <Route
            path="/admin-board"
            element={<AdminDashboard></AdminDashboard>}
          ></Route>{" "}
          <Route path="/admin-users" element={<Users></Users>}></Route>
          <Route path="/admin-products" element={<Products></Products>}></Route>
          <Route
            path="/admin-reports"
            element={<AdminDashboard></AdminDashboard>}
          ></Route>{" "}
          <Route
            path="/product-editor/:productId?"
            element={<ProductEditor></ProductEditor>}
          ></Route>
        </Route>
        <Route element={<UserRoutesParent />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<ProductQueryPage />}></Route>

          <Route path="/" element={<UserHomePage />}></Route>
          <Route
            path="/featured-products"
            element={<FeaturedProducts />}
          ></Route>
            <Route
            path="/checkout"
            element={<Checkout />}
          ></Route>

          <Route
            path="/product-details/:productId?"
            element={<ProductDetailsView />}
          ></Route>

          <Route
            path="/group-opener/:type/:id"
            element={<GroupListOpener />}
          ></Route>

          <Route path="/categories" element={<CategoriesViewer />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function UserRoutesParent() {
  const [showBrandsView, setShowBrandsView] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const loaction = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loaction]);
  return (
    <div className="relative flex flex-col justify-between  h-full min-h-screen ">
      <div>
        <MainHeader setShowMobileNav={setShowMobileNav}></MainHeader>
        <UserNavBar
          setShowBrands={setShowBrandsView}
          showBrands={showBrandsView}
        ></UserNavBar>
        <UserMobileNavBar
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
          setShowBrands={setShowBrandsView}
          showBrands={showBrandsView}
        />
        {showBrandsView && <BrandsView />}
        <div className=" ">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AdminRoutesParent() {
  const { user, role, isAuthloading } = useAuth();
  const [openAdminNavbar, setOpenAdminNavBar] = useState(false);

  if (isAuthloading) {
    return (
      <div className="w-screen h-[90vh] flex">
        <div className="fas m-auto fa-spinner fa-spin text-5xl opacity-70" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex relative items-start w-full">
      <div>
        <AdminNavBar
          openAdminNavbar={openAdminNavbar}
          setOpenAdminNavbar={setOpenAdminNavBar}
        />
      </div>

      <div className="w-full md:ml-[250px]">
        <AdminHeader onAdminNavBarOpen={setOpenAdminNavBar} />

        <div className="md:ml-16 mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
