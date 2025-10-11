import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { UsersProductCard } from "./Cards";

export function CategoriesItemsView({ category }) {
    const {fetchGroupItems} = useProducts();
      const [categoryItems, setCategoryItems] = useState();
  
      useEffect(() => {
       fetchGroupItems("category",category).then((items) => {
          setCategoryItems(items);
        });
      }, [category]);
  
      return (
      <div>
        {categoryItems ?   <div className="flex flex-wrap gap-3 no-scrollbar  py-3  w-full">
          {categoryItems &&
            categoryItems.map((item, index) => (
              <div className="w-[220px]">
                <UsersProductCard
                  key={index}
                  label={item.name}
                  imageSrc={item.image_src}
                  price={`₦${item.price}`}
                  brand={item.brand}
                  category={item.category}
                />
              </div>
            ))}
        </div> : <div className="flex w-full">
          <Spinner size="text-3xl m-auto opacity-60"/> </div>}
      </div>
      );
    }