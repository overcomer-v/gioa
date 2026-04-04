import { useEffect, useState } from "react";
import { useProducts } from "../hooks/databaseManager/useProducts";
import { Spinner } from "./Spinners";
import { UsersProductCard } from "./Cards";
import { useIsMobile } from "../hooks/useDevice";

export function CategoriesItemsView({ category,exclusion=[] }) {
    const {fetchGroupItems} = useProducts();
      const [categoryItems, setCategoryItems] = useState([]);
      const isMobile = useIsMobile();
  
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

      const itemsToDisplay = isMobile ? categoryItems.slice(0,4) : categoryItems;
  
      return (
      <div>
        {itemsToDisplay ?   <div className="md:flex grid grid-cols-2 gap-3 overflow-scroll no-scrollbar py-3 pb-6 w-full">
          {itemsToDisplay &&
            itemsToDisplay.map((item, index) => (
              <div className="md:w-[220px] w-full flex-shrink-0 md:h-[360px] h-[280px]">
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