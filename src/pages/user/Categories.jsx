import { useEffect, useState } from "react";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Spinner } from "../../components/Spinners";
import { useNavigate } from "react-router-dom";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { generalPagePadding } from "../../utils/constants";

export function CategoriesViewer() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchCategories } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);

    fetchCategories()
      .then((results) => {
        if (!mounted) return;

        setCategories(results || []);
        console.log(results);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);

        if (mounted) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner size="text-3xl opacity-60" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className={``}>
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <header className={`${generalPagePadding} mb-10 md:mb-16 py-8 `}>
          <button
            onClick={() => navigate(-1)}
            className="mb-7 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200">
              <i className="fa fa-arrow-left text-xs" />
            </span>

            <span>Back</span>
          </button>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Explore Gioa
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Categories
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
            Explore our collection of electronics and find the
            technology that fits your everyday needs.
          </p>
        </header>

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        <section>
          <div className={`${generalPagePadding} grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6`}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() =>
                  navigate(
                    `/group-opener/category/${category.id}`
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* =================================================
            CATEGORY PRODUCT PREVIEWS
        ================================================= */}

        <section className={`mt-20 md:mt-28 ${generalPagePadding}`}>
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Browse collections
            </p>

            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
              Find something you&apos;ll love
            </h2>
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {categories.map((category) => (
              <CategoryPreview
                key={category.id}
                category={category}
                onShopMore={() =>
                  navigate(
                    `/group-opener/category/${category.name}`
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({ category, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-44 overflow-hidden rounded-2xl bg-neutral-100 text-left md:h-56"
    >
      {category.public_url ? (
        <img
          src={category.public_url}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
      )}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-sm font-semibold text-white md:text-base">
            {category.name}
          </h2>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-black">
            <i className="fa fa-arrow-right text-[10px]" />
          </span>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   CATEGORY PREVIEW
========================================================= */

function CategoryPreview({ category, onShopMore }) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 md:text-xs">
            Collection
          </p>

          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            {category.name}
          </h2>
        </div>

        <button
          onClick={onShopMore}
          className="shrink-0 text-xs font-semibold text-neutral-500 transition hover:text-black md:text-sm"
        >
          Shop more →
        </button>
      </div>

      <CategoriesItemsView categoryId={category.id} />
    </section>
  );
}
