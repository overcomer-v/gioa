import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { UsersProductCard } from "../../components/Cards";
import { PageNavigator } from "../../components/PageNavigator";
import { generalPagePadding } from "../../utils/constants";
import { Spinner } from "../../components/Spinners";

export function GroupListOpener() {
  const { type, typeItem } = useParams();
  const [itemsList, setItemsList] = useState();
  const [page, setPage] = useState();
  const { fetchGroupItems, productCount } = useProducts();
  const limit = 15;
  const maxPageNo = Math.ceil(productCount / limit);

  useEffect(() => {
    fetchGroupItems(type, typeItem, page, limit).then((results) => {
      setItemsList(results);
      console.log(results);
    });
  }, [page, typeItem]);

  function capitalizeFirstLetter(text = "") {
    const firstLetter = text.at(0).toUpperCase();
    const remainingLetter = text.substring(1);
    return firstLetter + remainingLetter;
  }

  return (
    <div>
      <div className={`w-full neutral-bg ${generalPagePadding}`}>
        <h1 className="text-2xl text-primary font-bold py-4">{`${capitalizeFirstLetter(
          type
        )} > ${typeItem}`}</h1>
      </div>
     {
      !itemsList ? (
        <div className="flex h-screen w-full">
          <Spinner size="text-5xl opacity-60 m-auto"/>
        </div>
      ):(
         <><div
              className={`flex flex-wrap gap-3 no-scrollbar mt-6 py-3  w-full ${generalPagePadding}`}
            >
              {itemsList &&
                itemsList.map((item, index) => (
                  <div className="w-[220px]">
                    <UsersProductCard
                      key={index}
                      label={item.name}
                      imageSrc={item.image_src}
                      price={`₦${item.price}`}
                      brand={item.brand}
                      category={item.category} />
                  </div>
                ))}
            </div><PageNavigator
              pageNo={page}
              maxPageNo={maxPageNo}
              onPageChange={(pageNo) => {
                setPage(pageNo);
              } }
            ></PageNavigator></>
      )
     }
    </div>
  );
}
