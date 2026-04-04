import { useEffect, useRef, useState } from "react";
import { MainHeader } from "../../components/Header";
import { UserNavBar } from "../../components/Navbar";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Link, useNavigate } from "react-router-dom";
import { generalPagePadding } from "../../utils/constants";
import { SecondaryProductCard, UsersProductCard } from "../../components/Cards";
import { Products } from "../admin/Products";
import { PageNavigator } from "../../components/PageNavigator";
import { Spinner } from "../../components/Spinners";
import { BrandsView } from "../../components/BrandsView";
import { Subtitle } from "../../components/Titles";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";

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
      <div className={ `${generalPagePadding} flex text-sm neutral-bg overflow-scroll no-scrollbar my-2 `}>
        <div className="flex items-center py-4 gap-4 mr-8 text-[rgb(133,150,21)]">
          <span className="text-nowrap ">All Categories</span>
          <i className="fa fa-bars"></i>
        </div>
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/group-opener/category/${category.name}`}
            className="py-4 px-4 hover:bg-neutral-200 hover:text-neutral-800 text-nowrap text-[rgb(133,150,21)]"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <HeroSection></HeroSection>
      <section className={` flex flex-col md:gap-16 ${generalPagePadding}`}>
        <TopCategoriesSection categories={categories} />
        <NewArrivals products={products} />

        <CategoriesPreview />

        <MoreToLike products={products} />
      </section>
    </main>
  );

  function HeroSection() {
    return (
      <section>
        <div className="md:h-[600px] h-[300px] relative">
          <img
            className="h-full w-full object-cover absolute z-10 top-0 right-0 bottom-0 left-0"
            src="/images/pxfuel.jpg"
            alt=""
          />
          <div className="  flex absolute z-20 top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50">
            <div
              className={` my-auto md:w-[60%] w-[80%] ${generalPagePadding} flex flex-col gap-4 text-white`}
            >
              <h1 className="md:text-7xl text-2xl font-bold md:leading-loose">
                Upgrade Your World with the Latest Tech
              </h1>
              <span className="opacity-70 text-xs md:text-base">
                Discover premium electronics at prices you will love and a good
                customer satisfaction
              </span>
              {/* <button className="bg-primary w-fit px-5 py-3 text-black rounded-full">
                Shop Now
              </button> */}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function TopCategoriesSection({ categories = [] }) {
    return (
      <section className="md:mt-12 mt-6 w-full">
        <Subtitle label={"Top Categories"}></Subtitle>

        {categories.length === 0 ? (
          <div className="flex w-full h-60">
            <Spinner size="text-3xl m-auto" />
          </div>
        ) : (
          <div className="md:flex grid grid-cols-2 items-center no-scrollbar py-3 overflow-scroll gap-4 md:mt-8 mt-4 w-full">
            {categories.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row shadow-md cursor-pointer flex-shrink-0 items-center md:gap-16 gap-4 border rounded-xl md:p-5 p-3"
              >
                <div className="flex flex-col gap-6">
                  <h1 className="text-sm font-bold text-wrap w-24">
                    {item.name}
                  </h1>
                  <Link className="text-xs font-bold space-x-2 text-primary">
                  <span className="text-primary">SHOP NOW</span>
                  <i className="fa fa-arrow-right"></i></Link>
                </div>
                <img
                  className="h-24 w-24 rounded-2xl object-cover"
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
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  return (
    <div>
      <Subtitle label={"New Arrivals"} />
      {products.length === 0 ? (
        <div className="flex w-full h-60">
          <Spinner size="text-3xl m-auto" />
        </div>
      ) : (
        <div className="flex items-center gap-3 no-scrollbar py-3 pb-6 overflow-scroll md:mt-6 w-full">
          {sortedProducts.slice(0, 15).map((item, index) => (
            <div className="md:w-[220px] w-[45%] flex-shrink-0 md:h-[360px] h-[300px]">
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
          ))}
        </div>
      )}
    </div>
  );
}



 function CategoriesPreview() {
  const [categories, setCategories] = useState([]);
  const { fetchCategories } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchCategories().then((results) => {
      setCategories(results);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    <div className="flex h-[80vh] w-full">
      <Spinner size="text-5xl opacity-70 m-auto" />
    </div>
  ) : (
    <div className="">
      {/* <div className=" flex items-center gap-3 w-full neutral-bg px-16 shadow-sm">
        <i className="fa fa-bullseye text-primary"></i>
        <h1 className="text-2xl font-bold py-4 text-primary">Categories</h1>
      </div> */}
      <div className="">
        {categories &&
          categories.slice(0,5).map((category) => (
            <div className="flex flex-col gap-5 md:mb-20 mt-6">
              <Subtitle
                label={category.name}
                action={"Shop More"}
                onAction={() => {
                  navigate(`/group-opener/category/${category.name}`);
                }}
              />
              <CategoriesItemsView category={category.name} />
            </div>
          ))}
      </div>
    </div>
  );
}

function MoreToLike({ products = [] }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      if (isAtEnd) {
        // Snap back to start smoothly
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: clientWidth + 16, behavior: "smooth" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div>
      <Subtitle label={"More to Like"} />
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-center gap-4 mt-8 overflow-x-scroll no-scrollbar"
      >
        {products.slice(0, 5).map((item, index) => (
          <div key={index} className="flex-shrink-0 md:w-[500px] w-full">
            <SecondaryProductCard
              id={item.id}
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