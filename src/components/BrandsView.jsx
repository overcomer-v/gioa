import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { Link } from "react-router-dom";

export function BrandsView() {
  const { getBrandNames } = useProducts();
  const [brands, setBrands] = useState();

  useEffect(() => {
    getBrandNames().then((results) => {
      setBrands(results);
    });
  }, []);

  return brands ? (
    <div className="flex flex-wrap gap-4 py-6 px-3 bg-neutral-800 border-b-2 border-neutral-700 text-white max-60 overflow-y-scroll page-animation">
      {brands.map((e) => (
        <Link
        to={`/group-opener/brand/${e}`}
          key={e}
          className="rounded-full py-2 px-4 text-sm border-2 border-neutral-700 text-primary"
        >
          {e}
        </Link>
      ))}
    </div>
  ) : (
    <div className=" flex w-full h-20 bg-neutral-800">
      <Spinner size="text-xl opacity-60 m-auto text-neutral-100" />
    </div>
  );
}
