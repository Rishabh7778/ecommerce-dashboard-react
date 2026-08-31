import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../Navbar';
import Footer from '../Footer';

const SiteBreadcrumb = () => {
  const { pathname } = useLocation();
  if (pathname === '/') return null;

  const labels: Record<string, string> = {
    '/shop': 'Shop', '/about': 'About Us', '/contact': 'Contact Us', '/privacy': 'Privacy Policy', '/terms': 'Terms & Conditions',
    '/cart': 'Shopping Cart', '/wishlist': 'Wishlist', '/account': 'My Account', '/login': 'Login',
  };
  const current = pathname.startsWith('/product/') ? 'Product Details' : labels[pathname] || 'Page';

  return <div className="border-y border-slate-100 bg-white">
    <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm sm:px-6 lg:px-8">
      <Link to="/" className="font-medium text-slate-500 transition-colors hover:text-[#31b875]">Home</Link>
      <ChevronRight size={15} className="text-slate-400" />
      <span className="font-bold text-[#19364d]">{current}</span>
    </nav>
  </div>;
};

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <SiteBreadcrumb />
      
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
