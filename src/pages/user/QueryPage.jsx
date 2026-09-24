import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Spinner } from "../../components/Spinners";
import { PageNavigator } from "../../components/PageNavigator";
import { getProductImage } from "../../utils/helpers";
import { UsersProductCard } from "../../components/Cards";

export function ProductQueryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { queryProducts, fetchCategories, fetchBrands } = useProducts();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCount, setProductCount] = useState(0);

  // Guards against an older, slower request overwriting a newer one
  const requestIdRef = useRef(0);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const limit = 15;

  const maxPage = Math.max(1, Math.ceil(productCount / limit));

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const result = await queryProducts(
          { search, category, brand, minPrice, maxPrice, sort, page, limit },
          { signal: controller.signal },
        );

        if (requestId !== requestIdRef.current) return; // stale response

        setProducts(result.products || []);
        setProductCount(result.count || 0);
      } catch (err) {
        if (err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;

        console.error("Error loading products:", err);
        setError("Something went wrong loading products. Please try again.");
        setProducts([]);
        setProductCount(0);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [search, category, brand, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [categoryData, brandData] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
        ]);

        setCategories(categoryData || []);
        setBrands(brandData || []);
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    }

    loadFilters();
  }, []);

  function updateParam(name, value) {
    setSearchParams((params) => {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Changing a filter/sort resets to page 1; changing the
      // page itself must NOT be overridden back to 1.
      if (name !== "page") {
        params.set("page", "1");
      }

      return params;
    });
  }

  return (
    <main className="px-4 md:px-8 lg:px-16 py-8">
      {/* Heading */}
      <div className="mb-8">
        {search ? (
          <>
            <h1 className="text-2xl font-semibold">
              Search results for "{search}"
            </h1>

            <p className="text-sm opacity-60 mt-1">
              {productCount} products found
            </p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold">Featured Products</h1>
        )}
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <aside className="border rounded-lg p-5 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Filters</h2>

            <button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("category");
                  params.delete("brand");
                  params.delete("minPrice");
                  params.delete("maxPrice");
                  params.set("page", "1");

                  return params;
                });
              }}
              className="text-sm opacity-60 hover:opacity-100"
            >
              Clear
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Categories</h3>

            <div className="flex flex-col gap-3">
              {categories.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === item.slug}
                    onChange={() => updateParam("category", item.slug)}
                    className="appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-black checked:border-black transition-colors cursor-pointer"
                  />

                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-medium mb-3">Brands</h3>

            <div className="flex flex-col gap-3">
              {brands.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={brand === item.slug}
                    onChange={() => updateParam("brand", item.slug)}
                    className="appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-black checked:border-black transition-colors cursor-pointer"
                  />

                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <span className="text-sm opacity-60">{productCount} products</span>
            <div className="border-2 rounded-md bg-white px-2 py-2 text-sm ">
              <select
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="bg-white text-gray-900 rounded-md outline-0 outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <h2 className="text-lg font-medium">Couldn't load products</h2>
              <p className="text-sm opacity-60 mt-2">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-lg font-medium">No products found</h2>
              <p className="text-sm opacity-60 mt-2">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((item) => (
                  <UsersProductCard
                    key={item.id}
                    id={item.id}
                    label={item.name}
                    imageSrc={getProductImage(item)}
                    price={`₦${Number(
                      item.base_price || item.price || 0,
                    ).toLocaleString()}`}
                    brand={item.brands?.name || item.brand}
                    category={item.categories?.[0]?.name || item.category}
                  />
                ))}
              </div>

              {maxPage > 1 && (
                <div className="my-12">
                  <PageNavigator
                    pageNo={page}
                    maxPageNo={maxPage}
                    onPageChange={(newPage) => {
                      updateParam("page", newPage);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}