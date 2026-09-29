import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useProducts } from "../../hooks/databaseManager/useProducts";
import { useCart } from "../../hooks/databaseManager/useCarts";

import { Spinner } from "../../components/Spinners";
import { GoToCategories } from "../../components/ButtonLinks";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { Subtitle } from "../../components/Titles";
import { generalPagePadding } from "../../utils/constants";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export function ProductDetailsView() {
  const { productId } = useParams();

  const { getProductItem } = useProducts();
  const { addToCart } = useCart();
  const {user} = useAuth();

  const [productItem, setProductItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // URLs that failed to load in the browser (404, 400, blocked, etc.).
  // Anything in here is treated as if it didn't exist.
  const [failedUrls, setFailedUrls] = useState(() => new Set());

  const markImageFailed = useCallback((url) => {
    if (!url) return;

    setFailedUrls((previous) => {
      if (previous.has(url)) return previous;

      const next = new Set(previous);
      next.add(url);
      return next;
    });
  }, []);

  /* ============================================================
     LOAD PRODUCT
  ============================================================ */

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);

        // Reset everything that belongs to the previous product
        setSelectedVariant(null);
        setSelectedImageId(null);
        setFailedUrls(new Set());

        const result = await getProductItem(productId);

        if (!active) return;

        setProductItem(result);

        const list = result?.variants || [];

        if (list.length > 0) {
          const firstAvailable =
            list.find((variant) => Number(variant.stock_quantity || 0) > 0) ||
            list[0];

          setSelectedVariant(firstAvailable);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        if (active) setProductItem(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  /* ============================================================
     RESET QUANTITY + IMAGE SELECTION WHEN VARIANT CHANGES
  ============================================================ */

  useEffect(() => {
    setQuantity(1);
    setSelectedImageId(null);
  }, [selectedVariant?.id]);

  /* ============================================================
     IMAGES

     Resolution order for the gallery:
       1. Images assigned to the selected variant (product_images.variant_id)
       2. The variant's own image_url
       3. The product's general images (no variant_id)
       4. The product's main image, whatever it is

     Any image that failed to load is skipped at every level, so a broken
     URL falls through to the next level instead of showing a blank box.
  ============================================================ */

  const sortedImages = useMemo(
    () =>
      [...(productItem?.public_images || [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    [productItem],
  );

  const { productMainImage, gallery } = useMemo(() => {
    const usable = sortedImages.filter(
      (image) => image.public_url && !failedUrls.has(image.public_url),
    );

    const general = usable.filter((image) => !image.variant_id);

    // Prefer general images for the product's main image. If the product
    // only has variant-specific images, use whatever is usable.
    const pool = general.length > 0 ? general : usable;

    const mainImage = pool.find((image) => image.is_primary) || pool[0] || null;

    let images = [];

    if (selectedVariant) {
      images = usable.filter((image) => image.variant_id === selectedVariant.id);

      if (
        images.length === 0 &&
        selectedVariant.image_url &&
        !failedUrls.has(selectedVariant.image_url)
      ) {
        images = [
          {
            id: `variant-${selectedVariant.id}`,
            public_url: selectedVariant.image_url,
            alt_text: null,
            is_primary: true,
          },
        ];
      }
    }

    if (images.length === 0) {
      images = general.length > 0 ? general : mainImage ? [mainImage] : [];
    }

    return { productMainImage: mainImage, gallery: images };
  }, [sortedImages, failedUrls, selectedVariant]);

  // Derived, not stored: if the stored ID isn't in the current gallery
  // (variant changed, image failed), fall back to primary, then first.
  const selectedImage =
    gallery.find((image) => image.id === selectedImageId) ||
    gallery.find((image) => image.is_primary) ||
    gallery[0] ||
    null;

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <Spinner size="text-4xl opacity-70" />
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!productItem) {
    return (
      <section
        className={`${generalPagePadding} min-h-[70vh] flex items-center justify-center`}
      >
        <div className="text-center">
          <i className="fa fa-exclamation-circle text-4xl text-neutral-300" />

          <h1 className="text-xl font-semibold mt-4">Product not found</h1>

          <p className="text-sm text-neutral-500 mt-2">
            This product could not be found.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium"
          >
            <i className="fa fa-arrow-left" />
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  /* ============================================================
     PRODUCT DATA
  ============================================================ */

  const variants = productItem.variants || [];

  const primaryCategory = productItem.categories?.[0];

  const stock = Number(selectedVariant?.stock_quantity || 0);

  const isOutOfStock = !selectedVariant || stock <= 0;

  const specifications = selectedVariant?.attributes || {};

  // Products without variants fall back to the product's base price
  const displayPrice = Number(
    selectedVariant?.price ?? productItem.base_price ?? 0,
  );

  const hasThumbnails = gallery.length > 1;

  /* ============================================================
     ADD TO CART
  ============================================================ */

  async function handleAddToCart() {
  if (!user) {
    toast.error("Sign in required", {
      description: "Please sign in to add products to your cart.",
      action: {
        label: "Sign In",
        onClick: () => navigate("/login"),
      },
    });

    return;
  }

  if (!selectedVariant?.id || isOutOfStock || isAddingToCart) {
    return;
  }

  try {
    setIsAddingToCart(true);

    await addToCart(selectedVariant.id, quantity);

    toast.success("Added to cart", {
      description: `${productItem.name} has been added to your cart.`,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  } catch (error) {
    console.error("Failed to add product to cart:", error);

    toast.error("Failed to add to cart", {
      description: "Something went wrong. Please try again.",
    });
  } finally {
    setIsAddingToCart(false);
  }
}
  return (
    <section className={`${generalPagePadding} w-full`}>
      <div className="max-w-7xl mx-auto pt-5 pb-20">
        {/* ======================================================
            BREADCRUMB
        ======================================================= */}

        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 overflow-hidden">
          <Link to="/" className="shrink-0 hover:text-neutral-900 transition">
            Home
          </Link>

          <span>/</span>

          <GoToCategories
            id={primaryCategory?.id}
            classname="shrink-0 hover:text-neutral-900 transition"
            text={primaryCategory?.name || "Products"}
          />

          <span>/</span>

          <span className="truncate text-neutral-900">{productItem.name}</span>
        </nav>

        {/* ======================================================
            MAIN PRODUCT
        ======================================================= */}

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-start">
          {/* ====================================================
              IMAGE GALLERY
          ===================================================== */}

          <div className="lg:sticky lg:top-6 min-w-0">
            <div
              className={`grid gap-4 ${
                hasThumbnails ? "md:grid-cols-[72px_1fr]" : ""
              }`}
            >
              {/* Thumbnails: below the image on mobile, left column on md+ */}

              {hasThumbnails && (
                <div className="order-2 md:order-1 flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
                  {gallery.map((image) => {
                    const active = selectedImage?.id === image.id;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setSelectedImageId(image.id)}
                        aria-label="Show image"
                        aria-pressed={active}
                        className={`
                          shrink-0
                          w-[72px]
                          h-[72px]
                          rounded-lg
                          border
                          overflow-hidden
                          bg-neutral-50
                          flex
                          items-center
                          justify-center
                          transition
                          ${
                            active
                              ? "border-black ring-1 ring-black"
                              : "border-neutral-200 hover:border-neutral-400"
                          }
                        `}
                      >
                        <img
                          src={image.public_url}
                          alt=""
                          onError={() => markImageFailed(image.public_url)}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main image */}

              <div className="order-1 md:order-2 relative w-full min-w-0 aspect-square rounded-2xl overflow-hidden bg-white p-4 md:p-6">
                {selectedImage?.public_url ? (
                  <img
                    key={selectedImage.id}
                    src={selectedImage.public_url}
                    alt={selectedImage.alt_text || productItem.name}
                    onError={() => markImageFailed(selectedImage.public_url)}
                    className="absolute inset-0 w-full h-full object-contain "
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                    <i className="fa fa-image text-4xl opacity-40" />

                    <p className="text-sm mt-3">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ====================================================
              PRODUCT INFORMATION
          ===================================================== */}

          <div className="min-w-0">
            {/* Category + brand */}

            <div className="flex items-center gap-2 text-sm mb-3">
              <GoToCategories
                id={primaryCategory?.id}
                classname="text-primary font-medium hover:underline"
                text={primaryCategory?.name || "Products"}
              />

              {productItem.brands?.name && (
                <>
                  <span className="text-neutral-300">•</span>

                  <span className="text-neutral-500">
                    {productItem.brands.name}
                  </span>
                </>
              )}
            </div>

            {/* Name */}

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
              {productItem.name}
            </h1>

            {/* Product description */}

            {productItem.description && (
              <p className="mt-4 text-sm leading-6 text-neutral-500 max-w-xl">
                {productItem.description}
              </p>
            )}

            {/* Price */}

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">
                  ₦{displayPrice.toLocaleString()}
                </span>

                {selectedVariant?.compare_at_price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₦{Number(selectedVariant.compare_at_price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock */}

              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${stock > 0 ? "bg-green-500" : "bg-red-500"}
                  `}
                />

                <span
                  className={`
                    text-sm
                    ${stock > 0 ? "text-green-600" : "text-red-500"}
                  `}
                >
                  {stock > 0 ? `${stock} pieces available` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* ==================================================
                VARIANTS
            =================================================== */}

            {variants.length > 1 && (
              <VariantCards
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
                fallbackImageUrl={productMainImage?.public_url}
                onImageFailed={markImageFailed}
                failedUrls={failedUrls}
              />
            )}

            {/* ==================================================
                SELECTED VARIANT SUMMARY
            =================================================== */}

            {selectedVariant && (
              <div className="mt-6 border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">
                        Selected variant
                      </p>

                      <p className="text-sm font-medium mt-0.5">
                        {getVariantLabel(selectedVariant)}
                      </p>
                    </div>

                    {selectedVariant.sku && (
                      <span className="text-xs text-neutral-400">
                        SKU: {selectedVariant.sku}
                      </span>
                    )}
                  </div>
                </div>

                {Object.keys(specifications).length > 0 && (
                  <div className="divide-y divide-neutral-100">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-5 px-4 py-2.5 text-sm"
                      >
                        <span className="text-neutral-500 capitalize">
                          {formatAttributeName(key)}
                        </span>

                        <span className="font-medium text-right">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                PURCHASE
            =================================================== */}

            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Quantity</span>

                {stock > 0 && (
                  <span className="text-xs text-neutral-400">
                    Maximum {stock}
                  </span>
                )}
              </div>

              <Quantity
                quantity={quantity}
                setQuantity={setQuantity}
                max={stock}
              />

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mt-4">
                <button
                  type="button"
                  disabled={isOutOfStock || isAddingToCart}
                  onClick={handleAddToCart}
                  className="h-12 rounded-full bg-primary text-white font-medium flex items-center justify-center gap-3 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="fa fa-shopping-cart text-sm" />

                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>

                {/* <button
                  type="button"
                  disabled={isOutOfStock}
                  className="h-12 px-7 rounded-full border border-neutral-300 font-medium flex items-center justify-center gap-2 hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Buy Now
                  <i className="fa fa-arrow-right text-sm" />
                </button> */}
              </div>
            </div>

            {/* Benefits */}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="border border-neutral-200 rounded-xl p-4">
                <i className="fa fa-shield text-primary" />

                <p className="text-xs font-medium mt-2">Secure purchase</p>

                <p className="text-[11px] text-neutral-500 mt-1">
                  Safe and protected checkout
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-4">
                <i className="fa fa-truck text-primary" />

                <p className="text-xs font-medium mt-2">Delivery available</p>

                <p className="text-[11px] text-neutral-500 mt-1">
                  Delivered to your location
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            DESCRIPTION
        ======================================================= */}

        <div className="mt-20 pt-12 border-t border-neutral-200">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
              Product details
            </p>

            <h2 className="text-2xl font-semibold mt-2">About this product</h2>

            <p className="mt-5 text-sm leading-7 text-neutral-600">
              {productItem.description || "No description available."}
            </p>
          </div>
        </div>

        {/* ======================================================
            MORE PRODUCTS
        ======================================================= */}

        <div className="mt-20">
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

/* ================================================================
   VARIANT CARDS
================================================================ */

function VariantCards({
  variants,
  selectedVariant,
  onSelect,
  fallbackImageUrl,
  onImageFailed,
  failedUrls,
}) {
  return (
    <div className="mt-7">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold">Choose a variant</h2>

          <p className="text-xs text-neutral-500 mt-1">
            Select the version you want
          </p>
        </div>

        <span className="text-xs text-neutral-400">
          {variants.length} options
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variants.map((variant) => {
          const selected = selectedVariant?.id === variant.id;

          const stock = Number(variant.stock_quantity || 0);

          const outOfStock = stock <= 0;

          // Variant image first, product main image if it's missing or broken
          const ownImage =
            variant.image_url && !failedUrls.has(variant.image_url)
              ? variant.image_url
              : null;

          const cardImage =
            ownImage ||
            (fallbackImageUrl && !failedUrls.has(fallbackImageUrl)
              ? fallbackImageUrl
              : null);

          const label = getVariantLabel(variant) || variant.sku || "Default";

          return (
            <button
              key={variant.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(variant)}
              className={`
                text-left
                rounded-xl
                overflow-hidden
                border
                bg-white
                transition-all
                relative
                ${
                  selected
                    ? "border-black ring-1 ring-black"
                    : "border-neutral-200 hover:border-neutral-400"
                }
                ${
                  outOfStock
                    ? "opacity-45 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {selected && (
                <span className="absolute z-10 top-2 right-2 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                  <i className="fa fa-check text-[10px]" />
                </span>
              )}

              <div className="aspect-square bg-neutral-50 flex items-center justify-center p-3">
                {cardImage ? (
                  <img
                    key={cardImage}
                    src={cardImage}
                    alt={label}
                    onError={() => onImageFailed(cardImage)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className="fa fa-image text-2xl text-neutral-300" />
                )}
              </div>

              <div className="p-3">
                <p className="text-sm font-medium leading-snug">{label}</p>

                <p className="text-sm font-semibold mt-2">
                  ₦{Number(variant.price || 0).toLocaleString()}
                </p>

                <p
                  className={`
                    text-[11px] mt-1
                    ${stock > 0 ? "text-green-600" : "text-red-500"}
                  `}
                >
                  {stock > 0 ? `${stock} available` : "Out of stock"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   VARIANT LABEL
================================================================ */

function getVariantLabel(variant) {
  if (!variant) {
    return "";
  }

  const attributes = variant.attributes || {};

  return Object.entries(attributes)
    .map(([key, value]) => `${formatAttributeName(key)}: ${value}`)
    .join(" • ");
}

function formatAttributeName(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ================================================================
   QUANTITY
================================================================ */

function Quantity({ quantity, setQuantity, max }) {
  const stock = Number(max || 0);

  const disabled = stock <= 0;

  function updateQuantity(value) {
    if (disabled) {
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    setQuantity(Math.min(Math.max(1, numericValue), stock));
  }

  return (
    <div className="inline-flex items-center border border-neutral-300 rounded-full p-1">
      <button
        type="button"
        disabled={disabled || quantity <= 1}
        onClick={() => updateQuantity(quantity - 1)}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 transition"
        aria-label="Decrease quantity"
      >
        <i className="fa fa-minus text-xs" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        disabled={disabled}
        aria-label="Quantity"
        onChange={(event) => {
          const value = event.target.value.replace(/[^0-9]/g, "");

          if (!value) {
            setQuantity(1);
            return;
          }

          updateQuantity(Number(value));
        }}
        className="w-10 text-center bg-transparent outline-none text-sm disabled:opacity-40"
      />

      <button
        type="button"
        disabled={disabled || quantity >= stock}
        onClick={() => updateQuantity(quantity + 1)}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 disabled:opacity-30 transition"
        aria-label="Increase quantity"
      >
        <i className="fa fa-plus text-xs" />
      </button>
    </div>
  );
}