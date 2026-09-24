import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { generalPagePadding } from "../utils/constants";


export function BrandsView() {
  const { fetchBrands } = useProducts();
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    fetchBrands().then((results) => {
      setBrands(results);
    });
  }, []);
  return (
    <section
      className={` ${generalPagePadding} border-b border-neutral-200 bg-white py-4 page-animation `}
    >
      {" "}
      <div className="flex items-center justify-between mb-3">
        {" "}
        <div>
          {" "}
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            {" "}
            Explore{" "}
          </p>{" "}
          <h2 className="mt-1 text-base md:text-lg font-semibold text-primary">
            {" "}
            Brands{" "}
          </h2>{" "}
        </div>{" "}
        {brands?.length > 0 && (
          <span className="text-xs text-neutral-400">
            {" "}
            {brands.length} brands{" "}
          </span>
        )}{" "}
      </div>{" "}
      {brands ? (
        <div className=" flex gap-2 overflow-x-auto pb-1 no-scrollbar ">
          {" "}
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/group-opener/brand/${brand.id}`}
              className=" shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs md:text-sm font-medium text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white "
            >
              {" "}
              {brand.name}{" "}
            </Link>
          ))}{" "}
        </div>
      ) : (
        <div className="flex h-10 items-center">
          {" "}
          <Spinner size="text-sm opacity-50 text-neutral-500" />{" "}
        </div>
      )}{" "}
    </section>
  );
}
