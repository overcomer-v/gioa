import { useEffect, useRef, useState } from "react";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { VariantsSection } from "../../components/ProductEditor/VariantSection";

function createEmptyVariant() {
  return {
    _localId: crypto.randomUUID(),
    sku: "",
    price: "",
    compare_at_price: "",
    stock_quantity: "",
    is_active: true,
    attributes: {},
    image: null,
  };
}

export function ProductEditor() {
  const imageInput = useRef();

  const { uploadProduct, isProductLoading, fetchCategories, fetchBrands } =
    useProducts();

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
  });

  const [variants, setVariants] = useState([createEmptyVariant()]);

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
    document.body.style.overflow = openSDialog ? "hidden" : "auto";

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
  // VARIANTS
  //
  // Each variant is tracked locally with a `_localId` (a client
  // side uuid used only for React keys and targeted updates).
  // It's stripped out before the payload is sent to uploadProduct.
  // ---------------------------------------------------------

  function addVariant() {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  }

  function removeVariant(localId) {
    setVariants((prev) => prev.filter((v) => v._localId !== localId));
  }

  function updateVariantField(localId, field, value) {
    setVariants((prev) =>
      prev.map((v) =>
        v._localId === localId ? { ...v, [field]: value } : v,
      ),
    );
  }

  function addVariantAttribute(localId, key, value) {
    setVariants((prev) =>
      prev.map((v) =>
        v._localId === localId
          ? { ...v, attributes: { ...v.attributes, [key]: value } }
          : v,
      ),
    );
  }

  function removeVariantAttribute(localId, key) {
    setVariants((prev) =>
      prev.map((v) => {
        if (v._localId !== localId) return v;

        const updatedAttributes = { ...v.attributes };
        delete updatedAttributes[key];

        return { ...v, attributes: updatedAttributes };
      }),
    );
  }

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------

  function validate() {
    if (!productInfo.name.trim()) {
      alert("Please enter a product name.");
      return false;
    }

    if (!productInfo.brand_id) {
      alert("Please select a brand.");
      return false;
    }

    if (productInfo.category_ids.length === 0) {
      alert("Please select at least one category.");
      return false;
    }

    if (!productImage) {
      alert("Please select a product image.");
      return false;
    }

    if (variants.length === 0) {
      alert("Please add at least one variant.");
      return false;
    }

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      if (!variant.sku.trim()) {
        alert(`Please enter a SKU for variant ${i + 1}.`);
        return false;
      }

      if (!variant.price) {
        alert(`Please enter a price for variant ${i + 1}.`);
        return false;
      }
    }

    const skus = variants.map((v) => v.sku.trim().toLowerCase());
    const hasDuplicateSku = skus.some((sku, i) => skus.indexOf(sku) !== i);

    if (hasDuplicateSku) {
      alert("Each variant needs a unique SKU.");
      return false;
    }

    return true;
  }

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const slug = productInfo.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // If no base price was set explicitly, default it to the
    // cheapest variant so the product still has a sane list price.
    const variantPrices = variants.map((v) => Number(v.price));
    const fallbackBasePrice = Math.min(...variantPrices);

    const productData = {
      name: productInfo.name.trim(),

      slug,

      description: productInfo.description.trim(),

      brand_id: productInfo.brand_id,

      base_price: Number(productInfo.base_price) || fallbackBasePrice,

      status: "active",

      featured: false,

      category_ids: productInfo.category_ids,

      variants: variants.map(({ _localId, ...variant }) => ({
        sku: variant.sku.trim(),
        price: Number(variant.price),
        compare_at_price: variant.compare_at_price
          ? Number(variant.compare_at_price)
          : null,
        stock_quantity: Number(variant.stock_quantity || 0),
        attributes: variant.attributes,
        is_active: variant.is_active,
        image: variant.image, // optional File, uploaded by the hook
      })),

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

  function closeDialog() {
    setOpenSDialog(false);

    setProductInfo({
      name: "",
      description: "",
      brand_id: "",
      category_ids: [],
      base_price: "",
    });

    setVariants([createEmptyVariant()]);
    setProductImage(null);
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <main className="flex flex-col p-4">
      {openSDialog && <SuccessDialog onClose={closeDialog} />}

      <div className="flex items-center gap-3 mb-6">
        <span className="h-6 w-3 bg-primary-dark rounded-xl"></span>

        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="min-w-[200px] max-w-[700px]">
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

        <label htmlFor="name" className="inline-block mt-12">
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

        <label htmlFor="description" className="inline-block mt-8">
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

        <label htmlFor="brand" className="inline-block mt-4">
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
          <option value="">---- Select Brand ----</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* CATEGORIES */}

        <label className="inline-block mt-8">Product Categories</label>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 border rounded-md p-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={productInfo.category_ids.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />

              <span>{category.name}</span>
            </label>
          ))}
        </div>

        {/* BASE PRICE */}

        <label htmlFor="base_price" className="inline-block mt-8">
          Base Price{" "}
          <span className="opacity-60 text-xs">
            (optional — defaults to the lowest variant price)
          </span>
        </label>

        <input
          id="base_price"
          value={productInfo.base_price}
          onChange={(e) =>
            setProductInfo((prev) => ({
              ...prev,
              base_price: e.target.value,
            }))
          }
          type="number"
          min="0"
          step="0.01"
          placeholder="Optional"
          className="py-2 px-3 w-full mt-3 rounded-sm border bg-transparent border-neutral-400"
        />

        {/* VARIANTS */}

        <VariantsSection
          variants={variants}
          onAddVariant={addVariant}
          onRemoveVariant={removeVariant}
          onFieldChange={updateVariantField}
          onAddAttribute={addVariantAttribute}
          onRemoveAttribute={removeVariantAttribute}
        />

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={isProductLoading}
          className="mt-8 py-3 px-4 flex items-center gap-2 rounded-lg text-sm bg-primary-dark disabled:opacity-50"
        >
          <p>{isProductLoading ? "Adding Product..." : "Add Product"}</p>

          <i
            className={`fa ${
              isProductLoading ? "fa-spinner fa-spin" : "fa-check"
            }`}
          ></i>
        </button>
      </form>
    </main>
  );
}

export function SuccessDialog({ onClose }) {
  return (
    <div
      className="z-[1000] inset-0 fixed bg-neutral-950 bg-opacity-60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-4 border-2 border-neutral-100 rounded-xl absolute left-[40%] top-[20%] bg-neutral-100 p-10"
      >
        <i className="fa fa-check-circle text-4xl"></i>

        <h2 className="text-2xl font-medium">Successful!</h2>

        <p className="text-xs opacity-70">
          The product has been uploaded successfully.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary-dark rounded-md"
        >
          Okay
        </button>

        <Link to="/admin-products" className="flex items-center gap-2 text-sm">
          <p>Go to product page</p>
          <i className="fa fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}