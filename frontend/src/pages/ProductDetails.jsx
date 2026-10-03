import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import { useCart } from '../context/CartContext.jsx';

const money = (v) => `$${Number(v).toFixed(2)}`;

export default function ProductDetails() {
  const { slug } = useParams(); const navigate = useNavigate(); const { addItem } = useCart();
  const [product, setProduct] = useState(null); const [qty, setQty] = useState(1); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.get(`/products/${slug}`).then(r => setProduct(r.data.product)).catch(e => setError(getErrorMessage(e))).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <main className="section"><Loading label="Loading product"/></main>;
  if (error || !product) return <main className="section"><div className="container"><div className="empty-state"><h3>Product unavailable</h3><p>{error || 'This product could not be found.'}</p><Link className="btn btn-dark" to="/shop">Back to shop</Link></div></div></main>;
  const buy = () => { addItem(product, qty); navigate('/cart'); };
  return <main className="section"><div className="container"><Link className="back-link" to="/shop"><ArrowLeft size={17}/> Back to shop</Link><div className="detail-grid"><div className="detail-image"><img src={product.imageUrl} alt={product.name}/></div><div className="detail-copy"><div className="eyebrow">{product.category.toUpperCase()}</div><h1>{product.name}</h1><div className="detail-price"><strong>{money(product.price)}</strong>{product.compareAtPrice && <del>{money(product.compareAtPrice)}</del>}</div><p className="detail-description">{product.description}</p><div className="stock-line">{product.stock > 0 ? <><span className="stock-dot"/> In stock — ready to ship</> : 'Currently sold out'}</div><div className="quantity-row"><div className="qty-control"><button onClick={() => setQty(v => Math.max(1, v - 1))}><Minus size={16}/></button><span>{qty}</span><button onClick={() => setQty(v => Math.min(product.stock, v + 1))}><Plus size={16}/></button></div><button className="btn btn-dark grow-btn" disabled={!product.stock} onClick={buy}><ShoppingBag size={18}/> Add to bag</button></div><div className="service-points"><div><Truck size={18}/><span><strong>Free shipping over $50</strong><small>Tracked delivery at no extra cost.</small></span></div><div><ShieldCheck size={18}/><span><strong>Secure checkout</strong><small>Protected account and order APIs.</small></span></div><div><Check size={18}/><span><strong>30-day returns</strong><small>Easy returns on eligible items.</small></span></div></div></div></div></div></main>;
}
