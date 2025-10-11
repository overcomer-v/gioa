import { useEffect, useState } from "react";
import { Subtitle } from "../../components/Titles";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { UsersProductCard } from "../../components/Cards";
import { Spinner } from "../../components/Spinners";
import { useNavigate } from "react-router-dom";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";

export function CategoriesViewer() {
  const [categories, setCategories] = useState();
  const { fetchCategories, } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchCategories().then((results) => {
      setCategories(results);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    <div className="flex h-[80vh] w-full">
      <Spinner size="text-5xl opacity-70 m-auto"/>
    </div>
  ) : (
    <div className="">
      <div className="w-full bg-neutral-800 px-16">
        <h1 className="text-2xl text-primary font-bold py-4">Categories</h1>
      </div>
      <div className="px-8 lg:px-16 py-8">
        {categories &&
          categories.map((category) => (
            <div className="flex flex-col gap-5 mb-20 mt-6">
              <Subtitle label={category.name} action={"Shop More"} onAction={()=>{
                navigate(`/group-opener/category/${category.name}`);
              }} />
              <CategoriesItemsView category={category.name} />
            </div>
          ))}
      </div>
    </div>
  );

 
}
 