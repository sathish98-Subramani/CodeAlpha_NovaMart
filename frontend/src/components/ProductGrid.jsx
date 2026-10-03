import Loading from './Loading.jsx';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, loading, emptyMessage = 'No products found.' }) {
  if (loading) return <Loading label="Curating products" />;
  if (!products.length) return <div className="empty-state"><h3>Nothing here yet</h3><p>{emptyMessage}</p></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
