import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Logo() {
  return <Link to="/" className="brand" aria-label="NovaMart home">
    <span className="brand-mark"><ShoppingBag size={18} strokeWidth={2.2} /></span>
    <span>NovaMart</span>
  </Link>;
}
