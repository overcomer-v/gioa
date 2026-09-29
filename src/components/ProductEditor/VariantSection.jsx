import { VariantCard } from "./VariantCard";

export function VariantsSection({
  variants,
  onAddVariant,
  onRemoveVariant,
  onFieldChange,
  onAddAttribute,
  onRemoveAttribute,
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <label className="text-base font-semibold">Variants</label>

        <button
          type="button"
          onClick={onAddVariant}
          className="py-2 px-3 rounded-lg text-sm bg-primary-dark flex items-center gap-2"
        >
          <i className="fa fa-plus"></i>
          <span>Add Variant</span>
        </button>
      </div>

      {variants.map((variant, index) => (
        <VariantCard
          key={variant._localId}
          variant={variant}
          index={index}
          canRemove={variants.length > 1}
          onFieldChange={onFieldChange}
          onRemove={onRemoveVariant}
          onAddAttribute={onAddAttribute}
          onRemoveAttribute={onRemoveAttribute}
        />
      ))}
    </div>
  );
}