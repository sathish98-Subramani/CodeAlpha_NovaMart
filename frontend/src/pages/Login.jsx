import { LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { await login(form.email, form.password); nav(location.state?.from || '/account'); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } };
  return <main className="auth-page"><div className="auth-card"><div className="eyebrow">WELCOME BACK</div><h1>Sign in to NovaMart</h1><p>Track orders, manage your account and check out faster.</p>{error && <div className="alert">{error}</div>}<form onSubmit={submit} className="stack-form"><label>Email<div className="input-icon"><Mail size={18}/><input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com"/></div></label><label>Password<div className="input-icon"><LockKeyhole size={18}/><input required type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="••••••••"/></div></label><button className="btn btn-dark full-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form><div className="auth-foot">New to NovaMart? <Link to="/register">Create an account</Link></div></div></main>;
}
