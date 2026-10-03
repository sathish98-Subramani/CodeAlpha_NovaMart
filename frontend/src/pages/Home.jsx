import { ArrowRight, Check, Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import ProductGrid from '../components/ProductGrid.jsx';

const categories = [
  { name: 'Audio', text: 'Immersive sound, refined.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' },
  { name: 'Workspace', text: 'Build a better desk.', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80' },
  { name: 'Tech', text: 'Smart tools, less friction.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
];

export default function Home() {
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.get('/products?featured=true').then(r => setProducts(r.data.products)).catch(e => setError(getErrorMessage(e))).finally(() => setLoading(false)); }, []);
  return <>
    <main>
      <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow">CURATED FOR THE EVERYDAY</div><h1>Good design should make daily life <em>feel effortless.</em></h1><p>Premium tech and everyday essentials, thoughtfully selected for how you work, move, listen and live.</p><div className="hero-actions"><Link className="btn btn-dark" to="/shop">Shop the collection <ArrowRight size={18}/></Link><a className="text-link" href="#why">Why NovaMart</a></div><div className="hero-proof"><span><Check size={15}/> Free shipping over $50</span><span><Check size={15}/> 30-day returns</span></div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=88" alt="Modern desk with curated technology"/><div className="hero-card"><span>EDITOR'S NOTE</span><strong>Quietly excellent.</strong><p>Tools you will reach for every day.</p></div></div></div></section>

      <section className="marquee"><div className="container marquee-row"><span>Modern essentials</span><span>•</span><span>Thoughtful design</span><span>•</span><span>Reliable quality</span><span>•</span><span>Everyday joy</span></div></section>

      <section className="section"><div className="container"><div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Best of NovaMart</h2></div><Link className="text-link" to="/shop">View all <ArrowRight size={16}/></Link></div>{error ? <div className="alert">{error}</div> : <ProductGrid products={products.slice(0, 6)} loading={loading} emptyMessage="Run the database seed to populate the storefront."/>}</div></section>

      <section className="section section-muted"><div className="container"><div className="section-heading"><div><div className="eyebrow">SHOP BY MOOD</div><h2>Find your next favorite.</h2></div></div><div className="category-grid">{categories.map(c => <Link className="category-card" key={c.name} to={`/shop?category=${c.name}`}><img src={c.image} alt=""/><div className="category-overlay"><span>{c.name}</span><strong>{c.text}</strong><span className="category-arrow"><ArrowRight size={18}/></span></div></Link>)}</div></div></section>

      <section id="why" className="section"><div className="container value-grid"><div className="value-intro"><div className="eyebrow">THE NOVAMART STANDARD</div><h2>Less noise. Better choices.</h2><p>Every item is presented with the details you actually need, clear pricing, honest stock status and a checkout designed to get out of your way.</p></div><div className="value-items"><div><span className="value-icon"><Sparkles/></span><h3>Curated, not crowded</h3><p>A focused collection instead of endless scrolling.</p></div><div><span className="value-icon"><ShieldCheck/></span><h3>Secure by design</h3><p>Passwords are hashed and protected APIs require authentication.</p></div><div><span className="value-icon"><Truck/></span><h3>Shipping made simple</h3><p>Free shipping kicks in at $50 with a clear order summary.</p></div><div><span className="value-icon"><Leaf/></span><h3>Built for longevity</h3><p>Quality-led products with descriptions that help you choose well.</p></div></div></div></section>

      <section id="newsletter" className="newsletter"><div className="container newsletter-inner"><div><div className="eyebrow">STAY IN THE LOOP</div><h2>The good stuff, occasionally.</h2><p>New arrivals, useful guides and curated picks. No inbox clutter.</p></div><form onSubmit={(e) => e.preventDefault()} className="newsletter-form"><input aria-label="Email address" type="email" placeholder="you@example.com" required/><button className="btn btn-dark">Join newsletter</button></form></div></section>
    </main>
  </>;
}
