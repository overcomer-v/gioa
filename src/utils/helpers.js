export function getProductImage(product) {
  return (
    product.images?.find((image) => image.is_primary)?.public_url ||
    product.images?.[0]?.public_url ||
    product.product_images?.find(
      (image) => image.is_primary
    )?.image_url ||
    product.product_images?.[0]?.image_url ||
    "/images/product-placeholder.png"
  );
}