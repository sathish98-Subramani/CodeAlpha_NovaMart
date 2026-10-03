import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

export default function Register() {
  const { register } = useAuth(); const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async e => { e.preventDefault(); setLoading(true); setError(''); try { await register(form.name, form.email, form.password); nav('/account'); } catch(err) { setError(getErrorMessage(err)); } finally { setLoading(false); } };
  return <main className="auth-page"><div className="auth-card"><div className="eyebrow">JOIN NOVAMART</div><h1>Create your account</h1><p>Save your details and keep every order in one place.</p>{error && <div className="alert">{error}</div>}<form onSubmit={submit} className="stack-form"><label>Full name<div className="input-icon"><UserRound size={18}/><input required minLength="2" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your name"/></div></label><label>Email<div className="input-icon"><Mail size={18}/><input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com"/></div></label><label>Password<div className="input-icon"><LockKeyhole size={18}/><input required minLength="8" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/></div></label><button className="btn btn-dark full-btn" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button></form><div className="auth-foot">Already have an account? <Link to="/login">Sign in</Link></div></div></main>;
}
