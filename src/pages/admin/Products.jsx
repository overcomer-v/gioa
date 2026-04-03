import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinners";
import { PageNavigator } from "../../components/PageNavigator";

export function Products() {
  const {
    fetchProducts,
    isProductLoading,
    products,
    deleteProduct,
    fetchCategories,
    productCount,
  } = useProducts();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemDetails, setItemsDetails] = useState({ id: "", image_url: "" });
  const limit = 15;
  const maxPage = Math.ceil(productCount / limit);

  useEffect(() => {
    fetchProducts(page, limit);
    fetchCategories().then((category) => {
      setCategories(category);
    });
  }, [page]);

  useEffect(() => {
    console.log(products, "p-page");
  }, [products]);

  return (
    <div className="">
      {openDeleteDialog && (
        <DeleteWarningDaialog
          onCancel={() => {
            setOpenDeleteDialog(false);
          }}
          onDelete={async () => {
            try {
              await deleteProduct(itemDetails.id, itemDetails.image_url);
              alert("Successfully deleted");
            } catch (error) {
              alert(`An Error occurred : ${error}`);
              throw error;
            }
          }}
        ></DeleteWarningDaialog>
      )}

      <section id="categories-section">
        <div className="flex justify-between items-center mb-4 page-animation">
          <h1 className="flex items-center gap-2">
            <i className="fa fa-box text-admin_primary"></i>
            <span className="text-2xl font-medium">Product Categories</span>
          </h1>
          {/* <Link
            to={"/product-editor"}
            className="flex items-center gap-2 bg-white shadow-md p-3 rounded-md text-sm"
          >
            <i className="fa fa-plus"></i>
            <span className="opacity-70">Add Category</span>
          </Link> */}
        </div>

        <div className="flex gap-2 items-center mb-4 flex-wrap">
          {categories.map((category, index) => (
            <div
              key={index}
              className="border-2 px-4 py-2 rounded-lg text-nowrap"
            >
              {category.name}
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center mb-4 mt-8 page-animation">
        <h1 className="flex items-center gap-2">
          <i className="fa fa-box text-admin_primary"></i>
          <span className="text-2xl font-medium">Products</span>
        </h1>
        <Link
          to={"/product-editor"}
          className="flex items-center gap-2 bg-white shadow-md p-3 rounded-md text-sm"
        >
          <i className="fa fa-plus"></i>
          <span className="opacity-70">Add Product</span>
        </Link>
      </div>
      {products?.length > 0 || !isProductLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-3 gap-y-8">
          {products.map((product, index) => (
            <ProductsCard product={product} key={index}></ProductsCard>
          ))}
        </div>
      ) : (
        <div className="w-full text-center mt-6">
          <Spinner></Spinner>
        </div>
      )}
      {(products?.length > 0 ||
        !isProductLoading )&& (
        <div className="my-16">
            <PageNavigator
            pageNo={page}
            maxPageNo={maxPage}
            onPageChange={(e) => {
              setPage(e);
            }}
          />
        </div>
        )}
    </div>
  );

  function ProductsCard({ product }) {
    return (
      <div className="shadow-md  p-4 bg-white rounded-md">
        <img
          src={product.image_src}
          className="object-cover mb-4 aspect-[1] w-full rounded-md"
          alt=""
        />
        <p className="text-sm opacity-60 text-ellipsis line-clamp-1">
          {product.category}
        </p>
        <h2 className="font-semibold overflow-hidden line-clamp-1">
          {product.name}
        </h2>
        <div className="flex flex-col justify-between mt-4">
          <span className="font-semibold">{`#${product.price}`}</span>
          <span className="font-semibold opacity-60 text-sm text-admin_primary ">{` ${product.amount_in_stock} in stock`}</span>
        </div>
        <div className="flex justify-between mt-4 gap-3 items-center">
          <i
            onClick={() => {
              setOpenDeleteDialog(true);
              setItemsDetails({ id: product.id, image_url: product.image_url });
            }}
            className="fa fa-trash text-neutral-900 text-sm rounded-sm shadow-md p-2"
          ></i>
          <i
            onClick={() => {
              navigate(`/product-editor/${product.id}`);
            }}
            className="fa fa-pen text-xs rounded-md shadow-md p-2"
          ></i>
        </div>
      </div>
    );
  }

  function DeleteWarningDaialog({ onDelete, onCancel }) {
    const [openSpinner, setOpenSpinner] = useState();
    return (
      <div
        onClick={onCancel}
        className="fixed z-50 inset-0 bg-neutral-800 bg-opacity-65"
      >
        <div className="absolute left-[40%] top-[40%] rounded-lg px-6 py-8 bg-neutral-100">
          <h3 className="font-semibold mb-6">Delete Confirmation</h3>
          <p>Do you really want to delete this item ?</p>
          <div className="flex justify-between mt-6">
            <button className="bg-neutral-300 px-4 py-2 rounded-md text-sm">
              Cancel
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  setOpenSpinner(true);
                  await onDelete();
                  onCancel();
                } catch (error) {
                  onCancel();
                }
              }}
              className="bg-red-800 px-4 py-2 rounded-md text-white text-sm flex items-center gap-2"
            >
              <p>Yes</p>
              {openSpinner && <Spinner size="text-sm"></Spinner>}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
