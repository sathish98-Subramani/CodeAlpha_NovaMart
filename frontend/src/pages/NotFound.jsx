import { Link } from 'react-router-dom';
export default function NotFound(){return <main className="section"><div className="container"><div className="empty-state large-empty"><div className="eyebrow">404</div><h3>That page wandered off.</h3><p>Let's get you back to something good.</p><Link className="btn btn-dark" to="/">Return home</Link></div></div></main>}
