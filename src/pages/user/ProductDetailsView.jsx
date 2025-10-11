import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Spinner } from "../../components/Spinners";
import { GoToCategories } from "../../components/ButtonLinks";
import { generalPagePadding } from "../../utils/constants";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { Subtitle } from "../../components/Titles";

export function ProductDetailsView() {
  const { productId } = useParams();
  const { getProductItem } = useProducts();
  const [productItem, setProductItem] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductItem(productId).then((re) => {
      console.log(re);
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
        <section className="">
           <div className={`w-full neutral-bg ${generalPagePadding}`}>
        <h1 className="text-2xl text-primary font-bold py-4">{productItem.name}</h1>
      </div>
      <div className="px-16 py-12 grid grid-cols-2 gap-4">
          <div className="p-16">
            <img
              className="w-[70%] h-[350px] object-cover"
              src={productItem.image_src}
              alt=""
            />
            <div>
              <h3 className="font-bold text-lg mt-6">Description</h3>
              <p>{productItem.description}</p>
            </div>
          </div>
          <OrderInfo />
          </div>
          <div className="px-16">
            <Subtitle label={"More To Explore"}/>
            <CategoriesItemsView category={productItem.category}/>

          </div>
        </section>
      )}
    </>
  );

  function OrderInfo() {
    return (
      <div className="flex flex-col bg-neutral-100 p-16 h-fit border-2">
        <GoToCategories
          classname={"text-primary text-sm"}
          text={productItem.category}
        ></GoToCategories>
        <h1 className="text-4xl opacity-80 mb-6 border-b-2 pb-6">
          {productItem.name}
        </h1>
       
        <span className="flex gap-6 items-center my-3">
          <p className="opacity-60">Quantity :</p>
          <Quantity quantity={quantity} setQuantity={setQuantity} />
        </span>
        <p className="text-xl font-semibold">
          <span className="text-base font-normal opacity-60 mr-4">Price :</span>
          {`₦${productItem.price}`}
        </p>
        <div className="flex items-center gap-4 [&_button]:rounded-md mt-16 ">
          <div className="px-10 py-4 bg-primary flex items-center gap-4">
            <button className="">Buy Now</button>
            <i className="fa fa-shopping-cart"></i>
          </div>
          <div className="px-10 py-4 neutral-bg flex items-center gap-4">
            <button className="">Buy Now</button>
            <i className="fa fa-arrow-right"></i>
          </div>
        </div>
      </div>
    );
  }
}

function Quantity({ quantity, setQuantity }) {
  return (
    <div className="rounded-md border-2 w-fit flex gap-1 items-center [&_button]:p-3">
      <button
        className="fa fa-minus border-r-2"
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
        className="fa fa-plus border-l-2"
        onClick={() => {
          setQuantity(quantity + 1);
        }}
      ></button>
    </div>
  );
}
