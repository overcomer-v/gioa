import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { UsersProductCard } from "./Cards";

export function CategoriesItemsView({ category,exclusion=[] }) {
    const {fetchGroupItems} = useProducts();
      const [categoryItems, setCategoryItems] = useState();
  
      useEffect(() => {
       fetchGroupItems("category",category).then((items) => {
        
        if (exclusion.length !== 0) {
          const filtereditem = items.filter((i)=> !exclusion.includes(i.id));
          setCategoryItems(filtereditem);
          return;
        }
          setCategoryItems(items);
        });
      }, [category]);
  
      return (
      <div>
        {categoryItems ?   <div className="flex gap-3 overflow-scroll no-scrollbar py-3 pb-6 w-full">
          {categoryItems &&
            categoryItems.map((item, index) => (
              <div className="md:w-[220px] w-[48%] flex-shrink-0 md:h-[360px] h-[300px]">
                <UsersProductCard
                id={item.id}
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