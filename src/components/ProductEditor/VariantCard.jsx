import { useEffect, useRef, useState } from "react";

export function VariantCard({
  variant,
  index,
  canRemove,
  onFieldChange,
  onRemove,
  onAddAttribute,
  onRemoveAttribute,
}) {
  const [newAttr, setNewAttr] = useState({ key: "", value: "" });

  const imageInput = useRef();
  const [preview, setPreview] = useState(null);

  // Create the preview URL once per selected file and revoke it after,
  // instead of creating a new object URL on every render.
  useEffect(() => {
    if (!variant.image) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(variant.image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [variant.image]);

  function handleAddAttribute(e) {
    e.preventDefault();

    if (!newAttr.key.trim() || !newAttr.value.trim()) {
      return;
    }

    onAddAttribute(variant._localId, newAttr.key.trim(), newAttr.value.trim());

    setNewAttr({ key: "", value: "" });
  }

  return (
    <div className="border rounded-xl p-5 mb-6 border-neutral-300">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">Variant {index + 1}</h3>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(variant._localId)}
            className="text-sm opacity-70 flex items-center gap-2"
          >
            <i className="fa fa-trash"></i>
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* CORE FIELDS */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="inline-block mb-2 text-sm">SKU</label>

          <input
            value={variant.sku}
            onChange={(e) =>
              onFieldChange(variant._localId, "sku", e.target.value)
            }
            type="text"
            placeholder="e.g. SAM-S24-128-BLK"
            className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
          />
        </div>

        <div className="flex items-end pb-2 gap-2">
          <input
            id={`active-${variant._localId}`}
            type="checkbox"
            checked={variant.is_active}
            onChange={(e) =>
              onFieldChange(variant._localId, "is_active", e.target.checked)
            }
          />

          <label htmlFor={`active-${variant._localId}`} className="text-sm">
            Active
          </label>
        </div>

        <div>
          <label className="inline-block mb-2 text-sm">Price</label>

          <input
            value={variant.price}
            onChange={(e) =>
              onFieldChange(variant._localId, "price", e.target.value)
            }
            type="number"
            min="0"
            step="0.01"
            className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
          />
        </div>

        <div>
          <label className="inline-block mb-2 text-sm">Previous Price</label>

          <input
            value={variant.compare_at_price}
            onChange={(e) =>
              onFieldChange(
                variant._localId,
                "compare_at_price",
                e.target.value,
              )
            }
            type="number"
            min="0"
            step="0.01"
            placeholder="Optional"
            className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
          />
        </div>

        <div>
          <label className="inline-block mb-2 text-sm">Stock Quantity</label>

          <input
            value={variant.stock_quantity}
            onChange={(e) =>
              onFieldChange(
                variant._localId,
                "stock_quantity",
                e.target.value,
              )
            }
            type="number"
            min="0"
            className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
          />
        </div>
      </div>

      {/* OPTIONAL VARIANT IMAGE */}

      <div className="mt-6">
        <label className="inline-block mb-3 text-sm">
          Variant Image <span className="opacity-60 text-xs">(optional)</span>
        </label>

        <input
          type="file"
          ref={imageInput}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onFieldChange(variant._localId, "image", file);
            }

            // Reset so the same file can be picked again after removing it.
            e.target.value = "";
          }}
        />

        {preview ? (
          <div className="flex items-end gap-3">
            <img
              src={preview}
              alt={`Variant ${index + 1} preview`}
              onClick={() => imageInput.current.click()}
              className="h-24 w-24 object-cover rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={() => onFieldChange(variant._localId, "image", null)}
              className="text-sm opacity-70 flex items-center gap-2"
            >
              <i className="fa fa-times"></i>
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imageInput.current.click()}
            className="flex bg-neutral-200 h-24 w-24 rounded-lg"
          >
            <i className="fa fa-plus m-auto opacity-50"></i>
          </button>
        )}
      </div>

      {/* SPECIFICATIONS (this variant's attributes, e.g. RAM: 16GB) */}

      <div className="mt-6">
        <label className="inline-block mb-3 text-sm">Specifications</label>

        {Object.keys(variant.attributes).length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(variant.attributes).map(([key, value]) => (
              <div
                key={key}
                className="border p-2 rounded flex items-center text-nowrap text-ellipsis overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => onRemoveAttribute(variant._localId, key)}
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
            <h4 className="text-sm mb-2">Component</h4>

            <input
              value={newAttr.key}
              onChange={(e) =>
                setNewAttr((prev) => ({ ...prev, key: e.target.value }))
              }
              placeholder="e.g. RAM"
              className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
            />
          </div>

          <div>
            <h4 className="text-sm mb-2">Specification</h4>

            <input
              value={newAttr.value}
              onChange={(e) =>
                setNewAttr((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="e.g. 16GB"
              className="py-2 px-3 w-full rounded-sm border bg-transparent border-neutral-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddAttribute}
          className="mt-4 py-2 px-3 rounded-lg text-sm bg-primary-dark"
        >
          Add Specification
        </button>
      </div>
    </div>
  );
}