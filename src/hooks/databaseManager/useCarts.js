import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";


export function useCart() {
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  /*
   * Get the user's existing cart or create one.
   */
  const getOrCreateCart = useCallback(async () => {
    if (!user) {
      return null;
    }

    // Try to find the user's existing cart
    const { data: existingCart, error: fetchError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (existingCart) {
      return existingCart;
    }

    // No cart exists, so create one
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({
        user_id: user.id,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newCart;
  }, [user]);

  /*
   * Fetch cart items.
   */
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartItems([]);
      return [];
    }

    try {
      setIsCartLoading(true);

      const currentCart = await getOrCreateCart();

      if (!currentCart) {
        return [];
      }

      setCart(currentCart);

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          cart_id,
          variant_id,
          quantity,
          created_at,
          updated_at,

          product_variants (
            id,
            sku,
            price,
            compare_at_price,
            stock_quantity,
            attributes,
            is_active,

            products (
              id,
              name,
              slug,
              description,
              status,
              brand_id,

              brands (
                id,
                name,
                slug
              ),

              product_images (
                id,
                image_url,
                alt_text,
                sort_order,
                is_primary
              )
            )
          )
          `
        )
        .eq("cart_id", currentCart.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedItems = (data || []).map((item) => {
        const variant = item.product_variants;
        const product = variant?.products;

        const images = [...(product?.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => ({
            ...image,
            public_url: supabase.storage
              .from("product-images")
              .getPublicUrl(image.image_url).data.publicUrl,
          }));

        return {
          id: item.id,
          cart_id: item.cart_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          created_at: item.created_at,
          updated_at: item.updated_at,

          variant: {
            ...variant,
            images,
          },

          product: {
            ...product,
            images,
          },
        };
      });

      setCartItems(formattedItems);

      return formattedItems;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  }, [user, getOrCreateCart]);

  /*
   * Add a product variant to the cart.
   *
   * If the variant already exists, increase its quantity.
   */
  const addToCart = useCallback(
    async (variantId, quantity = 1) => {
      if (!user) {
        throw new Error("You must be logged in to add items to your cart.");
      }

      if (quantity < 1) {
        throw new Error("Quantity must be at least 1.");
      }

      try {
        setIsCartLoading(true);

        const currentCart = await getOrCreateCart();

        if (!currentCart) {
          throw new Error("Unable to create cart.");
        }

        /*
         * Get the variant so we can check its current stock.
         */
        const { data: variant, error: variantError } = await supabase
          .from("product_variants")
          .select(`
            id,
            price,
            stock_quantity,
            is_active,
            products (
              id,
              status
            )
          `)
          .eq("id", variantId)
          .single();

        if (variantError) {
          throw variantError;
        }

        if (!variant.is_active || variant.products?.status !== "active") {
          throw new Error("This product is currently unavailable.");
        }

        if (variant.stock_quantity < quantity) {
          throw new Error(
            `Only ${variant.stock_quantity} item${
              variant.stock_quantity === 1 ? "" : "s"
            } available.`
          );
        }

        /*
         * Check whether the variant is already in the cart.
         */
        const { data: existingItem, error: existingError } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", currentCart.id)
          .eq("variant_id", variantId)
          .maybeSingle();

        if (existingError) {
          throw existingError;
        }

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;

          if (newQuantity > variant.stock_quantity) {
            throw new Error(
              `Only ${variant.stock_quantity} item${
                variant.stock_quantity === 1 ? "" : "s"
              } available.`
            );
          }

          const { error } = await supabase
            .from("cart_items")
            .update({
              quantity: newQuantity,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingItem.id);

          if (error) {
            throw error;
          }
        } else {
          const { error } = await supabase
            .from("cart_items")
            .insert({
              cart_id: currentCart.id,
              variant_id: variantId,
              quantity,
            });

          if (error) {
            throw error;
          }
        }

        await fetchCart();

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error adding item to cart:", error);

        return {
          success: false,
          error,
        };
      } finally {
        setIsCartLoading(false);
      }
    },
    [user, getOrCreateCart, fetchCart]
  );

  /*
   * Update an item's quantity.
   */
  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      if (quantity < 1) {
        return removeFromCart(cartItemId);
      }

      try {
        setIsCartLoading(true);

        /*
         * Find the cart item and its variant.
         * We need the variant's stock before updating.
         */
        const { data: item, error: itemError } = await supabase
          .from("cart_items")
          .select(`
            id,
            variant_id,
            product_variants (
              stock_quantity,
              is_active
            )
          `)
          .eq("id", cartItemId)
          .single();

        if (itemError) {
          throw itemError;
        }

        const stock = item.product_variants?.stock_quantity ?? 0;

        if (!item.product_variants?.is_active) {
          throw new Error("This product is no longer available.");
        }

        if (quantity > stock) {
          throw new Error(
            `Only ${stock} item${stock === 1 ? "" : "s"} available.`
          );
        }

        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cartItemId);

        if (error) {
          throw error;
        }

        await fetchCart();

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error updating cart quantity:", error);

        return {
          success: false,
          error,
        };
      } finally {
        setIsCartLoading(false);
      }
    },
    [user, fetchCart]
  );

  /*
   * Increase quantity by one.
   */
  const increaseQuantity = useCallback(
    async (cartItemId) => {
      const item = cartItems.find((item) => item.id === cartItemId);

      if (!item) {
        throw new Error("Cart item not found.");
      }

      return updateQuantity(cartItemId, item.quantity + 1);
    },
    [cartItems, updateQuantity]
  );

  /*
   * Decrease quantity by one.
   */
  const decreaseQuantity = useCallback(
    async (cartItemId) => {
      const item = cartItems.find((item) => item.id === cartItemId);

      if (!item) {
        throw new Error("Cart item not found.");
      }

      if (item.quantity === 1) {
        return removeFromCart(cartItemId);
      }

      return updateQuantity(cartItemId, item.quantity - 1);
    },
    [cartItems, updateQuantity]
  );

  /*
   * Remove an item completely.
   */
  const removeFromCart = useCallback(
    async (cartItemId) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      try {
        setIsCartLoading(true);

        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", cartItemId);

        if (error) {
          throw error;
        }

        await fetchCart();

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error removing cart item:", error);

        return {
          success: false,
          error,
        };
      } finally {
        setIsCartLoading(false);
      }
    },
    [user, fetchCart]
  );

  /*
   * Remove every item from the cart.
   */
  const clearCart = useCallback(async () => {
    if (!user || !cart) {
      return;
    }

    try {
      setIsCartLoading(true);

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);

      if (error) {
        throw error;
      }

      setCartItems([]);

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error clearing cart:", error);

      return {
        success: false,
        error,
      };
    } finally {
      setIsCartLoading(false);
    }
  }, [user, cart]);

  /*
   * Total number of individual items.
   *
   * Example:
   * Headphones x 2
   * Charger x 1
   *
   * cartCount = 3
   */
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [cartItems]);

  /*
   * Number of different products/variants.
   *
   * Example:
   * Headphones x 2
   * Charger x 1
   *
   * uniqueItemCount = 2
   */
  const uniqueItemCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  /*
   * Current cart subtotal.
   */
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.variant?.price || 0);

      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  /*
   * Automatically load the cart when the user changes.
   */
  useEffect(() => {
    if (!user) {
      setCart(null);
      setCartItems([]);
      return;
    }

    fetchCart();
  }, [user, fetchCart]);

  return {
    cart,
    cartItems,

    isCartLoading,

    cartCount,
    uniqueItemCount,
    cartTotal,

    fetchCart,
    getOrCreateCart,

    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };
}