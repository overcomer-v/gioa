import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { PageNavigator } from "../../components/PageNavigator";
import { Subtitle } from "../../components/Titles";
import { UsersProductCard } from "../../components/Cards";
import { Spinner } from "../../components/Spinners";
import { generalPagePadding } from "../../utils/constants";

export function FeaturedProducts() {
  const { products, isProductLoading, fetchProducts, productCount } =
    useProducts();

  const [pageNo, setPageNo] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchProducts(pageNo, limit);
  }, [pageNo]);

  const maxPageNo = Math.ceil(productCount / limit);
  return (
    <section className={`${generalPagePadding} mt-12 h-full`}>
      <Subtitle label={"Featured Products"}></Subtitle>

      {isProductLoading ? (
        <div className="flex w-full h-80">
          <Spinner size="text-4xl m-auto" />
        </div>
      ) : (
        <div className="grid items-center gap-3 no-scrollbar py-3  grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-8 w-full">
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

     { !isProductLoading && <div className="mt-10">
        <PageNavigator
          pageNo={pageNo}
          maxPageNo={maxPageNo}
          onPageChange={(e) => {
            setPageNo(e);
          }}
        />
      </div>}
    </section>
  );
}