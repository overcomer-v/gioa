import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { useCart } from "../../hooks/databaseManager/useCarts";

import { Spinner } from "../../components/Spinners";
import { GoToCategories } from "../../components/ButtonLinks";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { Subtitle } from "../../components/Titles";
import { generalPagePadding } from "../../utils/constants";

export function ProductDetailsView() {
  const { productId } = useParams();

  const { getProductItem } = useProducts();
  const { addToCart } = useCart();

  const [productItem, setProductItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!productId) return;

    getProductItem(productId).then((result) => {
      setProductItem(result);
    });
  }, [productId]);

  if (!productItem) {
    return (
      <div className="h-[75vh] flex items-center justify-center">
        <Spinner size="text-4xl opacity-70" />
      </div>
    );
  }

  const variant = productItem.variants?.[0];

  const primaryImage =
    productItem.public_images?.find((img) => img.is_primary)?.public_url ||
    productItem.public_images?.[0]?.public_url;

  const primaryCategory = productItem.categories?.[0];

  const specifications = variant?.attributes || {};
  const stock = variant?.stock_quantity || 0;

  const outOfStock = !variant || stock <= 0;

  async function handleAddToCart() {
    if (!variant?.id || outOfStock) return;

    try {
      setIsAddingToCart(true);

      await addToCart(variant.id, quantity);
      alert("Product sdded to cart successfully");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <section className={`${generalPagePadding} w-full `}>
      <div className=" mx-auto pt-6 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-7 text-neutral-500 overflow-hidden">
          <Link
            to="/"
            className="shrink-0 hover:text-neutral-900"
          >
            Home
          </Link>

          <span>/</span>

          <GoToCategories
            id={primaryCategory?.id}
            classname="shrink-0 hover:text-neutral-900"
            text={primaryCategory?.name || "Products"}
          />

          <span>/</span>

          <span className="truncate text-neutral-900">
            {productItem.name}
          </span>
        </nav>

        {/* Product */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Image */}
          <div className="bg-neutral-50 rounded-xl overflow-hidden">
            {primaryImage ? (
              <div className="aspect-square flex items-center justify-center p-5 md:p-8">
                <img
                  src={primaryImage}
                  alt={productItem.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center text-neutral-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pt-2 md:pt-5">

            {/* Category */}
            <GoToCategories
              id={primaryCategory?.id}
              classname="text-xs text-primary font-medium hover:underline"
              text={primaryCategory?.name || "Products"}
            />

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight mt-2">
              {productItem.name}
            </h1>

            {/* Brand */}
            <p className="text-sm text-neutral-500 mt-2">
              {productItem.brands?.name || "Unknown"}
            </p>

            {/* Price */}
            <div className="mt-5 pb-5 border-b border-neutral-200">
              <p className="text-2xl font-semibold">
                ₦{Number(variant?.price || 0).toLocaleString()}
              </p>

              {variant?.compare_at_price && (
                <p className="text-sm text-neutral-400 line-through mt-1">
                  ₦
                  {Number(
                    variant.compare_at_price
                  ).toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="mt-5">
              {stock > 0 ? (
                <span className="text-sm text-green-600">
                  {stock} pieces available
                </span>
              ) : (
                <span className="text-sm text-red-500">
                  Out of stock
                </span>
              )}
            </div>

            {/* Variant */}
            {variant?.attributes?.Color && (
              <div className="mt-5">
                <p className="text-sm font-medium mb-2">
                  Color
                </p>

                <span className="inline-flex items-center gap-2 border border-neutral-300 rounded-full px-3 py-1.5 text-sm">
                  <span className="w-3.5 h-3.5 rounded-full bg-black" />
                  {variant.attributes.Color}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-medium">
                Quantity
              </span>

              <Quantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={stock}
              />
            </div>

            {/* Buttons */}
            <div className="mt-7 space-y-3">
              <button
                type="button"
                disabled={outOfStock || isAddingToCart}
                onClick={handleAddToCart}
                className="w-full h-12 rounded-full bg-primary text-white font-medium flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-50"
              >
                {isAddingToCart
                  ? "Adding..."
                  : "Add to Cart"}

                <i className="fa fa-shopping-cart text-sm" />
              </button>

              <button
                type="button"
                disabled={outOfStock}
                className="w-full h-12 rounded-full border border-neutral-300 font-medium flex items-center justify-center gap-3 hover:bg-neutral-50 transition disabled:opacity-50"
              >
                Buy Now

                <i className="fa fa-arrow-right text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Product information */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-14 pt-10 border-t border-neutral-200">

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600 max-w-xl">
              {productItem.description ||
                "No description available."}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold">
              Specifications
            </h2>

            {Object.keys(specifications).length > 0 ? (
              <div className="mt-3 border-t border-neutral-200">
                {Object.entries(specifications).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-5 py-3 border-b border-neutral-200 text-sm"
                    >
                      <span className="text-neutral-500">
                        {key}
                      </span>

                      <span className="font-medium text-right">
                        {value}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-500">
                No specifications available.
              </p>
            )}
          </div>
        </div>

        {/* More products */}
        <div className="mt-16">
          <Subtitle label="More To Explore" />

          <CategoriesItemsView
            categoryId={primaryCategory?.id}
            exclusion={[productItem.id]}
          />
        </div>
      </div>
    </section>
  );
}

function Quantity({ quantity, setQuantity, max }) {
  return (
    <div className="flex items-center border border-neutral-200 rounded-full p-1">

      <button
        type="button"
        disabled={quantity <= 1}
        onClick={() =>
          setQuantity(Math.max(1, quantity - 1))
        }
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30"
      >
        <i className="fa fa-minus text-xs" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        aria-label="Quantity"
        onChange={(event) => {
          const value = Number(
            event.target.value.replace(/[^0-9]/g, "")
          );

          if (value >= 1) {
            setQuantity(Math.min(value, max || value));
          } else {
            setQuantity(1);
          }
        }}
        className="w-9 text-center bg-transparent outline-none text-sm"
      />

      <button
        type="button"
        disabled={!max || quantity >= max}
        onClick={() =>
          setQuantity(Math.min(quantity + 1, max))
        }
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30"
      >
        <i className="fa fa-plus text-xs" />
      </button>
    </div>
  );
}
