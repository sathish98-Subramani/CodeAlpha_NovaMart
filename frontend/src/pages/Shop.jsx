import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import ProductGrid from '../components/ProductGrid.jsx';

const categories = ['All', 'Audio', 'Wearables', 'Workspace', 'Tech', 'Accessories', 'Lifestyle'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get('category') || 'All';
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [query, setQuery] = useState(params.get('q') || ''); const [sort, setSort] = useState('featured'); const [category, setCategory] = useState(initialCategory);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setLoading(true); setError('');
    api.get('/products', { params: { q: query || undefined, category, sort, featured: params.get('featured') || undefined } })
      .then((r) => setProducts(r.data.products)).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, [query, category, sort, params]);

  const title = useMemo(() => category === 'All' ? 'Everything worth keeping around.' : category, [category]);
  const selectCategory = (value) => { setCategory(value); setParams((prev) => { if (value === 'All') prev.delete('category'); else prev.set('category', value); return prev; }, { replace: true }); };

  return <main className="shop-page section"><div className="container">
    <div className="shop-header"><div><div className="eyebrow">THE SHOP</div><h1>{title}</h1><p>Thoughtfully selected essentials with clear details and no unnecessary noise.</p></div><button className="filter-toggle mobile-only" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={18}/> Filters</button></div>
    <div className="shop-layout">
      <aside className={`filters ${mobileFilters ? 'filters-open' : ''}`}>
        <div className="filter-top mobile-only"><strong>Filters</strong><button className="icon-btn" onClick={() => setMobileFilters(false)}><X size={20}/></button></div>
        <div className="filter-group"><span className="filter-label">Category</span>{categories.map(c => <button key={c} className={category === c ? 'filter-option active' : 'filter-option'} onClick={() => { selectCategory(c); setMobileFilters(false); }}>{c}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
      </aside>
      {mobileFilters && <div className="filter-backdrop mobile-only" onClick={() => setMobileFilters(false)} />}
      <section className="shop-results"><div className="search-row"><div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, categories..."/></div><span className="result-count">{loading ? '...' : `${products.length} products`}</span></div>{error ? <div className="alert">{error}</div> : <ProductGrid products={products} loading={loading} emptyMessage="Try another search or category."/>}</section>
    </div>
  </div></main>;
}
