import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";

import { supabase } from "../../supabase";
import { useCart } from "../../hooks/databaseManager/useCarts";
import { generalPagePadding } from "../../utils/constants";


function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}


function getVariantDescription(attributes) {
  if (!attributes || typeof attributes !== "object") {
    return "";
  }

  return Object.entries(attributes)
    .map(([key, value]) => {
      const formattedKey =
        key.charAt(0).toUpperCase() + key.slice(1);

      return `${formattedKey}: ${value}`;
    })
    .join(" · ");
}


export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    isCartLoading,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderResult, setOrderResult] = useState(null);


  const shippingFee = 0;
  const total = cartTotal + shippingFee;


  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      setErrorMessage(
        "Please complete all delivery information."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase.rpc(
        "create_order_from_cart",
        {
          p_shipping_name: form.name,
          p_shipping_phone: form.phone,
          p_shipping_address: form.address,
          p_shipping_city: form.city,
          p_shipping_state: form.state,
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(
          "We could not complete your order."
        );
      }

      setOrderResult(data);

    } catch (error) {
      console.error("Checkout error:", error);

      setErrorMessage(
        error?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  if (orderResult) {
    return (
      <main className="min-h-[90vh] bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2
                size={34}
                className="text-green-600"
              />
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-600">
              Order placed
            </p>

            <h1 className="text-2xl font-semibold text-neutral-900">
              Thank you for your order
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Your order has been received. This is a demo
              checkout, so no payment has been taken.
            </p>

            <div className="mt-7 rounded-xl bg-neutral-50 p-5">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Order number
              </p>

              <p className="mt-1 text-lg font-semibold text-neutral-900">
                {orderResult.order_number}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
                <span className="text-neutral-500">
                  Total
                </span>

                <span className="font-semibold text-neutral-900">
                  {formatCurrency(
                    Number(orderResult.total_amount)
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Continue shopping
              </button>

              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="flex-1 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Browse products
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }


  if (isCartLoading && cartItems.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <span>Loading checkout...</span>
        </div>
      </main>
    );
  }


  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <ShoppingBag
              size={30}
              className="text-neutral-400"
            />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Add some products before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-6 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Continue shopping
          </button>

        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 md:px-8 lg:px-12">

      <div className={`${generalPagePadding}`}>

        {/* Back */}
        {/* <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-8 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          Back to cart
        </button> */}


        <div className="mb-8">
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-xl text-sm text-neutral-500">
            Complete your delivery information and review
            your order before placing it.
          </p>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">

            {/* LEFT */}
            <div className="space-y-6">

              {/* Delivery information */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      Delivery information
                    </h2>

                    <p className="text-sm text-neutral-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>


                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-neutral-800"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />

                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </div>
                  </div>


                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-neutral-800"
                    >
                      Phone number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      />

                      <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0801 234 5678"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </div>
                  </div>


                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-neutral-800"
                    >
                      Delivery address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House number, street name, area..."
                      autoComplete="street-address"
                      className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                    />
                  </div>


                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-neutral-800"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Lagos"
                      autoComplete="address-level2"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                    />
                  </div>


                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-neutral-800"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Lagos State"
                      autoComplete="address-level1"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                    />
                  </div>

                </div>
              </section>


              {/* Demo payment information */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    <CreditCard size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      Payment
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      Payment integration hasn't been added yet.
                      This checkout will create a demo order
                      without charging you.
                    </p>

                    <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                      <span className="font-medium">
                        Payment status:
                      </span>{" "}
                      Unpaid
                    </div>
                  </div>

                </div>
              </section>


              {/* Error */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

            </div>


            {/* RIGHT - ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-6 lg:self-start">

              <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">

                <div className="border-b border-neutral-200 p-5">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                      <Package size={19} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-neutral-900">
                        Your order
                      </h2>

                      <p className="text-sm text-neutral-500">
                        {cartItems.length}{" "}
                        {cartItems.length === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>

                  </div>
                </div>


                {/* Items */}
                <div className="divide-y divide-neutral-100">

                  {cartItems.map((item) => {

                    const image =
                      item.product?.images?.[0];

                    const variantDescription =
                      getVariantDescription(
                        item.variant?.attributes
                      );

                    const itemSubtotal =
                      Number(item.variant?.price || 0) *
                      item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-5"
                      >

                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">

                          {image?.public_url ? (
                            <img
                              src={image.public_url}
                              alt={
                                image.alt_text ||
                                item.product?.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-neutral-400">
                              <ShoppingBag size={22} />
                            </div>
                          )}

                        </div>


                        {/* Details */}
                        <div className="min-w-0 flex-1">

                          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
                            {item.product?.name}
                          </h3>

                          {variantDescription && (
                            <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                              {variantDescription}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-neutral-500">
                            Qty: {item.quantity}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-neutral-900">
                            {formatCurrency(itemSubtotal)}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>


                {/* Totals */}
                <div className="border-t border-neutral-200 p-5">

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-neutral-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-neutral-900">
                        {formatCurrency(cartTotal)}
                      </span>
                    </div>


                    <div className="flex justify-between">
                      <span className="text-neutral-500">
                        Delivery
                      </span>

                      <span className="font-medium text-neutral-900">
                        {shippingFee === 0
                          ? "Free"
                          : formatCurrency(shippingFee)}
                      </span>
                    </div>

                  </div>


                  <div className="mt-5 flex items-end justify-between border-t border-neutral-200 pt-5">

                    <div>
                      <p className="text-sm text-neutral-500">
                        Total
                      </p>

                      <p className="text-xs text-neutral-400">
                        Including delivery
                      </p>
                    </div>

                    <p className="text-2xl font-semibold tracking-tight text-neutral-900">
                      {formatCurrency(total)}
                    </p>

                  </div>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Placing order...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={17} />
                        Place order
                      </>
                    )}
                  </button>


                  <p className="mt-3 text-center text-xs leading-5 text-neutral-400">
                    This is a demo checkout. You won't be
                    charged for this order.
                  </p>

                </div>

              </section>

            </aside>

          </div>

        </form>

      </div>

    </main>
  );
}