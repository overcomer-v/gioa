import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { generalPagePadding } from "../../utils/constants";

function formatAmount(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount ?? 0);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-gray-100 text-gray-600",
  };

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (active) {
            setOrders([]);
            setError("You need to be logged in to view your orders.");
          }
          return;
        }

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, order_number, status, payment_status, total_amount, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (active) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);

        if (active) {
          setError("Unable to load your orders. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-2xl font-semibold text-gray-900">
            My Orders
          </h1>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 h-5 w-40 rounded bg-gray-200" />
                <div className="mb-2 h-4 w-64 rounded bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-2xl font-semibold text-gray-900">
            My Orders
          </h1>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className={`${generalPagePadding} mx-auto`}>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your orders and track their status.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <i className="fa fa-shopping-bag text-xl" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              You haven't placed any orders yet. Browse our products and find
              something you like.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h2>

                      <StatusBadge status={order.status} />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-8 sm:justify-end">
                    <div>
                      <p className="text-xs text-gray-500">
                        Payment
                      </p>

                      <div className="mt-1">
                        <StatusBadge
                          status={
                            order.payment_status === "paid"
                              ? "paid"
                              : "unpaid"
                          }
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Total
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatAmount(order.total_amount)}
                      </p>
                    </div>

                    <i className="fa fa-chevron-right text-sm text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
