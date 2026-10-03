import { ClipboardList, Package, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';

const money=v=>`$${Number(v).toFixed(2)}`;

export default function Admin() {
  const { user, loading:authLoading }=useAuth(); const [products,setProducts]=useState([]),[orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const load=async()=>{setLoading(true);setError('');try{const [p,o]=await Promise.all([api.get('/products'),api.get('/orders/admin/all')]);setProducts(p.data.products);setOrders(o.data.orders);}catch(e){setError(getErrorMessage(e));}finally{setLoading(false);}};
  useEffect(()=>{if(user?.role==='ADMIN')load();else setLoading(false);},[user]);
  const revenue=useMemo(()=>orders.reduce((sum,o)=>sum+o.total,0),[orders]);
  if(authLoading)return <main className="section"><Loading/></main>; if(!user||user.role!=='ADMIN')return <Navigate to="/account" replace/>;
  const updateStatus=async(id,status)=>{try{await api.patch(`/orders/admin/${id}/status`,{status});load();}catch(e){setError(getErrorMessage(e));}};
  return <main className="section"><div className="container admin-page"><div className="admin-head"><div><div className="eyebrow">CONTROL CENTER</div><h1 className="page-title">NovaMart admin.</h1><p>Keep inventory and fulfillment moving from one place.</p></div><button className="icon-text-btn" onClick={load}><RefreshCcw size={17}/> Refresh</button></div>{error&&<div className="alert">{error}</div>}{loading?<Loading label="Loading dashboard"/>:<><div className="stats-grid"><div className="stat-card"><Package/><span>Active products</span><strong>{products.length}</strong></div><div className="stat-card"><ClipboardList/><span>Orders</span><strong>{orders.length}</strong></div><div className="stat-card"><ShieldCheck/><span>Revenue</span><strong>{money(revenue)}</strong></div></div><section className="admin-section"><div className="section-heading compact"><div><div className="eyebrow">INVENTORY</div><h2>Products</h2></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><div className="table-product"><img src={p.imageUrl} alt=""/><span>{p.name}</span></div></td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td></tr>)}</tbody></table></div></section><section className="admin-section"><div className="section-heading compact"><div><div className="eyebrow">FULFILLMENT</div><h2>Recent orders</h2></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.slice(0,30).map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.user?.name}<small className="table-sub">{o.user?.email}</small></td><td>{money(o.total)}</td><td><select className="status-select" value={o.status} onChange={e=>updateStatus(o.id,e.target.value)}>{['PLACED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></section></>}</div></main>;
}
