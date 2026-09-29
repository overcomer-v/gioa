// src/lib/checkout.js
//
// Client-side checkout flow. Both calls use your existing supabase-js
// client, which already carries the logged-in user's session — that's
// what lets place_order use auth.uid() and initialize-payment read only
// the caller's own order.

import { supabase } from "./supabaseClient"; // your existing client

// Step 1: turn the cart into a pending order
export async function placeOrder(shipping) {
  const { data, error } = await supabase.rpc("create_order_from_cart", {
    p_shipping_name: shipping.name,
    p_shipping_phone: shipping.phone,
    p_shipping_address: shipping.address,
    p_shipping_city: shipping.city,
    p_shipping_state: shipping.state,
  });

  if (error) throw new Error(error.message);
  return data;
  // data looks like:
  // { success, order_id, order_number, subtotal, shipping_fee, total_amount, expires_at }
}

// Step 2: ask the edge function to start a Paystack transaction for that order
export async function startPayment(orderId) {
  const { data, error } = await supabase.functions.invoke("initialize-payment", {
    body: { order_id: orderId },
  });

  if (error) throw new Error(error.message);
  if (!data?.authorization_url) throw new Error("No payment URL returned");

  return data.authorization_url;
}

// Convenience wrapper for your checkout button's onClick
export async function checkoutAndPay(shipping) {
  const order = await placeOrder(shipping);
  const authUrl = await startPayment(order.order_id);
  window.location.href = authUrl; // send the customer to Paystack's checkout page
}