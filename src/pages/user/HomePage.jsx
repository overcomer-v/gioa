import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { generalPagePadding } from "../../utils/constants";
import { UsersProductCard, SecondaryProductCard } from "../../components/Cards";
import { Spinner } from "../../components/Spinners";
import { Subtitle } from "../../components/Titles";
import { useIsMobile } from "../../hooks/useDevice";
import { getProductImage } from "../../utils/helpers";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";

export function UserHomePage() {
  const [categories, setCategories] = useState([]);

  const { fetchCategories, products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();

    fetchCategories().then((results) => {
      setCategories(results || []);
      console.log(results);
    });
  }, []);

  return (
    <main className="bg-white text-neutral-900 w-full">
      {/* Category navigation */}
      {/* <CategoryNavigation categories={categories} /> */}

      {/* Hero */}
      <HeroSection />

      <div className={`${generalPagePadding} flex flex-col gap-16 md:gap-24 mt-16`}>
        {/* Popular categories */}
        <TopCategoriesSection categories={categories} />

        {/* New arrivals */}
        <NewArrivals products={products} />

        {/* Promotional banner */}
        <PromoBanner />

        {/* Category product sections */}
        <CategoriesPreview />

        {/* More products */}
        <MoreToLike products={products} />
      </div>
    </main>
  );
}

/* =========================================================
   CATEGORY NAVIGATION
========================================================= */

function CategoryNavigation({ categories }) {
  return (
    <nav className="hidden md:block border-b bg-white">
      <div
        className={`${generalPagePadding} flex items-center gap-1 overflow-x-auto no-scrollbar`}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/group-opener/category/${category.name}`}
            className="shrink-0 px-4 py-4 text-sm text-neutral-600 transition hover:text-black"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection() {
  return (
    <section className="relative h-[430px] overflow-hidden md:h-[620px]">
      <img
        src="/images/pxfuel.jpg"
        alt="Latest electronics"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div
        className={`${generalPagePadding} relative z-10 flex h-full items-center`}
      >
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 md:text-sm">
            Discover what&apos;s next
          </p>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Upgrade your world with better tech.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-6 text-white/75 md:text-base">
            Explore quality electronics from trusted brands, built for work,
            entertainment and everyday life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/group-opener/category/Headphones & Earbuds"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Shop now
            </Link>

            <Link
              to="/categories"
              className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TOP CATEGORIES
========================================================= */

function TopCategoriesSection({ categories = [] }) {
  if (categories.length === 0) {
    return (
      <section>
        <SectionHeading
          eyebrow="Explore"
          title="Shop by category"
        />

        <div className="flex h-48 items-center justify-center">
          <Spinner size="text-3xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <SectionHeading
        eyebrow="Explore"
        title="Shop by category"

      />

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {categories.slice(0, 6).map((category) => (
          <Link
            key={category.id}
            to={`/group-opener/category/${category.name}`}
            className="group relative h-40 overflow-hidden rounded-2xl bg-neutral-100 md:h-48"
          >
            {category.image_url ? (
              <img
                src={category.public_url}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-100" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-sm font-semibold text-white">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   NEW ARRIVALS
========================================================= */

function NewArrivals({ products = [] }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

  const sortedProducts = useMemo(() => {
    return [...products].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [products]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || sortedProducts.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (isPaused) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;

      const isAtEnd =
        scrollLeft + clientWidth >= scrollWidth - 5;

      const scrollDistance = isMobile
        ? clientWidth
        : 500;

      if (isAtEnd) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: scrollDistance,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isMobile, sortedProducts.length]);

  return (
    <section>
      <SectionHeading
        eyebrow="Just in"
        title="New arrivals"
        action="View all"
        actionHref="/products"
      />

      {sortedProducts.length === 0 ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="text-3xl" />
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar"
        >
          {sortedProducts.slice(0, 15).map((product) => (
            <ProductCardWrapper
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   PROMOTIONAL BANNER
========================================================= */

function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 text-white md:px-14 md:py-16">
      <div className="relative z-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          Power your everyday
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Technology that fits your lifestyle.
        </h2>

        <p className="mt-4 max-w-md text-sm leading-6 text-white/60 md:text-base">
          From portable audio to smart devices and everyday essentials,
          find products made to keep up with you.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Start shopping
        </Link>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full border border-white/10" />
    </section>
  );
}

/* =========================================================
   CATEGORY PRODUCT PREVIEWS
========================================================= */

function CategoriesPreview() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchCategories } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    fetchCategories().then((results) => {
      if (!mounted) return;

      setCategories(results || []);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner size="text-3xl opacity-70" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-14">
      {categories.slice(0, 5).map((category) => (
        <div key={category.id}>
          <SectionHeading
            eyebrow="Collection"
            title={category.name}
            action="Shop more"
            onAction={() =>
              navigate(
                `/group-opener/category/${category.name}`
              )
            }
          />

          <CategoriesItemsView categoryId={category.id} />
        </div>
      ))}
    </section>
  );
}

/* =========================================================
   MORE TO LIKE
========================================================= */

function MoreToLike({ products = [] }) {
  const scrollRef = useRef(null);

  return (
    <section>
      <SectionHeading
        eyebrow="You may also like"
        title="More to explore"
      />

      <div
        ref={scrollRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar"
      >
        {products.slice(0, 6).map((product) => (
          <div
            key={product.id}
            className="w-[85vw] shrink-0 md:w-[440px]"
          >
            <SecondaryProductCard
              id={product.id}
              label={product.name}
              imageSrc={getProductImage(product)}
              price={`₦${Number(product.base_price || 0).toLocaleString()}`}
              category={getProductCategory(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCardWrapper({ product }) {
  return (
    <div className="w-[160px] shrink-0 md:w-[220px]">
      <UsersProductCard
        id={product.id}
        label={product.name}
        imageSrc={getProductImage(product)}
        price={`₦${Number(
          product.base_price || getProductPrice(product)
        ).toLocaleString()}`}
        category={getProductCategory(product)}
        brand={product.brands?.name}
      />
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */


function getProductPrice(product) {
  return (
    product.product_variants?.find(
      (variant) => variant.is_active
    )?.price || 0
  );
}

function getProductCategory(product) {
  return (
    product.categories?.[0]?.name ||
    product.product_categories?.[0]?.categories?.name ||
    ""
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  action,
  actionHref,
  onAction,
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 md:text-xs">
            {eyebrow}
          </p>
        )}

        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>

      {action &&
        (actionHref ? (
          <Link
            to={actionHref}
            className="shrink-0 text-xs font-semibold text-neutral-500 transition hover:text-black md:text-sm"
          >
            {action} →
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="shrink-0 text-xs font-semibold text-neutral-500 transition hover:text-black md:text-sm"
          >
            {action} →
          </button>
        ))}
    </div>
  );
}

