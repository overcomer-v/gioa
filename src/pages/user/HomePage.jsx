import { useEffect, useState } from "react";
import { MainHeader } from "../../components/Header";
import { UserNavBar } from "../../components/Navbar";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Link } from "react-router-dom";
import { generalPagePadding } from "../../utils/constants";
import { SecondaryProductCard, UsersProductCard } from "../../components/Cards";
import { Products } from "../admin/Products";
import { PageNavigator } from "../../components/PageNavigator";
import { Spinner } from "../../components/Spinners";
import { BrandsView } from "../../components/BrandsView";
import { Subtitle } from "../../components/Titles";

export function UserHomePage() {
  const [categories, setCategories] = useState([]);
  const { fetchCategories, products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
    fetchCategories().then((e) => {
      setCategories(e);
      console.log(e);
    });
  }, []);

  return (
    <main className="">
      <div className="px-8 flex text-sm neutral-bg overflow-scroll">
        <div className="flex items-center py-4 gap-2 mr-8 px-8 ">
          <span className="text-nowrap">All Categories</span>
          <i className="fa fa-bars"></i>
        </div>
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/group-opener/category/${category.name}`}
            className="py-4 px-4 hover:bg-neutral-700 text-nowrap"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <HeroSection></HeroSection>
      <section className={` flex flex-col gap-16 ${generalPagePadding}`}>
        <TopCategoriesSection categories={categories} />
        <NewArrivals products={products} />
        <FeaturedProducts />
        <MoreToLike products={products} />
      </section>
    </main>
  );

  function HeroSection() {
    return (
      <section>
        <div className="md:h-[450px] h-[300px] relative">
          <img
            className="h-full w-full object-cover absolute z-10 top-0 right-0 bottom-0 left-0"
            src="/images/pxfuel.jpg"
            alt=""
          />
          <div className="  flex absolute z-20 top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50">
            <div
              className={` my-auto md:w-[50%] w-[80%] ${generalPagePadding} flex flex-col gap-4 text-white`}
            >
              <h1 className="md:text-5xl text-2xl font-bold leading-tight">
                Upgrade Your World with the Latest Tech
              </h1>
              <span className="opacity-70 text-xs md:text-base">
                Discover premium electronics at prices you will love and a good
                customer satisfaction
              </span>
              <button className="bg-primary w-fit px-5 py-3 text-black rounded-full">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function TopCategoriesSection({ categories = [] }) {
    return (
      <section className="mt-12 w-full">
        <Subtitle label={"Top Categories"}></Subtitle>

        {categories.length === 0 ? (
          <div className="flex w-full h-60">
            <Spinner size="text-3xl m-auto" />
          </div>
        ) : (
          <div className="flex items-center no-scrollbar py-3 overflow-scroll gap-4 mt-8 w-full">
            {categories.map((item, index) => (
              <div
                key={index}
                className="flex shadow-md cursor-pointer flex-shrink-0  items-center gap-8 bg-neutral-200 rounded-xl py-5 px-5"
              >
                <div className="flex flex-col gap-6">
                  <h1 className="text-sm font-bold text-wrap w-24">
                    {item.name}
                  </h1>
                  <Link className="text-xs font-semibold">{"SHOP NOW  >"}</Link>
                </div>
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={item.imageSrc}
                  alt=""
                />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
}

function NewArrivals({ products = [] }) {
  const sortedProducts = [...products];
  sortedProducts.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return (
    <div>
      <Subtitle label={"New Arrivals"} />
      {products.length === 0 ? (
        <div className="flex w-full h-60">
          <Spinner size="text-4xl m-auto" />
        </div>
      ) : (
        <div className="flex items-center gap-6 no-scrollbar py-3 overflow-scroll mt-8 w-full">
          {sortedProducts.slice(0, 15).map((item, index) => (
            <div className="w-[200px] flex-shrink-0 h-full">
              <div className="h-[340px]">
                <UsersProductCard
                id={item.id}
                  key={index}
                  label={item.name}
                  imageSrc={item.image_src}
                  price={`₦${item.price}`}
                  category={item.category}
                  brand={item.brand}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedProducts() {
  const { products, isProductLoading, fetchProducts, productCount } =
    useProducts();

  const [pageNo, setPageNo] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchProducts(pageNo, limit);
  }, [pageNo]);

  const maxPageNo = Math.ceil(productCount / limit);
  return (
    <section className="">
      <Subtitle label={"Featured Products"}></Subtitle>

      {isProductLoading ? (
        <div className="flex w-full h-60">
          <Spinner size="text-4xl m-auto" />
        </div>
      ) : (
        <div className="grid items-center gap-3 no-scrollbar py-3  grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] mt-8 w-full">
          {products.map((item, index) => (
            <UsersProductCard
              key={index}
              id={item.id}
              label={item.name}
              imageSrc={item.image_src}
              price={`₦${item.price}`}
              brand={item.brand}
              category={item.category}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <PageNavigator
          pageNo={pageNo}
          maxPageNo={maxPageNo}
          onPageChange={(e) => {
            setPageNo(e);
          }}
        />
      </div>
    </section>
  );
}

function MoreToLike({ products }) {
  return (
    <div>
      <Subtitle label={"More to Like"} />
      <div className="flex items-center gap-4 mt-8 overflow-scroll no-scrollbar">
        {products.slice(0, 5).map((item, index) => (
          <div className="flex-shrink-0 w-[500px]">
            <SecondaryProductCard
              key={index}
              label={item.name}
              imageSrc={item.image_src}
              price={`₦${item.price}`}
              category={item.category}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
