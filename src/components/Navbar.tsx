import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Grid, ChevronDown, Flame, Headphones, Menu, X, Heart } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import cartTone from '../assets/cart-tone.mp3';

// API import
import { useGetCategoriesQuery } from '../services/discountApi'; 

const Header = () => {
  // 1. Pehle Redux se data nikaliye
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  
  // 2. Phir total calculate kijiye
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // 3. USKE BAAD useRef mein use kijiye
  const prevTotalItems = useRef(totalItems); 
  const wishlistItems = useSelector((state: RootState) => state.wishlist?.wishlistItems || []);

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  // ... baaki poora code same rahega

  // States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🔥 Mobile Menu State
  const [isCartAnimating, setIsCartAnimating] = useState(false); // 🔥 Cart Animation State

  // 🔥 ANIMATED SLIDER LOGIC
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

  // 🔥 CART ANIMATION & SOUND LOGIC
 useEffect(() => {
    // Condition: Jab naya count pichle count se zyada ho (Yaani user ne kuch add kiya hai)
    if (totalItems > prevTotalItems.current) {
      
      // 1. Sound Play Karo
      try {
        // Dhyan dein: File ka naam aur path ekdum match hona chahiye
        const audio = new Audio(cartTone); 
        audio.volume = 0.5; // Awaaz thodi soft rakhne ke liye
        
        // Promise catch lagana zaroori hai browser policies ke liye
        audio.play().catch(e => console.warn("Browser blocked audio:", e.message));
      } catch (error) {
        console.error("Audio error", error);
      }
      
      // 2. Animation Trigger Karo
      setIsCartAnimating(true);
      
      // Animation ka time thoda bada kar 400ms kiya hai taaki proper dikhe
      const timer = setTimeout(() => {
        setIsCartAnimating(false);
      }, 400); 

      return () => clearTimeout(timer);
    }

    // Har baar effect chalne ke baad, naye count ko save kar lo
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <header className="w-full bg-white font-sans relative z-50">
      
      {/* 1. Top Announcement Bar (Hidden on Mobile for space) */}
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

      {/* 2. Middle Main Header (Responsive) */}
      <div className="flex justify-evenly items-center px-4 lg:px-8 py-4 lg:py-6 gap-6 border-b border-gray-100">
        
        {/* 🔥 Mobile Hamburger Button */}
        <button 
          className="lg:hidden text-gray-700 hover:text-[#3BB77E]"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 min-w-fit cursor-pointer mx-auto lg:mx-0">
          <div className="text-3xl lg:text-4xl text-green-500 font-black tracking-tight flex items-center">
            <img src={logo} alt="Nest Logo" className="w-20 h-20 lg:w-12 lg:h-12 mr-2" /> Freshiq
          </div>
        </div>

        {/* Search Bar (Hidden on Mobile) */}
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
        <div className="flex items-center gap-4 lg:gap-6">
          
          <NavLink to="/account" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-green-500 group">
            <User size={24} className="text-gray-600 group-hover:text-green-500 transition-colors" />
            <span className="text-sm font-medium hidden lg:block">Account</span>
          </NavLink>
          <NavLink to="/wishlist" className="relative flex items-center gap-2 text-gray-700 hover:text-red-500 group">
  <div className="relative">
    <Heart 
      size={26} 
      className="text-gray-600 group-hover:text-red-500 transition-colors duration-300" 
    />
    {wishlistItems.length > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold border-2 border-white">
        {wishlistItems.length}
      </span>
    )}
  </div>
  <span className="text-sm font-medium hidden lg:block">Wishlist</span>
</NavLink>

          {/* 🔥 CART ICON WITH ANIMATION */}
          <NavLink to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-green-500 group">
            <div className="relative">
              <ShoppingCart 
                size={26} 
                className={`text-gray-600 group-hover:text-green-500 transition-all duration-300 ${isCartAnimating ? 'scale-125 text-[#3BB77E]' : 'scale-100'}`} 
              />
              <span className={`absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold border-2 border-white transition-transform duration-300 ${isCartAnimating ? 'scale-150 bg-red-500' : 'scale-100'}`}>
                {totalItems}
              </span>
            </div>
            <span className="text-sm font-medium hidden lg:block">Cart</span>
          </NavLink>

        </div>
      </div>

      {/* 3. Bottom Navbar (Desktop Only) */}
      <div className="hidden lg:flex justify-evenly items-center px-8 py-3 border-b border-gray-100">
        <div className="flex items-center gap-8">
          {/* Desktop Category Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="bg-[#3BB77E] hover:bg-[#2e9c68] text-white px-5 py-3 rounded-md flex items-center gap-2 font-bold text-sm transition-colors shadow-sm">
              <Grid size={18} /> Browse All Categories <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-full left-0 pt-2 w-[500px] z-50"> 
                <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-6">
                  {isCategoriesLoading ? (
                    <div className="text-center py-5 text-gray-400">Loading...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {categories?.map((cat: any) => (
                        <Link key={cat.id} to={`/shop?category=${cat.id}`} onClick={() => setIsCategoryOpen(false)} className="block px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-[#def9ec] hover:text-[#3BB77E]">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-6 font-semibold text-sm text-gray-700">
            <a href="#deals-of-the-day" className="flex items-center gap-1 text-green-500"><Flame size={18} /> Hot Deals</a>
            <NavLink to="/" className="hover:text-green-500">Home</NavLink>
            <NavLink to="/shop" className="hover:text-green-500">Shop</NavLink>
            <NavLink to="/about" className="hover:text-green-500">About</NavLink>
            <NavLink to="/contact" className="hover:text-green-500">Contact</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Headphones size={32} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-green-500 text-xl font-bold leading-none">8920464643</span>
            <span className="text-[11px] text-gray-500 font-medium">24/7 Support Center</span>
          </div>
        </div>
      </div>

      {/* 🔥 4. MOBILE SIDEBAR MENU */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
             <div className="text-2xl text-green-500 font-black tracking-tight"><span className="text-yellow-400">🥚</span>Nest</div>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            {/* Mobile Search */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <input type="text" placeholder="Search..." className="w-full px-3 py-2 text-sm focus:outline-none" />
              <button className="bg-green-500 text-white px-4 text-sm font-bold">Go</button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-4 font-bold text-gray-700">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500">Home</NavLink>
              <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500">Shop</NavLink>
              <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500">About Us</NavLink>
              <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500">Contact</NavLink>
            </nav>

            <hr className="border-gray-100" />

            {/* Mobile Categories */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Categories</h3>
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                 {isCategoriesLoading ? <span>Loading...</span> : categories?.map((cat: any) => (
                    <Link key={cat.id} to={`/shop?category=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500">
                      {cat.name}
                    </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE MENU END */}

    </header>
  );
};

export default Header;