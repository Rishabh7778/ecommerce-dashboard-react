import { MapPin, Headphones, Mail, Clock, PhoneCall, ArrowUpRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const columns = [
    { title: 'Freshq', links: [['About Us', '/about'], ['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']] },
    { title: 'Shop', links: [['Fresh Groceries', '/shop'], ['Daily Best Sells', '/#daily-best-sells'], ['Deals of the Day', '/#deals-of-the-day'], ['My Account', '/account']] },
    { title: 'Customer Care', links: [['Track My Order', '/account'], ['My Wishlist', '/wishlist'], ['Shopping Cart', '/cart'], ['Help & Support', '/contact']] },
  ];

  return <footer className="mt-16 border-t border-emerald-100 bg-[#f4fbf7] font-sans text-[#19364d]">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2"><img src={logo} alt="Freshq" className="h-11 w-11 object-contain" /><span className="text-3xl font-black tracking-tight">Fresh<span className="text-[#31b875]">q</span></span></Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">Fresh essentials, carefully selected and delivered straight to your doorstep.</p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p className="flex gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#31b875]" />South Delhi, India</p>
            <a href="tel:8920464643" className="flex gap-2 font-bold text-[#19364d] hover:text-[#31b875]"><PhoneCall size={17} className="shrink-0 text-[#31b875]" />8920464643</a>
            <a href="mailto:help@freshq.com" className="flex gap-2 hover:text-[#31b875]"><Mail size={17} className="shrink-0 text-[#31b875]" />help@freshq.com</a>
          </div>
        </div>
        {columns.map((column) => <div key={column.title}><h3 className="text-base font-extrabold">{column.title}</h3><ul className="mt-5 space-y-3">{column.links.map(([label, path]) => <li key={label}><Link to={path} className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#31b875] hover:translate-x-0.5">{label}<ArrowUpRight size={13} /></Link></li>)}</ul></div>)}
      </div>
      <div className="mt-12 grid gap-5 rounded-2xl border border-emerald-100 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-[#31b875]"><Headphones size={20} /></span><div><p className="font-bold">Need help?</p><a href="tel:8920464643" className="text-sm font-semibold text-[#31b875]">8920464643</a></div></div>
        <div className="flex gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-[#31b875]"><Clock size={20} /></span><div><p className="font-bold">Support hours</p><p className="text-sm text-slate-500">24/7 Support Center</p></div></div>
        <div className="flex gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-[#31b875]"><Leaf size={20} /></span><div><p className="font-bold">Freshness promise</p><p className="text-sm text-slate-500">Hand-picked quality, always.</p></div></div>
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-emerald-100 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Freshq. All rights reserved.</p><div className="flex items-center gap-3"><span className="mr-1 font-semibold text-[#19364d]">Follow us</span><a href="#" aria-label="Facebook" className="rounded-full bg-white p-2 text-[#31b875] shadow-sm hover:bg-[#31b875] hover:text-white"><FaFacebook size={15} /></a><a href="#" aria-label="Instagram" className="rounded-full bg-white p-2 text-[#31b875] shadow-sm hover:bg-[#31b875] hover:text-white"><FaInstagram size={15} /></a><a href="#" aria-label="Youtube" className="rounded-full bg-white p-2 text-[#31b875] shadow-sm hover:bg-[#31b875] hover:text-white"><FaYoutube size={15} /></a></div></div>
    </div>
  </footer>;
};

export default Footer;
