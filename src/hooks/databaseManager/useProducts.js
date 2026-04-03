import { useState } from "react";
import { supabase } from "../../supabase";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState("");
  const [productCount, setProductCount] = useState("");

  const tableName = "products";
  const storageName = "product_images";

  
  async function uploadProduct(productInfo, productImage) {
    const filePath = `${Date.now()}-${productImage.name}`;
    if (productImage && productInfo) {
      try {
        setIsProductLoading(true);
        const imageurl = await uploadProductImage(filePath, productImage);
        await uploadProductInfo({ ...productInfo, image_url: imageurl.path });
        console.log("product upload successfull");
        return { success: true };
      } catch (error) {
        console.error(error);
        alert(error);
        return { success: false };
      } finally {
        setIsProductLoading(false);
      }
    } else if (productInfo) {
      try {
        setIsProductLoading(true);
        await uploadProductInfo(productInfo);
        return { success: true };
      } catch (error) {
        console.error(error);
        alert(error);
        return { success: false };
      } finally {
        setIsProductLoading(false);
      }
    }
  }

  async function uploadProductImage(filePath, productImage) {
    const { data: storageData, error: storageError } = await supabase.storage
      .from(storageName) // your bucket name
      .upload(filePath, productImage);

    if (storageError) {
      throw storageError;
    } else {
      console.log("image-upload successfull");
    }

    return storageData;
  }

  async function uploadProductInfo(productInfo) {
    const { data, error } = await supabase
      .from(tableName)
      .insert([productInfo]);

    if (error) {
      throw error;
    } else {
      console.log("upload successfull :", data);
    }
  }

  async function fetchProducts(page = 1, limit = 15) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
      setIsProductLoading(true);
      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) throw error;
      console.log("Fetch successfull");

      const mData = await Promise.allSettled(
        data.map(async (e) => {
          return { ...e, image_src: await getImagePublicURL(e.image_url) };
        })
      );
      setProductCount(count);
      setProducts(mData.map((e) => e.value));
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const { error, data } = await supabase.from("categories").select("*");

      if (error) {
        throw error;
      }

      const items = Promise.allSettled(
        data.map(async (e) => {
          return { ...e, imageSrc: await getImagePublicURL(e.image_url) };
        })
      );

      return (await items).map((item) => item.value);
    } catch (error) {
      console.error(error);
    }
  }

  // group here could means brand or categories or anyother group
  async function fetchGroupItems(groupType, groupItem, page=1, limit=15) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      setIsProductLoading(true);
      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .eq(groupType, groupItem)
        .range(from, to);

      if (error) {
        throw error;
      }

      const mData = await Promise.allSettled(
        data.map(async (e) => {
          return { ...e, image_src: await getImagePublicURL(e.image_url) };
        })
      );

      console.log(mData.map((item) => item.value));
      setProductCount(count);
      return mData.map((item) => item.value);
    } catch (error) {
      console.error(error);
      throw error;
    }finally{
      setIsProductLoading(false);
    }
  }

  async function getImagePublicURL(imagePath) {
    if (imagePath) {
      try {
        const { data, error } = await supabase.storage
          .from(storageName)
          .createSignedUrl(imagePath, 60);

        if (error) {
          throw error;
        }
        // expires in 60 seconds
        return data.signedUrl;
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function getProductItem(productId) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", productId).single();
      if (error) {
        throw error;
      } else {
        return {
          ...data,
          image_src: await getImagePublicURL(data.image_url),
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProductItem(productId, product, imagePath, image) {
    try {
      setIsProductLoading(true);
      if (image) {
        const image_Path = await updateProductImage(imagePath, image);
        await updateProductInfo(productId, {
          ...product,
          image_url: image_Path,
        });
      } else {
        await updateProductInfo(productId, product);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsProductLoading(false);
    }
  }

 

  async function updateProductInfo(productId, product) {
    const { error } = await supabase
      .from(tableName)
      .update(product)
      .eq("id", productId);

    console.log("product info update successfull");

    if (error) {
      throw error;
    }
  }

  async function updateProductImage(imagePath, image) {
    const filePath = `${Date.now()}-${image.name}`;

    if (imagePath) {
      const { error } = await supabase.storage
        .from(storageName)
        .remove([imagePath]);

      if (error) {
        throw error;
      }
    }

    const { data, error } = await supabase.storage
      .from(storageName)
      .upload(filePath, image);

    if (!error) {
      console.log("successfull image update");
      return data.path;
    } else {
      throw error;
    }
  }

  async function deleteProduct(id, imagePath) {
    try {
      const { error: databaseE } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);
      if (databaseE) {
        throw databaseE;
      } else {
        console.log("Product info deleted");
      }

      const { error, data } = await supabase.storage
        .from(storageName)
        .remove([imagePath]);
      if (error) {
        throw error;
      } else {
        console.log("successfull image deleted:", data);
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getBrandNames() {
    try {
      const { data, error } = await supabase.from(tableName).select("brand");
      if (error) {
        throw error;
      }

      return [...new Set(data.map((data) => data.brand))];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return {
    uploadProduct,
    fetchProducts,
    isProductLoading,
    products,
    getImagePublicURL,
    deleteProduct,
    getProductItem,
    updateProductItem,
    fetchCategories,
    productCount,
    getBrandNames,
    fetchGroupItems,
  };
}
