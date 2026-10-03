import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

const money = (value) => `$${Number(value).toFixed(2)}`;

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('novamart_wishlist') || '[]').includes(product.id); } catch { return false; }
  });
  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem('novamart_wishlist') || '[]');
      if (saved && !current.includes(product.id)) localStorage.setItem('novamart_wishlist', JSON.stringify([...current, product.id]));
      if (!saved && current.includes(product.id)) localStorage.setItem('novamart_wishlist', JSON.stringify(current.filter((id) => id !== product.id)));
    } catch {}
  }, [saved, product.id]);
  const toggleSaved = (event) => { event.preventDefault(); setSaved((value) => !value); };
  return <article className="product-card">
    <Link to={`/product/${product.slug}`} className="product-image-wrap">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <img src={product.imageUrl} alt={product.name} loading="lazy" />
      <span className="quick-add">View details</span>
    </Link>
    <div className="product-content">
      <div className="product-meta"><span>{product.category}</span><button className={`wishlist-btn ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Remove' : 'Save'} ${product.name}`} aria-pressed={saved} onClick={toggleSaved}><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button></div>
      <Link className="product-name" to={`/product/${product.slug}`}>{product.name}</Link>
      <div className="product-bottom"><div className="price-row"><strong>{money(product.price)}</strong>{product.compareAtPrice && <del>{money(product.compareAtPrice)}</del>}</div><button className="add-btn" disabled={!product.stock} onClick={() => addItem(product)}>{product.stock ? <ShoppingBag size={17} /> : 'Sold out'}</button></div>
    </div>
  </article>;
}
