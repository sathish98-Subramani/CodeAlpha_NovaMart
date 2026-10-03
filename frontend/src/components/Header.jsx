import { useState } from 'react';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const nav = [
    ['Shop', '/shop'], ['Audio', '/shop?category=Audio'], ['Workspace', '/shop?category=Workspace'], ['Lifestyle', '/shop?category=Lifestyle']
  ];

  return <>
    <header className="site-header">
      <div className="container header-inner">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <Logo />
        <nav className="desktop-nav">
          {nav.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('/shop')} aria-label="Search products"><Search size={20} /></button>
          <Link to={user ? '/account' : '/login'} className="icon-btn account-link" aria-label="Account"><UserRound size={20} /></Link>
          <Link to="/cart" className="bag-btn" aria-label={`Shopping bag with ${count} items`}><ShoppingBag size={20} /><span>{count}</span></Link>
        </div>
      </div>
    </header>

    {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)}>
      <aside className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-top"><Logo /><button className="icon-btn" onClick={() => setOpen(false)}><X size={22} /></button></div>
        <div className="mobile-nav">
          {nav.map(([label, to]) => <Link key={to} onClick={() => setOpen(false)} to={to}>{label}</Link>)}
          <Link onClick={() => setOpen(false)} to="/orders">My orders</Link>
          {user?.role === 'ADMIN' && <Link onClick={() => setOpen(false)} to="/admin">Admin dashboard</Link>}
          {user ? <button className="mobile-logout" onClick={() => { logout(); setOpen(false); }}>Log out</button> : <Link onClick={() => setOpen(false)} to="/login">Sign in</Link>}
        </div>
      </aside>
    </div>}
  </>;
}
