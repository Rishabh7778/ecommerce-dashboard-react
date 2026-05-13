import { useState, useEffect } from 'react';
import { ShoppingCart, User, Grid, ChevronDown, Flame, Headphones } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom'; // 🔥 Link import kiya dropdown navigation ke liye
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// 🔥 Apna sahi API path yahan daalein (jaise categoryApi ya discountApi)
import { useGetCategoriesQuery } from '../services/discountApi'; 

const Header = () => {

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔥 Fetch dynamic categories from Backend
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  // Agar API response mein data object ke andar hai toh aise set karein: data?.categories || []

  // Dropdown state handle karne ke liye
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 🔥 ANIMATED SLIDER LOGIC START
  const announcements = [
    <p key="1"><span className="text-[#3BB77E] font-medium">100% Secure delivery</span> without contacting the courier.</p>,
    <p key="2"><span className="text-[#3BB77E] font-medium">Free Shipping</span> on all orders above ₹500!</p>,
    <p key="3">Mega Sale: Get <span className="text-red-500 font-bold">Flat 20% OFF</span> on your first order.</p>,
    <p key="4">Need help? Call Us: <span className="text-[#3BB77E] font-medium">+91 98765 43210</span></p>
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentIndex === announcements.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, announcements.length]);
  // 🔥 ANIMATED SLIDER LOGIC END

  return (
    <header className="w-full bg-white font-sans">
      
      {/* 1. Top Announcement Bar */}
      <div className="hidden lg:flex justify-center items-center h-10 px-8 text-[13px] text-gray-500 border-b border-gray-100 bg-[#f8f9fa] overflow-hidden">
        <div 
          className={`flex flex-col text-center ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateY(-${currentIndex * 40}px)` }}
        >
          {[...announcements, announcements[0]].map((announcement, index) => (
            <div key={index} className="h-10 flex items-center justify-center whitespace-nowrap">
              {announcement}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Middle Main Header */}
      <div className="flex flex-wrap lg:flex-nowrap justify-evenly items-center px-8 py-6 gap-6 border-b border-gray-100">
        
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit cursor-pointer">
          <div className="text-4xl text-green-500 font-black tracking-tight flex items-center">
            <span className="text-yellow-400 mr-1 text-3xl">🥚</span>Nest
          </div>
          <div className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase mt-3">
            Mart & Grocery
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex border-2 border-green-500 rounded-md overflow-hidden">
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="w-full px-4 py-2.5 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button className="bg-green-500 text-white px-6 font-semibold text-sm hover:bg-green-600 transition-colors">
            Search
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            <NavLink to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-green-500 group">
              <div className="relative">
                <ShoppingCart size={24} className="text-gray-600 group-hover:text-green-500 transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              </div>
              <span className="text-sm font-medium hidden lg:block">Cart</span>
            </NavLink>

            <NavLink to="/account" className="flex items-center gap-2 text-gray-700 hover:text-green-500 group">
              <User size={24} className="text-gray-600 group-hover:text-green-500 transition-colors" />
              <span className="text-sm font-medium hidden lg:block">Account</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* 3. Bottom Navbar */}
      <div className="hidden lg:flex justify-evenly items-center px-8 py-3 border-b border-gray-100">
        
        <div className="flex items-center gap-8">
          
          {/* 🔥 Dynamic Category Dropdown Box */}
          {/* 🔥 MEGA MENU CATEGORY DROPDOWN */}
          <div 
            className="relative group" // hover manage karne ke liye 'group' best hai
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="bg-[#3BB77E] hover:bg-[#2e9c68] text-white px-5 py-3 rounded-md flex items-center gap-2 font-bold text-sm transition-colors shadow-sm">
              <Grid size={18} />
              Browse All Categories
              <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Container */}
            {isCategoryOpen && (
              // pt-2 diya hai taaki button aur menu ke beech gap cover ho jaye aur mouse leave na ho
              <div className="absolute top-full left-0 pt-2 w-[500px] z-50"> 
                <div className="bg-white border border-gray-100 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-6">
                  
                  {isCategoriesLoading ? (
                    <div className="text-center py-5 text-gray-400 font-medium animate-pulse">Loading Categories...</div>
                  ) : categories && categories.length > 0 ? (
                    // 🔥 2-Column Grid Format (Mega Menu Look)
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {categories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`} 
                          onClick={() => setIsCategoryOpen(false)}
                          className="block px-4 py-2.5 text-[14px] font-medium text-gray-600 rounded-md hover:bg-[#def9ec] hover:text-[#3BB77E] transition-all duration-200"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-gray-400 font-medium">No Categories Found</div>
                  )}

                </div>
              </div>
            )}
          </div>
          {/* 🔥 MEGA MENU END */}

          <nav className="flex items-center gap-6 font-semibold text-sm text-gray-700">
            <a href="#deals-of-the-day" className="flex items-center gap-1 text-green-500 hover:text-green-600">
              <Flame size={18} className="text-green-500" /> Hot Deals
            </a>
            <NavLink to="/" className="flex items-center gap-1 hover:text-green-500 transition-colors">Home </NavLink>
            <NavLink to="/about" className="hover:text-green-500 transition-colors">About</NavLink>
            <NavLink to="/shop" className="flex items-center gap-1 hover:text-green-500 transition-colors">Shop <ChevronDown size={14} className="text-gray-400" /></NavLink>
            <NavLink to="/blog" className="flex items-center gap-1 hover:text-green-500 transition-colors">Blog <ChevronDown size={14} className="text-gray-400" /></NavLink>
            <NavLink to="/contact" className="hover:text-green-500 transition-colors">Contact</NavLink>
          </nav>
        </div>

        {/* Support Center */}
        <div className="flex items-center gap-3">
          <Headphones size={32} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-green-500 text-xl font-bold leading-none">1900888123</span>
            <span className="text-[11px] text-gray-500 font-medium">24/7 Support Center</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;