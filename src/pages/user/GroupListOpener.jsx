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
  const [loading,setLoading] = useState(true);
  const { fetchGroupItems, productCount } = useProducts();
  const limit = 15;
  const maxPageNo = Math.ceil(productCount / limit);

  useEffect(() => {
    setLoading(true);
    fetchGroupItems(type, typeItem, page, limit).then((results) => {
      setItemsList(results);
      setLoading(false);
      console.log(results);
    });
  }, [page, typeItem]);

  function capitalizeFirstLetter(text = "") {
    const firstLetter = text.at(0).toUpperCase();
    const remainingLetter = text.substring(1);
    return firstLetter + remainingLetter;
  }

  return (
    <div className={`${generalPagePadding}`}>
      <div
        className={`w-full neutral-bg  flex items-center py-4 gap-3 md:mt-12 border px-4`}
      >
        <i
          className="fa fa-chevron-left text-lg text-primary cursor-pointer py-1 px-3 hover:text-white rounded-md hover:bg-primary"
          onClick={() => {
            window.history.back();
          }}
        ></i>
        <h1 className="md:text-2xl text-lg text-primary font-bold pb-1">{`${capitalizeFirstLetter(typeItem)}`}</h1>
      </div>
      {!itemsList || loading? (
        <div className="flex h-screen w-full">
          <Spinner size="text-3xl opacity-60 top-[50vh] absolute left-1/2" />
        </div>
      ) : (
        <>
          <div
            className={`md:flex grid grid-cols-2 gap-3 overflow-scroll no-scrollbar py-3 pb-6 w-full `}
          >
            {itemsList &&
              itemsList.map((item, index) => (
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
          </div>
          <div className="mt-12">
            <PageNavigator
              pageNo={page}
              maxPageNo={maxPageNo}
              onPageChange={(pageNo) => {
                setPage(pageNo);
              }}
            ></PageNavigator>
          </div>
        </>
      )}
    </div>
  );
}
