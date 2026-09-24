import { useState } from "react";
import { supabase } from "../../supabase";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [productCount, setProductCount] = useState(0);

  const storageName = "product-images";

  // =========================================================
  // CREATE PRODUCT
  // =========================================================

  async function uploadProduct(productInfo) {
    setIsProductLoading(true);

    try {
      /*
        productInfo will eventually look something like:

        {
          name,
          slug,
          description,
          brand_id,
          base_price,
          status,
          featured,

          category_ids: [],

          variants: [
            {
              sku,
              price,
              compare_at_price,
              stock_quantity,
              attributes
            }
          ],

          images: [
            {
              file,
              alt_text,
              is_primary
            }
          ]
        }
      */

      const {
        name,
        slug,
        description,
        brand_id,
        base_price,
        status,
        featured,
        category_ids = [],
        variants = [],
        images = [],
      } = productInfo;

      // -------------------------------------------------------
      // 1. CREATE PRODUCT
      // -------------------------------------------------------

      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name,
          slug,
          description,
          brand_id: brand_id || null,
          base_price: base_price || 0,
          status: status || "active",
          featured: featured || false,
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      const productId = product.id;

      // -------------------------------------------------------
      // 2. ASSIGN CATEGORIES
      // -------------------------------------------------------

      if (category_ids.length > 0) {
        const categoryRows = category_ids.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from("product_categories")
          .insert(categoryRows);

        if (categoryError) {
          throw categoryError;
        }
      }

      // -------------------------------------------------------
      // 3. CREATE VARIANTS
      // -------------------------------------------------------

      let createdVariants = [];

      if (variants.length > 0) {
        const variantRows = variants.map((variant) => ({
          product_id: productId,
          sku: variant.sku,
          price: variant.price,
          compare_at_price: variant.compare_at_price || null,
          stock_quantity: variant.stock_quantity || 0,
          attributes: variant.attributes || {},
          is_active: variant.is_active ?? true,
        }));

        const { data, error: variantError } = await supabase
          .from("product_variants")
          .insert(variantRows)
          .select();

        if (variantError) {
          throw variantError;
        }

        createdVariants = data;
      }

      // -------------------------------------------------------
      // 4. UPLOAD IMAGES
      // -------------------------------------------------------

      if (images.length > 0) {
        const imageRows = [];

        for (let index = 0; index < images.length; index++) {
          const image = images[index];

          const extension = image.file.name.split(".").pop()?.toLowerCase();

          const filePath = `products/${productId}/${crypto.randomUUID()}.${extension}`;

          const { data: storageData, error: storageError } =
            await supabase.storage
              .from(storageName)
              .upload(filePath, image.file);

          if (storageError) {
            throw storageError;
          }

          imageRows.push({
            product_id: productId,
            variant_id: image.variant_id || null,
            image_url: storageData.path,
            alt_text: image.alt_text || name,
            sort_order: index,
            is_primary: image.is_primary ?? index === 0,
          });
        }

        const { error: imageError } = await supabase
          .from("product_images")
          .insert(imageRows);

        if (imageError) {
          throw imageError;
        }
      }

      console.log("Product created successfully:", product);

      return {
        success: true,
        product,
        variants: createdVariants,
      };
    } catch (error) {
      console.error("Product creation failed:", error);

      return {
        success: false,
        error,
      };
    } finally {
      setIsProductLoading(false);
    }
  }

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  async function fetchProducts(page = 1, limit = 15) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      setIsProductLoading(true);

      const { data, error, count } = await supabase
        .from("products")
        .select(
          `
          *,
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
          ),
          product_variants (
            id,
            sku,
            price,
            compare_at_price,
            stock_quantity,
            attributes,
            is_active
          ),
          product_categories (
            category_id,
            categories (
              id,
              name,
              slug
            )
          )
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      const formattedProducts = data.map((product) => ({
        ...product,

        images: [...(product.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            ...img,
            public_url: supabase.storage
              .from("product-images") // <-- your bucket name
              .getPublicUrl(img.image_url).data.publicUrl,
          })),

        categories: (product.product_categories || []).map(
          (item) => item.categories,
        ),

        variants: product.product_variants || [],
      }));

      setProductCount(count || 0);
      setProducts(formattedProducts);

      return formattedProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    } finally {
      setIsProductLoading(false);
    }
  }
  // =========================================================
  // FETCH CATEGORIES
  // =========================================================


 function escapePostgrestValue(value) {
  // Escapes characters that carry special meaning inside a PostgREST
  // filter string ( , ( ) % ) so search input can't break the filter
  // or smuggle in an extra `or()` condition.
  return value.replace(/[%,()]/g, (char) => `\\${char}`);
}

async function queryProducts(
  {
    search = "",
    category = "",
    brand = "",
    minPrice = "",
    maxPrice = "",
    sort = "relevance",
    page = 1,
    limit = 15,
  },
  { signal } = {},
) {
  const safePage = Math.max(1, Number(page) || 1);
  const from = (safePage - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("products")
      .select(
        `
        *,
        brands!inner (
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
        ),
        product_variants (
          id,
          sku,
          price,
          compare_at_price,
          stock_quantity,
          attributes,
          is_active
        ),
        product_categories!inner (
          category_id,
          categories!inner (
            id,
            name,
            slug
          )
        )
        `,
        { count: "exact" },
      )
      .eq("status", "active");

    // SEARCH
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      const safeSearch = escapePostgrestValue(trimmedSearch);
      query = query.or(
        `name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`,
      );
    }

    // BRAND / CATEGORY — !inner above makes these actually restrict rows
    if (brand) {
      query = query.eq("brands.slug", brand);
    }
    if (category) {
      query = query.eq("product_categories.categories.slug", category);
    }

    // PRICE RANGE
    if (minPrice) {
      query = query.gte("base_price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("base_price", Number(maxPrice));
    }

    // SORT
    if (sort === "price-asc") {
      query = query.order("base_price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("base_price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // PAGINATION
    query = query.range(from, to);

    if (signal) {
      query = query.abortSignal(signal);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const formattedProducts = data.map((product) => ({
      ...product,
      images: [...(product.product_images || [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({
          ...img,
          public_url: supabase.storage
            .from("product-images")
            .getPublicUrl(img.image_url).data.publicUrl,
        })),
      categories: (product.product_categories || []).map(
        (item) => item.categories,
      ),
      variants: product.product_variants || [],
    }));

    return {
      products: formattedProducts,
      count: count || 0,
    };
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Error querying products:", error);
    }
    throw error;
  }
}

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      const formattedCategories = data.map((category) => ({
        ...category,
        public_url: getCategoryImagePublicURL(category.image_url),
      }));

      return formattedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // =========================================================
  // FETCH BRANDS
  // =========================================================

  async function fetchBrands() {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  }

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  async function getProductItem(productId) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
            *,
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
            ),
            product_variants (
              id,
              sku,
              price,
              compare_at_price,
              stock_quantity,
              attributes,
              is_active
            ),
            product_categories (
              category_id,
              categories (
                id,
                name,
                slug
              )
            )
          `,
        )
        .eq("id", productId)
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,

        public_images: [...(data.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            ...img,
            public_url: supabase.storage
              .from("product-images") // <-- your bucket name
              .getPublicUrl(img.image_url).data.publicUrl,
          })),

        images: [...(data.product_images || [])].sort(
          (a, b) => a.sort_order - b.sort_order,
        ),

        categories: (data.product_categories || []).map(
          (item) => item.categories,
        ),

        variants: data.product_variants || [],
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  // =========================================================
  // IMAGE URL
  // =========================================================

  function getImagePublicURL(imagePath) {
    if (!imagePath) {
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(storageName).getPublicUrl(imagePath);

    return publicUrl;
  }

  function getCategoryImagePublicURL(imagePath) {
    if (!imagePath) {
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("category-images").getPublicUrl(imagePath);

    return publicUrl;
  }

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  async function updateProductInfo(productId, product) {
    const { error } = await supabase
      .from("products")
      .update(product)
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return true;
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function deleteProduct(productId) {
    try {
      setIsProductLoading(true);

      /*
        Because product_categories, product_variants and
        product_images have ON DELETE CASCADE, deleting the
        product automatically deletes their database records.
      */

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        throw error;
      }

      console.log("Product deleted successfully");

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    } finally {
      setIsProductLoading(false);
    }
  }

  // =========================================================
  // FETCH PRODUCTS BY BRAND
  // =========================================================

  async function fetchProductsByBrand(brandId, page = 1, limit = 15) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      setIsProductLoading(true);

      const { data, error, count } = await supabase
        .from("products")
        .select(
          `
            *,
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
            ),
            product_variants (
              id,
              sku,
              price,
              stock_quantity,
              attributes,
              is_active
            )
          `,
          { count: "exact" },
        )
        .eq("brand_id", brandId)
        .range(from, to);

      if (error) {
        throw error;
      }

      const formattedProducts = data.map((product) => ({
        ...product,

        images: [...(product.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            ...img,
            public_url: supabase.storage
              .from(storageName)
              .getPublicUrl(img.image_url).data.publicUrl,
          })),

        variants: product.product_variants || [],
      }));
      setProductCount(count || 0);

      return formattedProducts;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsProductLoading(false);
    }
  }

  // =========================================================
  // RETURN
  // =========================================================

  // =========================================================
  // FETCH PRODUCTS BY CATEGORY
  // =========================================================

  async function fetchProductsByCategory(categoryId, page = 1, limit = 15) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log("category ID", categoryId);

    try {
      setIsProductLoading(true);

      const { data, error, count } = await supabase
        .from("products")
        .select(
          `
          *,
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
          ),
          product_variants (
            id,
            sku,
            price,
            compare_at_price,
            stock_quantity,
            attributes,
            is_active
          ),
          product_categories!inner (
            category_id,
            categories (
              id,
              name,
              slug
            )
          )
        `,
          { count: "exact" },
        )
        .eq("product_categories.category_id", categoryId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      const formattedProducts = data.map((product) => ({
        ...product,

        images: [...(product.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            ...img,
            public_url: supabase.storage
              .from(storageName)
              .getPublicUrl(img.image_url).data.publicUrl,
          })),

        categories: (product.product_categories || []).map(
          (item) => item.categories,
        ),

        variants: product.product_variants || [],
      }));

      setProductCount(count || 0);

      return formattedProducts;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    } finally {
      setIsProductLoading(false);
    }
  }

  return {
    uploadProduct,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    queryProducts,
    fetchProductsByBrand,
    fetchProductsByCategory,
    getProductItem,
    getImagePublicURL,
    updateProductInfo,
    deleteProduct,

    isProductLoading,
    products,
    productCount,
  };
}
