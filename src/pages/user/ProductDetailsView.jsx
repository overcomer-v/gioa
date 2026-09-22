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

  const [productItem, setProductItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    getProductItem(productId).then((result) => {
      console.log(result);
      setProductItem(result);
    });
  }, [productId]);

  if (!productItem) {
    return (
      <div className="flex h-[80vh] w-full">
        <Spinner size="m-auto text-4xl opacity-80" />
      </div>
    );
  }

  const variant = productItem.variants?.[0];

  const primaryImage =
    productItem.images?.find((image) => image.is_primary)?.image_url ||
    productItem.images?.[0]?.image_url;

  const primaryCategory = productItem.categories?.[0];

  const specifications = variant?.attributes || {};

  return (
    <section className={`relative mt-6 ${generalPagePadding}`}>
      {/* Breadcrumb */}
      <div className="flex font-semibold">
        <Link to="/" className="mr-2 hover:underline">
          Home
        </Link>

        /

        <GoToCategories
          classname="mx-2 hover:underline"
          text={primaryCategory?.name || "Products"}
        />

        /

        <div className="ml-2 text-primary">
          {productItem.name}
        </div>
      </div>

      {/* Main product section */}
      <div className="grid md:grid-cols-2 items-center gap-4 mt-6 md:mt-0">
        <div>
          {primaryImage ? (
            <img
              className="md:w-[90%] md:max-h-96 w-full aspect-auto object-cover rounded-lg"
              src={productItem?.public_images[0]?.public_url}
              alt={productItem.name}
            />
          ) : (
            <div className="md:w-[90%] aspect-square rounded-lg bg-neutral-100 flex items-center justify-center">
              <span className="opacity-50">No image available</span>
            </div>
          )}
        </div>

        <OrderInfo />
      </div>

      {/* Description + Specifications */}
      <div className="py-8">
        <div className="mt-2 mb-6 md:pr-28">
          <h3 className="font-bold text-2xl">
            Description
          </h3>

          <p>{productItem.description}</p>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="font-bold text-2xl mt-10 mb-3">
            Specifications
          </h3>

          {Object.keys(specifications).length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="border p-2 rounded flex gap-2 flex-wrap items-center text-nowrap text-ellipsis overflow-hidden"
                >
                  <h2 className="font-semibold">
                    {key}
                  </h2>

                  <span className="opacity-80">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-60">
              No specifications available.
            </p>
          )}
        </div>
      </div>

      {/* More products */}
      <div>
        <Subtitle label="More To Explore" />

        <CategoriesItemsView
          categoryId={primaryCategory?.id}
          exclusion={[productItem.id]}
        />
      </div>
    </section>
  );

  function OrderInfo() {
    return (
      <div className="flex flex-col md:p-10 p-3 py-10 h-fit">
        <GoToCategories
          classname="text-primary text-sm hover:underline"
          text={primaryCategory?.name || "Products"}
        />

        <h1 className="text-4xl opacity-100 font-semibold">
          {productItem.name}
        </h1>

        <div className="flex gap-3 items-center mb-6 opacity-70 mt-1">
          <span className="text-primary_dark">
            Brand: {productItem.brand?.name || "Unknown"}
          </span>

          |

          <span>
            {variant?.stock_quantity || 0} pieces available
          </span>
        </div>

        <p className="text-3xl font-semibold border-b-2 pb-6">
          ₦{Number(variant?.price || 0).toLocaleString()}
        </p>

        <span className="flex gap-6 items-center my-3 mt-6">
          <p className="opacity-90">
            Quantity:
          </p>

          <Quantity
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </span>

        {/* Temporary variant display */}
        {variant?.attributes?.Color && (
          <span className="opacity-90">
            Color: {variant.attributes.Color}
          </span>
        )}

        <div className="flex flex-nowrap items-center gap-4 [&_div]:rounded-full mt-10">
          <div className="md:px-10 px-8 py-4 neutral-bg border flex items-center gap-4 md:text-base text-sm">
            <button className="text-nowrap">
              Add to Cart
            </button>

            <i className="fa fa-shopping-cart"></i>
          </div>

          <div className="md:px-10 py-4 px-8 bg-primary flex items-center gap-4 text-white md:text-base text-sm">
            <button className="text-nowrap">
              Buy Now
            </button>

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
        className="bg-transparent w-8 text-center no-scrollbar"
        type="text"
        value={quantity}
        onChange={(event) => {
          const value = Number(
            event.target.value.replace(/[^0-9]/g, "")
          );

          setQuantity(value);
        }}
      />

      <button
        className="fa fa-plus"
        onClick={() => {
          setQuantity(quantity + 1);
        }}
      ></button>
    </div>
  );
}