import { Navigate, Route, Routes } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Account from './pages/Account.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return null; return user ? children : <Navigate to="/login" replace />; }
function AdminOnly({ children }) { const { user, loading } = useAuth(); if (loading) return null; return user?.role === 'ADMIN' ? children : <Navigate to="/account" replace />; }

export default function App(){return <Routes><Route element={<RootLayout/>}><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:slug" element={<ProductDetails/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Protected><Checkout/></Protected>}/><Route path="/account" element={<Protected><Account/></Protected>}/><Route path="/orders" element={<Protected><Orders/></Protected>}/><Route path="/admin" element={<AdminOnly><Admin/></AdminOnly>}/><Route path="*" element={<NotFound/>}/></Route></Routes>}
