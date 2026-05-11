import React, { useState } from 'react';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
import bean from '../assets/images/Bean.png'; // Fallback image

// 🔥 API Hooks Import karein (Apne path ke hisaab se adjust kar lein)
import { useGetAllProductsQuery, useGetCategoriesQuery } from '../services/productApi';

const PopularProducts = () => {
  const [activeTab, setActiveTab] = useState("All");

  // --- API CALLS ---
  // Popular section ke liye hum limit 10 bhej rahe hain (aap isko hata bhi sakte hain)
  const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetAllProductsQuery({ limit: 10 });
  const { data: categoriesData, isLoading: isLoadingCats } = useGetCategoriesQuery();

  // Safely extract data
  const allProducts = Array.isArray(productsData) ? productsData : productsData?.products || [];
  const apiCategories = categoriesData || [];

  // "All" tab ko list ke shuru mein add karne ke liye
const displayCategories = ["All", ...apiCategories.slice(0, 4).map((c: any) => c.name)];

  // --- FILTER LOGIC ---
  const filteredProducts = allProducts.filter(
    (product: any) => activeTab === "All" || product.category_name === activeTab
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Popular Products</h2>
        
        {/* Scrollable Tabs for Mobile */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none' }}>
          {isLoadingCats ? (
             <span className="text-sm font-semibold text-gray-400">Loading Categories...</span>
          ) : (
            displayCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`whitespace-nowrap text-sm font-semibold transition-colors ${
                  activeTab === category 
                    ? "text-[#3BB77E]" 
                    : "text-gray-600 hover:text-[#3BB77E] hover:-translate-y-0.5 transition-transform"
                }`}
              >
                {category}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ERROR OR LOADING STATE */}
      {isLoadingProducts && (
        <div className="w-full flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#3BB77E] w-12 h-12" />
        </div>
      )}
      
      {isErrorProducts && (
        <div className="text-center py-10 text-red-500 font-semibold">
          Failed to load products. Please check your connection.
        </div>
      )}

      {/* PRODUCT GRID */}
      {/* 1 col mobile, 2 tablet, 3-4 laptop, 5 desktop */}
      {!isLoadingProducts && !isErrorProducts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found in this category.
            </div>
          ) : (
            filteredProducts.map((product: any) => {
              // --- DYNAMIC DATA FORMATTING ---
              // Agar multiple images hain, toh pehli image nikalenge
              const productImage = product.img ? product.img.split(',')[0] : bean;
              
              // Price Logic: Agar category discount ki wajah se price kam hai, toh asli price "oldPrice" ban jayega
              const currentPrice = product.discounted_price || product.price;
              const crossedPrice = (product.discounted_price && product.discounted_price < product.price) 
                                    ? product.price 
                                    : product.oldPrice;

              return (
                <div 
                  key={product.id} 
                  className="group relative bg-white border border-gray-200 rounded-[1.2rem] p-4 hover:border-[#3BB77E] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full"
                >
                  {/* Badges */}
                  {product.badge && product.badge !== 'None' && (
                    <span 
                      className="absolute top-0 left-0 text-white text-[11px] font-bold px-3 py-1.5 rounded-tl-[1.1rem] rounded-br-[1.1rem] z-10"
                      style={{ backgroundColor: product.badgeColor || '#3BB77E' }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {/* Agar product par alag se koi discount % hai toh usko right me dikha do */}
                  {product.discount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#f74b81] text-white text-[11px] font-bold px-3 py-1.5 rounded-tr-[1.1rem] rounded-bl-[1.1rem] z-10">
                      -{product.discount}%
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

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[11px] text-gray-400 mb-1">{product.category_name || 'General'}</span>
                    <h3 className="text-[15px] font-bold text-[#253D4E] leading-snug mb-2 hover:text-[#3BB77E] cursor-pointer line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {/* Rating (Assuming a default of 4 or 5 if not in DB yet) */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-[#fdc040]">
                        {[...Array(5)].map((_, i) => {
                          const rating = product.rating || 4; // Default to 4
                          return (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                              strokeWidth={i < Math.floor(rating) ? 0 : 2} 
                              className={i >= Math.floor(rating) ? "text-gray-300" : ""} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs text-gray-400">(4.0)</span>
                    </div>

                    {/* Brand */}
                    <p className="text-xs text-gray-400 mb-4 mt-auto">
                      By <span className="text-[#3BB77E] cursor-pointer hover:underline">{product.brand || 'Generic'}</span>
                    </p>

                    {/* Bottom Row: Price & Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-[#3BB77E]">₹{Number(currentPrice).toFixed(2)}</span>
                        {crossedPrice && (
                          <span className="text-sm font-medium text-gray-400 line-through mb-0.5">₹{Number(crossedPrice).toFixed(2)}</span>
                        )}
                      </div>
                      
                      <button className="bg-[#def9ec] hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs transition-colors duration-300">
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </section>
  );
};

export default PopularProducts;