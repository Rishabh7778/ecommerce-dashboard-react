import  { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, Star, ArrowRight as ArrowRightIcon, Loader2 } from 'lucide-react';
import leaf from "../assets/images/Leaf.png";
import dandy from "../assets/images/Dandy.png"; // Fallback image

// 🔥 API Hook Import
import { useGetAllProductsQuery } from '../services/productApi';


const DailyBestSells = () => {
  const [activeTab, setActiveTab] = useState("All");
  const sliderRef = useRef<HTMLDivElement>(null);

  // 🔥 API Call: Fetch all products
  const { data: productsData, isLoading } = useGetAllProductsQuery({ limit: 'all' });
  
  // Safely extract products array
  const allProducts = Array.isArray(productsData) ? productsData : productsData?.products || [];

  // 🔥 Filter 1: Sirf wo products jinpar admin ne discount lagaya hai
  const dailyDeals = allProducts.filter((p: any) => p.discount > 0);

  // 🔥 Filter 2: Tab ke hisaab se filter karein
  const filteredProducts = dailyDeals.filter((p: any) => 
    activeTab === "All" || activeTab === "Deals Of the Day" || p.category_name === activeTab
  );

  // Slider function
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        
        {/* Title & Arrows */}
        <div className="flex items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Daily Best Sells</h2>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
      
      </div>

      {/* --- CONTENT SECTION (Banner + Slider) --- */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Promotional Banner */}
        <div className="lg:w-1/4 flex-shrink-0 relative rounded-2xl overflow-hidden min-h-[400px] flex items-start p-8 shadow-sm group">
          {/* Background Image (Leaf pattern) */}
          <img 
            src={leaf} 
            alt="Leaf Background" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5ed]/90 to-transparent"></div>
          
          {/* Banner Text */}
          <div className="relative z-10 flex flex-col items-start mt-4">
            <h3 className="text-3xl font-extrabold text-[#253D4E] leading-snug mb-6">
              Bring nature<br />into your<br />home
            </h3>
            <button className="bg-[#3BB77E] hover:bg-[#2fa06c] text-white text-sm font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-colors">
              Shop Now <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Right Product Slider */}
        <div 
          ref={sliderRef}
          className="lg:w-3/4 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading && (
            <div className="w-full flex items-center justify-center min-h-[300px]">
              <Loader2 className="animate-spin text-[#3BB77E] w-10 h-10" />
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
             <div className="w-full flex items-center justify-center min-h-[300px] text-gray-500 font-medium">
               No daily deals available right now.
             </div>
          )}

          {!isLoading && filteredProducts.map((product: any) => {
            // 🔥 DYNAMIC CALCULATIONS
            const originalPrice = Number(product.price);
            const discountAmount = originalPrice * (Number(product.discount) / 100);
            const discountedPrice = originalPrice - discountAmount;
            
            // Image extract
            const productImage = product.img ? product.img.split(',')[0] : dandy;
            
            // Ratings & Stock Logic
            const rating = product.rating || 4.5;
            const totalStock = product.stockCount || 100;
            // Agar backend mein sold count nahi hai, toh stock ke hisaab se dummy sold bana do taaki UI achha lage
            const soldItems = product.soldCount || Math.floor(totalStock * 0.75); 
            const soldPercentage = (soldItems / totalStock) * 100;
            
            return (
              <div 
                key={product.id} 
                className="min-w-[260px] md:min-w-[280px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-[1.2rem] p-5 hover:border-[#3BB77E] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col relative group"
              >
                {/* Badges */}
                <span className="absolute top-0 left-0 bg-[#3BB77E] text-white text-[11px] font-bold px-3 py-1.5 rounded-tl-[1.1rem] rounded-br-[1.1rem] z-10">
                  {product.discount}% Off
                </span>
                
                {product.badge && product.badge !== 'None' && (
                  <span 
                    className="absolute top-0 right-0 text-white text-[11px] font-bold px-3 py-1.5 rounded-tr-[1.1rem] rounded-bl-[1.1rem] z-10"
                    style={{ backgroundColor: product.badgeColor || '#f74b81' }}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Product Image */}
                <div className="w-full h-48 mb-4 relative overflow-hidden rounded-xl flex items-center justify-center">
                  <img 
                    src={productImage} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <span className="text-[11px] text-gray-400 mb-1">{product.category_name || 'General'}</span>
                <h3 className="text-[15px] font-bold text-[#253D4E] leading-snug mb-2 hover:text-[#3BB77E] cursor-pointer line-clamp-2">
                  {product.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#fdc040]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < Math.floor(rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(rating) ? 0 : 2} className={i >= Math.floor(rating) ? "text-gray-300" : ""} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{product.reviews || 0}</span>
                </div>

                {/* Prices (Dynamically Calculated) */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-lg font-bold text-[#3BB77E]">₹{discountedPrice.toFixed(2)}</span>
                  <span className="text-sm font-medium text-gray-400 line-through mb-0.5">₹{originalPrice.toFixed(2)}</span>
                </div>

                {/* Progress Bar Area (Sold Status) */}
                <div className="mt-auto mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-[#3BB77E] h-1.5 rounded-full" style={{ width: `${soldPercentage}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#253D4E]">Sold: {soldItems} / {totalStock}</span>
                    <span className="text-[#3BB77E]">{Math.round(soldPercentage)}%</span> 
                  </div>
                </div>
                
                {/* Full Width Add To Cart Button */}
                <button className="w-full bg-[#3BB77E] hover:bg-[#2fa06c] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-colors duration-300">
                  <ShoppingCart size={16} /> Add to cart
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default DailyBestSells;