import { useEffect } from "react";
import { useProfile } from "../../hooks/databaseManager/useProfile";
import { useProducts } from "../../hooks/databaseManager/useProducts";

export function AdminDashboard() {
  
  const {userProfiles} = useProfile();
  const {fetchProducts,products} = useProducts();

  useEffect(()=>{
    
    fetchProducts(1,1000);
  },[]);


  return (
    <div className="flex flex-col p-4 page-animation">
      <div className="flex items-center gap-3">
        <i className="fa fa-map text-[rgb(37,2,46)]"></i>
        <h3 className="text-2xl font-medium">Dashboard</h3>
      </div>
      <div className="grid grid-cols-2 md:flex mt-8 gap-3">
        <BoardInfoCard
          title={userProfiles  ? userProfiles.length : "..."}
          subtitle={"Total users"}
          icondata={"fa-people-group"}
        ></BoardInfoCard>
        <BoardInfoCard
          title={"1,450"}
          subtitle={"Total Orders"}
          icondata={"fa-cart-shopping"}
        ></BoardInfoCard>
        <BoardInfoCard
          title={products ? products.length : "..."}
          subtitle={"Total Products"}
          icondata={"fa-box"}
        ></BoardInfoCard>
      </div>
       <div className="flex items-center gap-3 mt-8">
        <i className="fa fa-circle text-admin_primary text-xs"></i>
        <h3 className="text-lg font-medium">Recent Orders</h3>
      </div>
      
    </div>
  );
}

function BoardInfoCard({ title, subtitle, icondata }) {
  return (
    <div className="flex items-center gap-4 bg-white shadow-sm rounded-lg px-6 py-4">
      <i className={`fa ${icondata} rounded-full flex items-center justify-center h-10 w-10 bg-admin_primary text-white`}></i>
      <div>
        <h2 className="text-base font-medium">{title}</h2>
        <p className="opacity-60 text-xs ">{subtitle}</p>
      </div>
    </div>
  );
}
