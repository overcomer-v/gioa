import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { UsersProductCard } from "../../components/Cards";
import { Spinner } from "../../components/Spinners";
import { PageNavigator } from "../../components/PageNavigator";
import { getProductImage } from "../../utils/helpers";
import { generalPagePadding } from "../../utils/constants";




function getProductPrice(product) {
  const activeVariant = product.variants?.find(
    (variant) => variant.is_active !== false
  );

  return activeVariant?.price ?? product.base_price ?? 0;
}


export function GroupListOpener() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const {
    fetchProductsByCategory,
    fetchProductsByBrand,
    productCount,
  } = useProducts();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const limit = 15;

  const isCategory = type === "category";
  const isBrand = type === "brand";


  // Reset the page when changing category/brand
  useEffect(() => {
    setPage(1);
  }, [type, id]);


  // Fetch products
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (!id || (!isCategory && !isBrand)) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let result = [];

        if (isCategory) {
          result = await fetchProductsByCategory(id, page, limit);
        } else if (isBrand) {
          result = await fetchProductsByBrand(id, page, limit);
        }

        // Prevent an old request from updating the page
        if (!cancelled) {
          setProducts(result || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load products:", error);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };

    // These functions come from useProducts and may have
    // unstable references, so don't put them in this dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type, page]);


  console.log("GrouplistOpener",products);

  const groupName = isCategory
    ? products[0]?.categories?.[0]?.name
    : products[0]?.brands?.name;


  const totalPages = Math.ceil(productCount / limit);


  if (!isCategory && !isBrand) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
            Invalid collection
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-neutral-900">
            This page doesn't exist
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 text-sm font-medium underline underline-offset-4"
          >
            Browse all products
          </button>
        </div>
      </div>
    );
  }


  return (
    <main className={` min-h-screen bg-white text-neutral-900`}>

      {/* Header */}
      <section className={`${generalPagePadding} bg-neutral-100`}>

        {/* <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <i className="fa fa-arrow-left text-xs transition-transform group-hover:-translate-x-1" />
          Back
        </button> */}

        <div className="py-8 max-w-4xl md:py-12">

          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 md:text-sm">
            {isCategory ? "Category" : "Brand"}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {groupName ||
              (isCategory ? "Category products" : "Brand products")}
          </h1>

          {!isLoading && (
            <div className="mt-5 flex items-center gap-3 text-sm text-neutral-500">
              <span>
                {productCount}{" "}
                {productCount === 1 ? "product" : "products"}
              </span>

              <span className="h-1 w-1 rounded-full bg-neutral-300" />

              <span>
                {isCategory
                  ? "Explore this collection"
                  : "Explore this brand"}
              </span>
            </div>
          )}

        </div>
      </section>


      {/* Products */}
      <section className={`${generalPagePadding} py-6 md:py-8`}>

        {isLoading ? (

          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner size="text-3xl opacity-60" />
          </div>

        ) : products.length === 0 ? (

          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <i className="fa fa-box-open text-neutral-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No products found
            </h2>

            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              There are currently no products available in this collection.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Browse all products
            </button>

          </div>

        ) : (

          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">

              {products.map((product) => (
                <UsersProductCard
                  key={product.id}
                  id={product.id}
                  label={product.name}
                  imageSrc={getProductImage(product)}
                  price={getProductPrice(product)}
                  brand={product.brands?.name}
                  category={product.categories?.[0]?.name}
                />
              ))}

            </div>


            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <PageNavigator
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}

          </>
        )}

      </section>
    </main>
  );
}
