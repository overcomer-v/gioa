import { Link } from "react-router-dom";

export function UsersProductCard({
  id,
  imageSrc,
  label,
  category,
  price,
  brand,
  onClick,
}) {
  return (
    <Link
      onClick={onClick}
      to={`/product-details/${id}`}
      className="
        group flex flex-col h-full
        bg-white rounded-lg overflow-hidden
        border border-neutral-200
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="relative bg-neutral-100 overflow-hidden">
        <img
          className="
            w-full aspect-square
            object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
          src={imageSrc}
          alt={label}
        />

        {/* Category badge */}
        {category && (
          <span
            className="
              absolute top-3 left-3
              px-2.5 py-1
              rounded-full
              bg-white/90 backdrop-blur-sm
              text-[10px] md:text-xs
              font-medium text-primary
            "
          >
            {category}
          </span>
        )}

        {/* Cart button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick?.(e);
          }}
          className="
            absolute bottom-3 right-3
            h-9 w-9
            flex items-center justify-center
            rounded-full
            bg-primary text-white
            shadow-md
            opacity-0 translate-y-2
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all duration-300
          "
          aria-label="Add to cart"
        >
          <i className="fa fa-shopping-cart text-xs" />
        </button>
      </div>

      {/* Information */}
      <div className="flex flex-col flex-1 px-3.5 py-4">
        <div className="flex-1">
          {/* Brand */}
          {brand && (
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
              {brand}
            </p>
          )}

          {/* Product name */}
          <h2
            className="
              text-sm md:text-[15px]
              font-semibold
              leading-snug
              text-primary
              line-clamp-2
            "
          >
            {label}
          </h2>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base md:text-lg font-bold text-[rgb(133,150,21)]">
            {price}
          </span>

          {/* Mobile cart indicator */}
          <span className="md:hidden text-neutral-400">
            <i className="fa fa-shopping-cart text-sm" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SecondaryProductCard({
  id,
  imageSrc,
  label,
  category,
  price,
  onClick,
}) {
  return (
    <Link
      to={`/product-details/${id}`}
      onClick={onClick}
      className="group block"
    >
      <article
        className="
          relative
          h-[300px] md:h-[360px]
          overflow-hidden
          rounded-3xl
          bg-neutral-100
          transition-transform duration-500
          hover:-translate-y-1
        "
      >
        {/* Product image */}
        <img
          src={imageSrc}
          alt={label}
          className="
            absolute inset-0
            h-full w-full
            object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        {/* Subtle gradient for text readability */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/80
            via-black/10
            to-transparent
          "
        />

        {/* Product information */}
        <div
          className="
            absolute
            bottom-0 left-0 right-0
            p-5 md:p-7
            text-white
          "
        >
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
            {category}
          </p>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2
                className="
                  text-xl md:text-2xl
                  font-semibold
                  leading-tight
                  line-clamp-2
                "
              >
                {label}
              </h2>

              <p className="mt-2 text-sm font-medium text-white/90">
                {price}
              </p>
            </div>

            {/* Arrow */}
            <span
              className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-full
                bg-white
                text-primary
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              <i className="fa fa-arrow-right text-xs" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
