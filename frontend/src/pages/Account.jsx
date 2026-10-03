import { LogOut, Package, ShieldCheck, UserRound } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Account() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <main className="section"><div className="container account-page"><div className="eyebrow">MY ACCOUNT</div><h1 className="page-title">Hello, {user.name.split(' ')[0]}.</h1><div className="account-grid"><section className="account-card profile-card"><span className="account-avatar"><UserRound/></span><div><h2>{user.name}</h2><p>{user.email}</p><span className="role-pill">{user.role === 'ADMIN' ? 'Administrator' : 'Customer'}</span></div></section><Link className="account-card action-card" to="/orders"><Package/><div><h3>My orders</h3><p>View order history and current statuses.</p></div></Link>{user.role==='ADMIN' && <Link className="account-card action-card" to="/admin"><ShieldCheck/><div><h3>Admin dashboard</h3><p>Manage products and order fulfillment.</p></div></Link>}<button className="account-card action-card danger" onClick={logout}><LogOut/><div><h3>Sign out</h3><p>End your current session on this device.</p></div></button></div></div></main>;
}
