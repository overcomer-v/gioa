import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../hooks/databaseManager/useCarts";

export default function Cart() {
  const { user, isAuthloading } = useAuth();

  /*
   * useCart already knows how to fetch the user's cart.
   * It will simply remain empty while there is no user.
   */
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartLoading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  /*
   * Auth is still being determined.
   * Don't show "please sign in" yet because we don't know
   * whether the user is actually logged in.
   */
  if (isAuthloading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <i className="fa fa-spinner fa-spin" />
          <span>Loading...</span>
        </div>
      </main>
    );
  }

  /*
   * Auth has finished and there is no user.
   */
  if (!user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-primary">
            <i className="fa fa-shopping-cart text-xl" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-primary">
            Your cart is waiting
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Please sign in to view your cart and manage the products
            you've added.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="rounded-lg border border-neutral-300 px-5 py-3 text-sm font-medium text-primary transition hover:bg-neutral-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Authenticated user, but cart is loading.
   */
  if (isCartLoading && cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <i className="fa fa-spinner fa-spin" />
          <span>Loading your cart...</span>
        </div>
      </main>
    );
  }

  /*
   * Empty cart.
   */
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] px-6 py-12">
        <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-primary">
            <i className="fa fa-shopping-cart text-2xl" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-primary">
            Your cart is empty
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
            You haven't added anything to your cart yet.
          </p>

          <Link
            to="/shop"
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            Shopping cart
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <h1 className="text-2xl font-bold text-primary md:text-3xl">
              Your Cart
            </h1>

            <span className="text-sm text-neutral-500">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart items */}
          <section className="min-w-0">
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {cartItems.map((item) => {
                const product = item.product;
                const variant = item.variant;

                const primaryImage =
                  product?.images?.find((image) => image.is_primary) ||
                  product?.images?.[0];

                const imageUrl = primaryImage?.public_url;

                const price = Number(variant?.price || 0);
                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5 sm:gap-6"
                  >
                    {/* Product image */}
                    <Link
                      to={`/products/${product?.slug}`}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-28"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={primaryImage?.alt_text || product?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <i className="fa fa-image" />
                        </div>
                      )}
                    </Link>

                    {/* Product information */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${product?.slug}`}
                            className="line-clamp-2 text-sm font-semibold text-primary hover:underline sm:text-base"
                          >
                            {product?.name}
                          </Link>

                          {product?.brands?.name && (
                            <p className="mt-1 text-xs text-neutral-500">
                              {product.brands.name}
                            </p>
                          )}

                          {variant?.sku && (
                            <p className="mt-1 text-[11px] text-neutral-400">
                              SKU: {variant.sku}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-primary sm:text-base">
                          ₦{itemTotal.toLocaleString()}
                        </p>
                      </div>

                      {/* Variant attributes */}
                      {variant?.attributes &&
                        Object.keys(variant.attributes).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {Object.entries(variant.attributes).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="text-xs text-neutral-500"
                                >
                                  <span className="capitalize">
                                    {key}
                                  </span>
                                  : {String(value)}
                                </span>
                              ),
                            )}
                          </div>
                        )}

                      <div className="mt-auto flex items-center justify-between pt-4">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-neutral-200">
                          <button
                            type="button"
                            disabled={isCartLoading}
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <i className="fa fa-minus text-[10px]" />
                          </button>

                          <span className="flex h-9 min-w-9 items-center justify-center border-x border-neutral-200 px-2 text-sm font-medium text-primary">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isCartLoading}
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <i className="fa fa-plus text-[10px]" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          disabled={isCartLoading}
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-medium text-red-500 transition hover:text-red-700 disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <i className="fa fa-arrow-left text-xs" />
              Continue shopping
            </Link>
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-2xl border border-neutral-200 p-5 md:p-6">
              <h2 className="text-lg font-semibold text-primary">
                Order summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-neutral-500">
                  <span>
                    Subtotal ({cartCount}{" "}
                    {cartCount === 1 ? "item" : "items"})
                  </span>

                  <span className="font-medium text-primary">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-neutral-500">
                  <span>Delivery</span>
                  <span className="text-xs">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-neutral-200" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">
                  Total
                </span>

                <span className="text-xl font-bold text-primary">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Proceed to checkout
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-neutral-400">
                Delivery fees and final order details will be
                confirmed at checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}