import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { Link } from "react-router-dom";
import { generalPagePadding } from "../utils/constants";
import { Subtitle } from "./Titles";

export function BrandsView() {
  const { getBrandNames } = useProducts();
  const [brands, setBrands] = useState();

  useEffect(() => {
    getBrandNames().then((results) => {
      setBrands(results);
    });
  }, []);

  return (
    <div className={`md:mt-6 pt-3  ${generalPagePadding}  page-animation md:border-0 border-t-2 border-neutral-100`}>
    <h2 className="md:mb-6 mb-3 font-semibold md:text-2xl text-xl text-primary">
      Brands
    </h2>
      {brands ? (
        <div
          className={`flex flex-wrap gap-3 md:gap-4 pb-6 bg-white border-b-2 border-neutral-200 text-white max-60 overflow-y-scroll no-scrollbar`}
        >
          {brands.map((e) => (
            <Link
              to={`/group-opener/brand/${e}`}
              key={e}
              className="rounded-full md:py-2 md:px-4 py-1 px-3 border-2 border-neutral-200 text-primary hover:bg-primary hover:text-white md:text-sm text-xs"
            >
              {e}
            </Link>
          ))}
        </div>
      ) : (
        <div className=" flex w-full h-20 bg-white">
          <Spinner size="text-xl opacity-60 m-auto text-neutral-500" />
        </div>
      )}
    </div>
  );
}
