import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useDevice";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { getProductImage } from "../utils/helpers";
import { Spinner } from "./Spinners";
import { UsersProductCard } from "./Cards";

export function CategoriesItemsView({
  categoryId,
  exclusion = [],
}) {
  const { fetchProductsByCategory } = useProducts();

  const [categoryItems, setCategoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);

    fetchProductsByCategory(categoryId).then((items) => {
      if (!mounted) return;

      const filteredItems =
        exclusion.length > 0
          ? items.filter((item) => !exclusion.includes(item.id))
          : items;

      setCategoryItems(filteredItems || []);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="text-2xl opacity-60" />
      </div>
    );
  }

  const itemsToDisplay = isMobile
    ? categoryItems.slice(0, 4)
    : categoryItems;

  return (
    <div className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {itemsToDisplay.map((item) => (
        <div
          key={item.id}
          className="w-[160px] shrink-0 md:w-[220px]"
        >
          <UsersProductCard
            id={item.id}
            label={item.name}
            imageSrc={getProductImage(item)}
            price={`₦${Number(
              item.base_price || item.price || 0
            ).toLocaleString()}`}
            brand={
              item.brands?.name ||
              item.brand
            }
            category={
              item.categories?.[0]?.name ||
              item.category
            }
          />
        </div>
      ))}
    </div>
  );
}
