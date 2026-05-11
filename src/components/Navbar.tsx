import  { useState, useEffect } from 'react';
import {  ShoppingCart, User, 
  Grid, ChevronDown, Flame, Headphones 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
// 1. Redux hooks import karein
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Header = () => {

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Total quantity calculate karein
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔥 ANIMATED SLIDER LOGIC START
  const announcements = [
    <p key="1"><span className="text-[#3BB77E] font-medium">100% Secure delivery</span> without contacting the courier.</p>,
    <p key="2"><span className="text-[#3BB77E] font-medium">Free Shipping</span> on all orders above ₹500!</p>,
    <p key="3">Mega Sale: Get <span className="text-red-500 font-bold">Flat 20% OFF</span> on your first order.</p>,
    <p key="4">Need help? Call Us: <span className="text-[#3BB77E] font-medium">+91 98765 43210</span></p>
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Har 3 second mein index badhayenge
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true); // Animation ON karein
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Infinite Loop Hack: Agar last (clone) element par pahunch gaye, 
  // toh chup-chap bina animation ke wapas 0 par aa jao.
  useEffect(() => {
    if (currentIndex === announcements.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // Animation OFF karein
        setCurrentIndex(0); // Snap back to 0
      }, 700); // 700ms (CSS transition time) tak wait karo
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, announcements.length]);
  // 🔥 ANIMATED SLIDER LOGIC END

  return (
    <header className="w-full bg-white font-sans">
      
      {/* 1. Top Announcement Bar (🔥 Infinite Smooth Vertical Slider) */}
      <div className="hidden lg:flex justify-center items-center h-10 px-8 text-[13px] text-gray-500 border-b border-gray-100 bg-[#f8f9fa] overflow-hidden">
        <div 
          // Agar transitioning true hai, toh smoothly jayega, warna jhatke se (snap) jayega
          className={`flex flex-col text-center ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateY(-${currentIndex * 40}px)` }} // 40px height fix
        >
          {/* Original elements ke sath 1st element ki COPY last mein add kar di */}
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
            {/* Using text placeholder for logo image */}
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
            {/* Cart - With Dynamic Redux Count */}
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
        
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md flex items-center gap-2 font-semibold text-sm transition-colors">
            <Grid size={18} />
            Browse All Categories
            <ChevronDown size={16} className="ml-2" />
          </button>

          <nav className="flex items-center gap-6 font-semibold text-sm text-gray-700">
            <a href="#" className="flex items-center gap-1 text-green-500 hover:text-green-600">
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