import { ArrowUpRight, Instagram, Mail, Twitter } from 'lucide-react';
import Logo from './Logo.jsx';
import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand"><Logo /><p>Curated technology and everyday essentials, selected for people who care how things work and feel.</p><div className="socials"><span><Instagram size={17}/></span><span><Twitter size={17}/></span><span><Mail size={17}/></span></div></div>
      <div><div className="footer-title">Explore</div><Link to="/shop">All products</Link><Link to="/shop?featured=true">Featured</Link><Link to="/orders">Orders</Link></div>
      <div><div className="footer-title">Company</div><a href="#why">Why NovaMart</a><a href="mailto:hello@novamart.demo">Contact</a><a href="#newsletter">Newsletter</a></div>
      <div className="footer-note"><div className="eyebrow">BUILT FOR REAL DEVICES</div><p>Designed to feel premium on a phone, tablet and desktop.</p><Link className="text-link" to="/shop">Start shopping <ArrowUpRight size={16}/></Link></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} NovaMart.</span><span>CodeAlpha Full Stack Development — Task 1</span></div>
  </footer>;
}
