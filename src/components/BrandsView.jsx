import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { Link } from "react-router-dom";
import { generalPagePadding } from "../utils/constants";

export function BrandsView() {
  const { getBrandNames } = useProducts();
  const [brands, setBrands] = useState();

  useEffect(() => {
    getBrandNames().then((results) => {
      setBrands(results);
    });
  }, []);

  return brands ? (
    <div className={`flex flex-wrap gap-4 py-6 ${generalPagePadding} bg-white border-b-2 border-neutral-200 text-white max-60 overflow-y-scroll page-animation`}>
      {brands.map((e) => (
        <Link
        to={`/group-opener/brand/${e}`}
          key={e}
          className="rounded-full py-2 px-4 text-sm border-2 border-neutral-200 text-primary hover:bg-primary hover:text-white"
        >
          {e}
        </Link>
      ))}
    </div>
  ) : (
    <div className=" flex w-full h-20 bg-white">
      <Spinner size="text-xl opacity-60 m-auto text-neutral-500" />
    </div>
  );
}
