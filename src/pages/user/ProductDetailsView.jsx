import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Spinner } from "../../components/Spinners";
import { GoToCategories } from "../../components/ButtonLinks";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { Subtitle } from "../../components/Titles";
import { generalPagePadding } from "../../utils/constants";

export function ProductDetailsView() {
  const { productId } = useParams();
  const { getProductItem } = useProducts();
  const [productItem, setProductItem] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductItem(productId).then((re) => {
      console.log(re.specifications);
      setProductItem(re);
    });
  }, []);

  return (
    <>
      {!productItem ? (
        <div className="flex h-[80vh] w-full">
          <Spinner size="m-auto text-4xl opacity-80" />
        </div>
      ) : (
        <section className={`relative mt-6 ${generalPagePadding}bg-blue-800`}>
          <div className={`flex font-semibold`}>
            <Link to={"/"} className="mr-2 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <GoToCategories
              classname={"mx-2 hover:underline"}
              text={productItem.category}
            ></GoToCategories>{" "}
            / <div className="ml-2 text-primary ">{productItem.name}</div>
          </div>

          <div className="grid md:grid-cols-2 items-center gap-4 mt-6 md:mt-0 ">
            <div className=" ">
              <img
                className="md:w-[90%] md:max-h-96 w-full aspect-auto object-cover rounded-lg"
                src={productItem.image_src}
                alt=""
              />
            </div>
            <OrderInfo />
          </div>
          <div className="py-8">
            <div className="mt-2 mb-6 md:pr-28">
              <h3 className="font-bold text-2xl ">Description</h3>
              <p>{productItem.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-2xl mt-10 mb-3">Specifications</h3>
              {productItem &&
                Object.keys(productItem.specifications).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(productItem.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="border p-2 rounded flex gap-2 flex-wrap items-center text-nowrap text-ellipsis overflow-hidden"
                        >
                          <h2 className="font-semibold">{key}</h2>
                          <span className="opacity-80"> {value}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}
            </div>
          </div>
          <div className="">
            <Subtitle label={"More To Explore"} />
            <CategoriesItemsView
              category={productItem.category}
              exclusion={[productItem.id]}
            />
          </div>
        </section>
      )}
    </>
  );

  function OrderInfo() {
    return (
      <div className="flex flex-col md:p-10 p-3 py-10 h-fit">
        <GoToCategories
          classname={"text-primary text-sm hover:underline"}
          text={productItem.category}
        ></GoToCategories>
        <h1 className="text-4xl opacity-100  font-semibold ">
          {productItem.name}
        </h1>
        <div className="flex gap-3 items-center mb-6 opacity-70 mt-1">
          <span className="text-primary_dark">{`Brand : ${productItem.brand}`}</span>{" "}
          |<span>{`${productItem.amount_in_stock} pieces available`}</span>
        </div>
        <p className="text-3xl font-semibold border-b-2 pb-6">
          {`₦${productItem.price}`}
        </p>
        <span className="flex gap-6 items-center my-3 mt-6">
          <p className="opacity-90">Quantity :</p>
          <Quantity quantity={quantity} setQuantity={setQuantity} />
        </span>
        <span className="opacity-90">Color : Black</span>
        <div className="flex flex-nowrap items-center gap-4 [&_div]:rounded-full mt-10 ">
          <div className="md:px-10 px-8 py-4 neutral-bg border flex items-center gap-4 md:text-base text-sm">
            <button className="text-nowrap">Add to Cart</button>
            <i className="fa fa-shopping-cart"></i>
          </div>
          <div className="md:px-10 py-4 px-8 bg-primary flex items-center gap-4 text-white md:text-base text-sm">
            <button className="text-nowrap">Buy Now</button>
            <i className="fa fa-arrow-right"></i>
          </div>
        </div>
      </div>
    );
  }
}

function Quantity({ quantity, setQuantity }) {
  return (
    <div className="w-fit flex gap-1 items-center [&_button]:h-8 [&_button]:w-8 [&_button]:text-sm [&_button]:bg-neutral-200 [&_button]:rounded-full">
      <button
        className="fa fa-minus"
        onClick={() => {
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
        }}
      ></button>
      <input
        inputMode="numeric"
        className="bg-transparent w-8 text-center no-scrollbar "
        type="text"
        value={quantity}
        onChange={(v) => {
          setQuantity(Number(v.target.value.replace(/[^0-9]/g, "")));
        }}
      />
      <button
        className="fa fa-plus "
        onClick={() => {
          setQuantity(quantity + 1);
        }}
      ></button>
    </div>
  );
}
