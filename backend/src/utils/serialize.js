export const serializeProduct = (product) => ({
  ...product,
  price: Number(product.price),
  compareAtPrice: product.compareAtPrice == null ? null : Number(product.compareAtPrice),
});

export const serializeOrder = (order) => ({
  ...order,
  subtotal: Number(order.subtotal),
  shipping: Number(order.shipping),
  tax: Number(order.tax),
  total: Number(order.total),
  items: order.items?.map((item) => ({
    ...item,
    price: Number(item.price),
    product: item.product ? serializeProduct(item.product) : undefined,
  })),
});
