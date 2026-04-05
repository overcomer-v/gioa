import { useEffect, useState } from "react";
import { Subtitle } from "../../components/Titles";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { UsersProductCard } from "../../components/Cards";
import { Spinner } from "../../components/Spinners";
import { useNavigate } from "react-router-dom";
import { CategoriesItemsView } from "../../components/CategoriesItemsView";
import { generalPagePadding } from "../../utils/constants";

export function CategoriesViewer() {
  const [categories, setCategories] = useState([]);
  const { fetchCategories } = useProducts();
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
      <Spinner size="text-3xl opacity-70 top-[40vh] absolute left-1/2" />
    </div>
  ) : (
    <div className={`${generalPagePadding} md:mt-12`}>
      <div className=" flex items-center gap-3 w-full neutral-bg shadow-sm border px-4">
        <i
          className="fa fa-chevron-left text-lg text-primary cursor-pointer py-1 px-3 hover:text-white rounded-md hover:bg-primary"
          onClick={() => {
            window.history.back();
          }}
        ></i>
        <h1 className="md:text-2xl text-lg font-bold py-4 text-primary">Categories</h1>
      </div>
      <div className=" md:py-8">
        {categories &&
          categories.map((category) => (
            <div className="flex flex-col gap-5 mb-20 mt-6">
              <Subtitle
                label={category.name}
                action={"Shop More"}
                onAction={() => {
                  navigate(`/group-opener/category/${category.name}`);
                }}
              />
              <CategoriesItemsView category={category.name} />
            </div>
          ))}
      </div>
    </div>
  );
}
