import { ChevronDown, PackageOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';

const money=v=>`$${Number(v).toFixed(2)}`;
const date=v=>new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});

export default function Orders() {
  const { user, loading: authLoading } = useAuth(); const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [expanded,setExpanded]=useState(null);
  useEffect(()=>{if(!user)return;api.get('/orders/mine').then(r=>setOrders(r.data.orders)).catch(e=>setError(getErrorMessage(e))).finally(()=>setLoading(false));},[user]);
  if(authLoading)return <main className="section"><Loading/></main>; if(!user)return <Navigate to="/login" replace/>;
  return <main className="section"><div className="container orders-page"><div className="eyebrow">ORDER HISTORY</div><h1 className="page-title">Your orders.</h1>{loading?<Loading label="Loading order history"/>:error?<div className="alert">{error}</div>:!orders.length?<div className="empty-state"><PackageOpen size={38}/><h3>No orders yet</h3><p>Your first great find is still out there.</p><Link className="btn btn-dark" to="/shop">Browse the collection</Link></div>:<div className="orders-list">{orders.map(order=><article className="order-card" key={order.id}><button className="order-head" onClick={()=>setExpanded(expanded===order.id?null:order.id)}><div><span className="eyebrow">{order.orderNumber}</span><strong>{date(order.createdAt)}</strong></div><div className="order-head-right"><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span><strong>{money(order.total)}</strong><ChevronDown size={19} className={expanded===order.id?'rotate':''}/></div></button>{expanded===order.id&&<div className="order-body"><div className="order-items">{order.items.map(item=><div className="order-item" key={item.id}><img src={item.product?.imageUrl} alt=""/><span>{item.product?.name}<small>Qty {item.quantity}</small></span><strong>{money(item.price*item.quantity)}</strong></div>)}</div><div className="order-meta"><div><span>Payment</span><strong>{order.paymentMethod.replace('_DEMO','').replace('_',' ')}</strong></div><div><span>Payment status</span><strong>{order.paymentStatus.replace('_',' ')}</strong></div><div><span>Ship to</span><strong>{order.shippingAddress?.city}, {order.shippingAddress?.state}</strong></div></div></div>}</article>)}</div>}</div></main>;
}
