import { useEffect, useRef, useState } from "react";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Link } from "react-router-dom";

export function ProductEditor() {
  const imageInput = useRef();

  const {
    uploadProduct,
    isProductLoading,
    fetchCategories,
    fetchBrands,
  } = useProducts();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [openSDialog, setOpenSDialog] = useState(false);
  const [productImage, setProductImage] = useState(null);

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    brand_id: "",
    category_ids: [],
    base_price: "",
    sku: "",
    price: "",
    compare_at_price: "",
    stock_quantity: "",
    specifications: {},
  });

  const [newSpec, setNewSpec] = useState({
    component: "",
    specifications: "",
  });

  // ---------------------------------------------------------
  // FETCH BRANDS AND CATEGORIES
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadOptions() {
      try {
        const [categoryData, brandData] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
        ]);

        setCategories(categoryData || []);
        setBrands(brandData || []);
      } catch (error) {
        console.error("Failed to load product options:", error);
      }
    }

    loadOptions();
  }, []);

  // ---------------------------------------------------------
  // BODY SCROLL
  // ---------------------------------------------------------

  useEffect(() => {
    if (openSDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openSDialog]);

  // ---------------------------------------------------------
  // IMAGE
  // ---------------------------------------------------------

  function getImagePreview() {
    if (!productImage) return null;

    return URL.createObjectURL(productImage);
  }

  // ---------------------------------------------------------
  // CATEGORY
  // ---------------------------------------------------------

  function toggleCategory(categoryId) {
    setProductInfo((prev) => {
      const exists = prev.category_ids.includes(categoryId);

      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter((id) => id !== categoryId)
          : [...prev.category_ids, categoryId],
      };
    });
  }

  // ---------------------------------------------------------
  // SPECIFICATIONS
  // ---------------------------------------------------------

  function addSpecification(e) {
    e.preventDefault();

    if (!newSpec.component.trim() || !newSpec.specifications.trim()) {
      return;
    }

    setProductInfo((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpec.component.trim()]:
          newSpec.specifications.trim(),
      },
    }));

    setNewSpec({
      component: "",
      specifications: "",
    });
  }

  function removeSpecification(key) {
    setProductInfo((prev) => {
      const updated = { ...prev.specifications };

      delete updated[key];

      return {
        ...prev,
        specifications: updated,
      };
    });
  }

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (!productInfo.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!productInfo.brand_id) {
      alert("Please select a brand.");
      return;
    }

    if (productInfo.category_ids.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    if (!productInfo.sku.trim()) {
      alert("Please enter a SKU.");
      return;
    }

    if (!productInfo.price) {
      alert("Please enter a product price.");
      return;
    }

    if (!productImage) {
      alert("Please select a product image.");
      return;
    }

    const slug = productInfo.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const productData = {
      name: productInfo.name.trim(),

      slug,

      description: productInfo.description.trim(),

      brand_id: productInfo.brand_id,

      base_price: Number(productInfo.base_price || productInfo.price),

      status: "active",

      featured: false,

      category_ids: productInfo.category_ids,

      variants: [
        {
          sku: productInfo.sku.trim(),

          price: Number(productInfo.price),

          compare_at_price: productInfo.compare_at_price
            ? Number(productInfo.compare_at_price)
            : null,

          stock_quantity: Number(
            productInfo.stock_quantity || 0
          ),

          attributes: productInfo.specifications,

          is_active: true,
        },
      ],

      images: [
        {
          file: productImage,

          alt_text: productInfo.name,

          is_primary: true,

          variant_id: null,
        },
      ],
    };

    try {
      const result = await uploadProduct(productData);

      if (!result.success) {
        throw result.error;
      }

      setOpenSDialog(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to create product.");
    }
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <main className="flex flex-col p-4">
      {openSDialog && <SuccessDialog />}

      <div className="flex items-center gap-3 mb-6">
        <span className="h-6 w-3 bg-primary-dark rounded-xl"></span>

        <h2 className="text-2xl font-bold">
          Add New Product
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="min-w-[200px] max-w-[700px]"
      >
        {/* IMAGE */}

        <div>
          <input
            type="file"
            ref={imageInput}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setProductImage(file);
              }
            }}
          />

          {productImage ? (
            <img
              src={getImagePreview()}
              alt="Product preview"
              onClick={() => imageInput.current.click()}
              className="h-80 w-80 object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <button
              type="button"
              onClick={() => imageInput.current.click()}
              className="flex bg-neutral-200 h-80 w-80 rounded-xl"
            >
              <i className="fa fa-plus m-auto opacity-50"></i>
            </button>
          )}
        </div>

        {/* NAME */}

        <label
          htmlFor="name"
          className="inline-block mt-12"
        >
          Product Name
        </label>

        <input
          id="name"
          value={productInfo.name}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          type="text"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* DESCRIPTION */}

        <label
          htmlFor="description"
          className="inline-block mt-8"
        >
          Product Description
        </label>

        <textarea
          id="description"
          value={productInfo.description}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="py-2 px-3 w-full mt-3 mb-8 rounded-sm border h-24 bg-transparent border-neutral-400"
        />

        {/* BRAND */}

        <label
          htmlFor="brand"
          className="inline-block mt-4"
        >
          Product Brand
        </label>

        <select
          id="brand"
          value={productInfo.brand_id}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              brand_id: e.target.value,
            }))
          }
          className="block mt-3 p-3 rounded-sm text-sm bg-neutral-50 border"
        >
          <option value="">
            ---- Select Brand ----
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </select>

        {/* CATEGORIES */}

        <label className="inline-block mt-8">
          Product Categories
        </label>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 border rounded-md p-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={productInfo.category_ids.includes(
                  category.id
                )}
                onChange={() =>
                  toggleCategory(category.id)
                }
              />

              <span>{category.name}</span>
            </label>
          ))}
        </div>

        {/* SKU */}

        <label
          htmlFor="sku"
          className="inline-block mt-8"
        >
          SKU
        </label>

        <input
          id="sku"
          value={productInfo.sku}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              sku: e.target.value,
            }))
          }
          type="text"
          placeholder="e.g. SAM-S24-128-BLK"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* PRICE */}

        <label
          htmlFor="price"
          className="inline-block mt-8"
        >
          Product Price
        </label>

        <input
          id="price"
          value={productInfo.price}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
          type="number"
          min="0"
          step="0.01"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* COMPARE PRICE */}

        <label
          htmlFor="compare_at_price"
          className="inline-block mt-8"
        >
          Previous Price
        </label>

        <input
          id="compare_at_price"
          value={productInfo.compare_at_price}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              compare_at_price: e.target.value,
            }))
          }
          type="number"
          min="0"
          step="0.01"
          placeholder="Optional"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* STOCK */}

        <label
          htmlFor="stock"
          className="inline-block mt-8"
        >
          Amount In Stock
        </label>

        <input
          id="stock"
          value={productInfo.stock_quantity}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              stock_quantity: e.target.value,
            }))
          }
          type="number"
          min="0"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* SPECIFICATIONS */}

        <label className="inline-block mt-8">
          Product Specifications
        </label>

        <div className="my-4">
          {Object.keys(productInfo.specifications).length >
            0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(
                productInfo.specifications
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="border p-2 rounded flex items-center text-nowrap text-ellipsis overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      removeSpecification(key)
                    }
                    className="mr-3 opacity-80"
                  >
                    <i className="fa fa-times"></i>
                  </button>

                  <strong>{key}</strong>

                  <span className="mx-1">:</span>

                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <h2>Component</h2>

              <input
                value={newSpec.component}
                onChange={(e) =>
                  setNewSpec((prev) => ({
                    ...prev,
                    component: e.target.value,
                  }))
                }
                className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
              />
            </div>

            <div>
              <h2>Specification</h2>

              <input
                value={newSpec.specifications}
                onChange={(e) =>
                  setNewSpec((prev) => ({
                    ...prev,
                    specifications: e.target.value,
                  }))
                }
                className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addSpecification}
            className="mt-6 py-3 px-3 rounded-lg text-sm bg-primary-dark"
          >
            Add Specification
          </button>
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={isProductLoading}
          className="mt-8 py-3 px-4 flex items-center gap-2 rounded-lg text-sm bg-primary-dark disabled:opacity-50"
        >
          <p>
            {isProductLoading
              ? "Adding Product..."
              : "Add Product"}
          </p>

          <i
            className={`fa ${
              isProductLoading
                ? "fa-spinner fa-spin"
                : "fa-check"
            }`}
          ></i>
        </button>
      </form>
    </main>
  );

  function SuccessDialog() {
    function closeDialog() {
      setOpenSDialog(false);

      setProductInfo({
        name: "",
        description: "",
        brand_id: "",
        category_ids: [],
        base_price: "",
        sku: "",
        price: "",
        compare_at_price: "",
        stock_quantity: "",
        specifications: {},
      });

      setProductImage(null);
    }

    return (
      <div
        className="z-[1000] inset-0 fixed bg-neutral-950 bg-opacity-60"
        onClick={closeDialog}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-4 border-2 border-neutral-100 rounded-xl absolute left-[40%] top-[20%] bg-neutral-100 p-10"
        >
          <i className="fa fa-check-circle text-4xl"></i>

          <h2 className="text-2xl font-medium">
            Successful!
          </h2>

          <p className="text-xs opacity-70">
            The product has been uploaded successfully.
          </p>

          <button
            onClick={closeDialog}
            className="w-full py-3 bg-primary-dark rounded-md"
          >
            Okay
          </button>

          <Link
            to="/admin-products"
            className="flex items-center gap-2 text-sm"
          >
            <p>Go to product page</p>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    );
  }
}