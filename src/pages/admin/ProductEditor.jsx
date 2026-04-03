import { useEffect, useRef, useState } from "react";
import { useProducts } from "../../hooks/databaseManager/useProducts";
import { Link, useParams } from "react-router-dom";

export function ProductEditor() {
  const imageInput = useRef();
  const { productId } = useParams();
  const { uploadProduct, isProductLoading, getProductItem, updateProductItem } =
    useProducts();
  const [openSDialog, setOpenSDialog] = useState();
  const [productImage, setProductImage] = useState();
  const [updateImage, setUpdateImage] = useState();
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    specifications: {},
    category: "",
    price: "",
    amount_in_stock: "",
    brand: "",
  });

  useEffect(() => {
    if (openSDialog) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openSDialog]);

  useEffect(() => {
    if (productId) {
      getProductItem(productId).then((res) => {
        setProductInfo({
          name: res.name,
          description: res.description,
          category: res.category,
          price: res.price,
          amount_in_stock: res.amount_in_stock,
          brand: res.brand,
          specifications:res.specifications ?? {},
        });
        setProductImage(res.image_src);
        console.log(res.image_src);
      });
    }
  }, []);

  const handleKeyDown = (e) => {
    const text = productInfo.spec;
    // When Enter is pressed, add a new bullet automatically
    if (e.key === "Enter") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const newText = text.slice(0, start) + "\n• " + text.slice(start);
      setProductInfo((e) => {
        return { ...e, spec: newText };
      });

      // Move cursor after new bullet
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 3;
      }, 0);
    }
  };
  function getImage() {
    if (productId) {
      if (updateImage) {
        return URL.createObjectURL(updateImage);
      } else {
        return productImage;
      }
    } else {
      return URL.createObjectURL(productImage);
    }
  }

  return (
    <main className="flex flex-col p-4">
      {openSDialog && <SuccessDialog />}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-6 w-3 bg-primary-dark rounded-xl"></span>
        <h2 className="text-2xl font-bold">Add New Product</h2>
      </div>
      <div className="min-w-[200px] max-w-[700px] gap-12 items-end">
        <input
          type="file"
          ref={imageInput}
          className="hidden"
          onChange={(e) => {
            setProductImage(e.target.files[0]);
            if (productId) {
              setUpdateImage(e.target.files[0]);
            }
            console.log(e.target.files[0]);
          }}
        />
        <form>
          {productImage ? (
            <img
              onClick={(e) => {
                e.preventDefault();
                imageInput.current.click();
              }}
              src={getImage()}
              alt=""
              className="h-80 w-80 object-cover rounded-xl"
            />
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                imageInput.current.click();
              }}
              className="flex bg-neutral-200 h-80 w-80 rounded-xl"
            >
              <i className="fa fa-plus m-auto opacity-50"></i>
            </button>
          )}

          <label htmlFor="name" className="inline-block mt-12">
            Product Name
          </label>
          <input
            value={productInfo.name}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, name: edit.target.value };
              });
            }}
            type="text"
            id="name"
            className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
          />
          <label htmlFor="desc" className="inline-block mt-8">
            Product Description
          </label>
          <textarea
            value={productInfo.description}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, description: edit.target.value };
              });
            }}
            cols={6}
            type="text"
            id="desc"
            className="py-2 px-3 w-full mt-3 mb-8 rounded-sm border-[1px] h-20 bg-transparent border-neutral-400"
          />

          <label htmlFor="spec" className="inline-block mt-8">
            Product Specifications
          </label>
          <SpecificationsUi
            productSpecifications={productInfo.specifications}
            setProductInfo={setProductInfo}
          />
          <label htmlFor="category">Category</label>
          <select
            value={productInfo.category}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, category: edit.target.value };
              });
            }}
            id="category"
            className="block mt-2 p-3 rounded-sm text-sm bg-neutral-50"
          >
            <option value="">----Select Category----</option>

            <option value="TV,Audio & Entertainment">
              TV,Audio & Entertainment
            </option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Accessories & Essentials">
              Accessories & Essentials
            </option>
            <option value="Laptops & Phones">Laptop & Phones</option>
          </select>

          <label htmlFor="brand" className="inline-block mt-8">
            Product Brand
          </label>
          <input
            value={productInfo.brand}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, brand: edit.target.value };
              });
            }}
            type="text"
            id="brand"
            className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
          />

          <label htmlFor="price" className="inline-block mt-8">
            Product Price
          </label>
          <input
            value={productInfo.price}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, price: edit.target.value };
              });
            }}
            type="number"
            id="price"
            className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
          />
          <label htmlFor="availability" className="inline-block mt-12">
            Amount In Stock
          </label>
          <input
            value={productInfo.amount_in_stock}
            onChange={(edit) => {
              setProductInfo((e) => {
                return { ...e, amount_in_stock: edit.target.value };
              });
            }}
            type="number"
            id="availability"
            className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
          />

          <button
            onClick={async (e) => {
              e.preventDefault();
              if (productId) {
                try {
                  await updateProductItem(
                    productId,
                    productInfo,
                    productInfo.image_url,
                    updateImage
                  );
                  setOpenSDialog(true);
                } catch (error) {
                  alert(error);
                }
              } else {
                const { success } = await uploadProduct(
                  productInfo,
                  productImage
                );
                if (success) {
                  setOpenSDialog(true);
                }
              }
            }}
            className=" mt-6 py-3 px-3 flex items-center gap-2 rounded-lg text-sm bg-primary-dark float-right"
          >
            <p>{productId ? "Update Product":"Add Product"}</p>
            <i
              className={`fa ${
                isProductLoading ? "fa-spinner fa-spin" : "fa-check"
              }`}
            ></i>
          </button>
        </form>
      </div>
    </main>
  );

  function SuccessDialog() {
    return (
      <div
        onClick={() => {
          setOpenSDialog(false);
          setProductInfo({
            name: "",
            description: "",
            category: "",
            price: "",
            amount_in_stock: "",
          });
          setProductImage("");
        }}
        className="z-[1000] inset-0 fixed bg-neutral-950 bg-opacity-60 overflow-clip "
      >
        <div
          className={`flex flex-col items-center gap-4 border-2 border-neutral-100 rounded-xl absolute left-[40%] top-[20%] bg-neutral-100 p-10`}
        >
          <i className="fa fa-check-circle text-4xl"></i>
          <h2 className="text-2xl font-medium">Successfull !</h2>
          <p className="text-xs opacity-70">
            The product has being uploaded successfully
          </p>
          <button className="w-full py-3 bg-primary-dark rounded-md">
            Okay
          </button>
          <Link
            to={"/admin-products"}
            className="flex items-center gap-2 text-sm"
          >
            <p className="textsm">Go to product page</p>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    );
  }
}


function SpecificationsUi({ productSpecifications = {}, setProductInfo }) {

    
    const [newSpec, setNewSpec] = useState({ component: "", specifications: "" });

    useEffect(()=>{
      console.log(productSpecifications);
    },[productSpecifications]);

    const addSpec = (e) => {
      e.preventDefault();
      if (!newSpec.component || !newSpec.specifications) return;

      setProductInfo((prev) => ({
        ...prev,
        specifications: {
          ...(prev.specifications || {}),
          [newSpec.component]: newSpec.specifications,
        },
      }));
      // Reset input
      setNewSpec({ component: "", specifications: "" });
    };

    const removeSpec = (keyToRemove) => {
  setProductInfo((prev) => {
    const updatedSpecs = { ...prev.specifications };
    delete updatedSpecs[keyToRemove]; // remove the key
    return { ...prev, specifications: updatedSpecs };
  });
};


    return (
      <div className="my-4">
        {/* Display current specifications */}
        {Object.keys(productSpecifications).length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(productSpecifications).map(([key, value]) => (
              <div key={key} className="border p-2 rounded flex items-center text-nowrap text-ellipsis overflow-hidden"> <i onClick={()=>{removeSpec(key)}} className="fa fa-times mr-3 opacity-80"></i>
                <strong >{key}</strong> : {value}
               
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h2>Components</h2>
            <input
              type="text"
              value={newSpec.component}
              onChange={(e) => {
                setNewSpec((prev) => {
                  return { ...prev, component: e.target.value };
                });
              }}
              className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
            />
          </div>
          <div>
            <h2>Specifications</h2>
            <input
              value={newSpec.specifications}
              onChange={(e) => {
                setNewSpec((prev) => {
                  return { ...prev, specifications: e.target.value };
                });
              }}
              type="text"
              className="py-2 px-3 w-full mt-3 rounded-sm border-[1px] bg-transparent border-neutral-400"
            />
          </div>
        </div>
        <button
          onClick={addSpec}
          className="mt-6 py-3 px-3 flex items-center gap-2 rounded-lg text-sm bg-primary-dark float-right"
        >
          Add Specification
        </button>
      </div>
    );
  }